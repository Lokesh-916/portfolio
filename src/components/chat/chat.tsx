'use client';
import { AnimatePresence, motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useSearchParams, useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import { sendConversationEmailIfNeeded, resetEmailSentFlag } from '@/lib/chat-utils';
import { callPortfolioFunction } from '@/lib/portfolio-functions';

// Component imports
import ChatBottombar from '@/components/chat/chat-bottombar';
import ChatLanding from '@/components/chat/chat-landing';
import ChatMessageContent from '@/components/chat/chat-message-content';
import { SimplifiedChatView } from '@/components/chat/simple-chat-view';
import {
  ChatBubble,
  ChatBubbleMessage,
} from '@/components/ui/chat/chat-bubble';
import WelcomeModal from '@/components/welcome-modal';
import { Info } from 'lucide-react';
import HelperBoost from './HelperBoost';

// ClientOnly component for client-side rendering
//@ts-ignore
const ClientOnly = ({ children }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
};

// Define Avatar component props interface
interface AvatarProps {
  hasActiveTool: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isTalking: boolean;
}

// Dynamic import of Avatar component
const Avatar = dynamic<AvatarProps>(
  () =>
    Promise.resolve(({ hasActiveTool }: AvatarProps) => (
      <div
        className={`rounded-full overflow-hidden bg-white/60 shadow-lg flex items-center justify-center ${hasActiveTool ? 'h-20 w-20' : 'h-28 w-28'}`}
        >
              <img
          src="/inf.png"
          alt="Infinity"
          className="h-full w-full object-cover mix-blend-multiply opacity-80"
          style={{ background: 'transparent' }}
        />
          </div>
    )),
  { ssr: false }
);

const MOTION_CONFIG = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: {
    duration: 0.3,
    ease: 'easeOut',
  },
};

// Define Message type
interface Message {
  id: string;
  role: 'user' | 'assistant' | 'function';
  content: string;
}

