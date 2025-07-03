import { GoogleGenerativeAI } from "@google/generative-ai";

interface Message {
  role: string;
  content: string;
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
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response("Missing Gemini API key.", { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Convert your messages to a single prompt string
    const prompt = (messages as Message[]).map((m: Message) => `${m.role}: ${m.content}`).join('\n');

    const result = await model.generateContent(prompt);

    // Extract the response text
    const text = result.response.text();

    return new Response(JSON.stringify({ text }), { status: 200 });
  } catch (err) {
    console.error('Global error:', err);
    const errorMessage = errorHandler(err);
    return new Response(errorMessage, { status: 500 });
  }
}
