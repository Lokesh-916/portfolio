import Groq from "groq-sdk";
import { SYSTEM_PROMPT } from "./prompt";
import { detectFunctionTrigger } from "@/lib/function-triggers";

interface Message {
  role: string;
  content: string;
}

interface ChatResponse {
  content: string;
  functionToCall?: string;
}

export const maxDuration = 30;

// ❌ Pas besoin de l'export ici, Next.js n'aime pas ça
function errorHandler(error: unknown) {
  if (error == null) {
    return 'Unknown error';
  }
  if (typeof error === 'string') {
    return error;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return JSON.stringify(error);
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return new Response("Missing Groq API key.", { status: 500 });
    }
    
    // Get the latest user message to check for function triggers
    const latestUserMessage = messages
      .filter((msg: Message) => msg.role === 'user')
      .pop()?.content || '';
    
    // Detect if a function should be triggered
    const functionToCall = detectFunctionTrigger(latestUserMessage);
    
    const groq = new Groq({ apiKey });
    
    // Add system prompt to the beginning of messages
    const messagesWithSystem = [SYSTEM_PROMPT, ...messages];
    
    // messages should be an array of { role: 'user' | 'assistant' | 'system', content: string }
    const completion = await groq.chat.completions.create({
      model: "gemma2-9b-it",
      messages: messagesWithSystem,
    });
    const content = completion.choices?.[0]?.message?.content || "";
    
    // Return response with function trigger info
    const response: ChatResponse = {
      content,
      ...(functionToCall && { functionToCall })
    };
    
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