function stripMarkdown(text: string): string {
  // Remove bold/italic/strikethrough
  let out = text.replace(/([*_~`])/g, '');
  // Remove headings
  out = out.replace(/^#+\s?/gm, '');
  // Remove lists
  out = out.replace(/^[-*+]\s+/gm, '');
  // Remove links but keep text
  out = out.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
  // Remove images
  out = out.replace(/!\[([^\]]*)\]\([^\)]+\)/g, '$1');
  // Remove blockquotes
  out = out.replace(/^>\s?/gm, '');
  // Remove code blocks
  out = out.replace(/`{1,3}[^`]*`{1,3}/g, '');
  return out;
}

const Chat = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('query');
  const initialQuerySubmitted = useRef(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  // Helper to send message to backend and update state
  const sendMessage = async (userMessage: string) => {
    if (loadingSubmit) return;
    setLoadingSubmit(true);
    setIsTalking(true);

    // Create the new user message
    const userMsg = {
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      role: 'user' as 'user',
      content: userMessage,
    };

    // Compute the new messages array
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages
            .filter(({ role }) => role === 'user' || role === 'assistant')
            .map(({ role, content }) => ({ role, content })),
        }),
      });
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(text);
      }
      const aiMsg = {
        id: Date.now().toString() + Math.random().toString(36).slice(2),
        role: 'assistant' as 'assistant',
        content: data.content,
      };
      setMessages((prev) => [...prev, aiMsg]);
      
      // Handle function triggers if any
      if (data.functionToCall) {
        const functionResult = callPortfolioFunction(data.functionToCall);
        if (functionResult) {
          setMessages(prev => [
            ...prev,
            {
              id: Date.now().toString() + Math.random().toString(36).slice(2),
              role: 'function',
              content: functionResult.content,
            }
          ]);
        }
      }
    } catch (err: any) {
      toast.error('Error: ' + (err?.message || 'Unknown error'));
    } finally {
      setIsTalking(false);
      setLoadingSubmit(false);
    }
  };

  // For initial query from URL
  useEffect(() => {
    if (initialQuery && !initialQuerySubmitted.current) {
      initialQuerySubmitted.current = true;
      setInput('');
      sendMessage(initialQuery);
      router.replace('/chat');
    }
  }, [initialQuery, router]);

  // Video control for talking state
  useEffect(() => {
    if (videoRef.current) {
      if (isTalking) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isTalking]);

  // Page leave detection - send email when user leaves
  useEffect(() => {
    // Reset email flag when component mounts (new session)
    resetEmailSentFlag();

    const handleBeforeUnload = () => {
      if (messages.length > 0) {
        // Only send user/assistant messages to backend
        const filteredMessages = messages.filter(m => m.role === 'user' || m.role === 'assistant') as { role: 'user' | 'assistant'; content: string; }[];
        sendConversationEmailIfNeeded(filteredMessages);
      }
    };

    // Add beforeunload listener
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [messages]);

  // Submit handler
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || loadingSubmit) return;
    sendMessage(input);
    setInput('');
  };

  // Input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  // Stop handler (no-op for Gemini, but keeps UI consistent)
  const handleStop = () => {
    setLoadingSubmit(false);
    setIsTalking(false);
    if (videoRef.current) videoRef.current.pause();
  };

  // Auto-scroll to bottom when new messages are added
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, loadingSubmit]);

  // Memo for latest messages
  const latestUserMessage = messages.length > 0 ? [...messages].reverse().find((m) => m.role === 'user') : null;
  const currentAIMessage = messages.length > 0 ? [...messages].reverse().find((m) => m.role === 'assistant') : null;
  const isEmptyState = messages.length === 0 && !loadingSubmit;

  // Calculate header height based on hasActiveTool
  const headerHeight = currentAIMessage ? 100 : 180;

  // Handler for Go to Home (Education) button
  const goToHomeEducation = () => {
    router.push('/#education');
  };

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Go to Home (Education) Button */}
      <button
        onClick={goToHomeEducation}
        className="fixed top-6 left-1/2 z-50 -translate-x-1/2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-lg transition-all"
        style={{ minWidth: 180 }}
      >
        Go to Home (Education)
      </button>
      <div className="absolute top-6 right-8 z-51 flex flex-col-reverse items-center justify-center gap-1 md:flex-row">
        <WelcomeModal
          trigger={
            <div className="hover:bg-accent cursor-pointer rounded-2xl px-3 py-1.5">
              <Info className="text-accent-foreground h-8" />
            </div>
          }
        />
      </div>

      {/* Fixed Avatar Header with Gradient */}
      <div
        className="fixed top-0 right-0 left-0 z-50"
        style={{
          background:
            'linear-gradient(to bottom, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.95) 30%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0) 100%)',
        }}
      >
        <div
          className={`${currentAIMessage ? 'pt-6 pb-0' : 'py-6'}`}
        >
          <div className="flex justify-center">
            <ClientOnly>
              <Avatar
                hasActiveTool={currentAIMessage ? true : false}
                videoRef={videoRef}
                isTalking={isTalking}
              />
            </ClientOnly>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto flex h-full max-w-3xl flex-col flex-grow min-h-0">
        {/* Scrollable Chat Content */}
        <div
          ref={chatContainerRef}
          className="flex-1 min-h-0 overflow-y-auto px-2"
          style={{ paddingTop: `${headerHeight}px` }}
        >
          <AnimatePresence>
            {isEmptyState ? (
              <motion.div
                key="landing"
                className="flex min-h-full items-center justify-center"
                {...MOTION_CONFIG}
              >
                <ChatLanding submitQuery={sendMessage} />
              </motion.div>
            ) : (
              <>
                {messages.map((msg) => (
                  <div key={msg.id} className="pb-4">
                    <ChatBubble variant={msg.role === 'user' ? 'sent' : msg.role === 'function' ? 'received' : 'received'}>
                      <ChatBubbleMessage>
                        {msg.role === 'assistant' ? (
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        ) : msg.role === 'function' ? (
                          <div style={{ fontStyle: 'italic', color: '#2563eb' }}>{msg.content}</div>
                        ) : (
                          <div>{msg.content}</div>
                        )}
                      </ChatBubbleMessage>
                    </ChatBubble>
                  </div>
                ))}
                {loadingSubmit && (
                  <div className="pb-4">
                    <ChatBubble variant="received">
                      <ChatBubbleMessage isLoading />
                    </ChatBubble>
                  </div>
                )}
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Fixed Bottom Bar */}
        <div className="sticky bottom-0 bg-white px-2 pt-3 md:px-0 md:pb-4">
          <div className="relative flex flex-col items-center gap-3">
            <HelperBoost submitQuery={sendMessage} setInput={setInput} />
            <ChatBottombar
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={onSubmit}
              isLoading={loadingSubmit}
              stop={handleStop}
              isToolInProgress={false}
            />
          </div>
        </div>
        <a
          href="https://www.linkedin.com/in/lokeshbabu-kolamala"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed right-3 bottom-0 z-10 mb-4 hidden cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-sm hover:underline md:block"
        >
          @Lokesh
        </a>
      </div>
    </div>
  );
};

export default Chat;
