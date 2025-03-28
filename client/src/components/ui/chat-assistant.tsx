import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SendIcon, RefreshCcwIcon, MinimizeIcon, MaximizeIcon } from "lucide-react";
import { AssistantType, getAssistantResponse } from "@/lib/ai-assistant";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatAssistantProps {
  assistantType: AssistantType;
  title: string;
  gradientFrom: string;
  gradientTo: string;
  iconColor: string;
  initialMessage?: string;
  className?: string;
}

export function ChatAssistant({
  assistantType,
  title,
  gradientFrom,
  gradientTo,
  iconColor,
  initialMessage = "Hello! How can I assist you today?",
  className,
}: ChatAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: initialMessage },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // Focus on input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 500);
    }
  }, []);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setIsLoading(true);

    try {
      console.log("Sending message:", userMessage);
      // Get response from AI
      const response = await getAssistantResponse(userMessage, assistantType);
      console.log("Got response:", response);
      
      // Add assistant response
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    } catch (error) {
      console.error("Failed to get assistant response:", error);
      setMessages((prev) => [
        ...prev,
        { 
          role: "assistant", 
          content: "I'm sorry, I'm having trouble connecting right now. Please try again later." 
        },
      ]);
    } finally {
      setIsLoading(false);
      // Re-focus the input after sending
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleReset = () => {
    setMessages([{ role: "assistant", content: initialMessage }]);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div 
      className={cn(
        "relative rounded-lg overflow-hidden shadow-lg transition-all duration-300",
        {
          "fixed bottom-4 right-4 z-50 w-80 md:w-96": isMinimized,
          "h-[30rem] md:h-[40rem]": isExpanded && !isMinimized,
          "h-80 md:h-96": !isExpanded && !isMinimized,
          "h-14": isMinimized,
        },
        className
      )}
    >
      {/* Header */}
      <div 
        className={`flex items-center justify-between p-3 text-white`}
        style={{
          background: gradientFrom.startsWith('[') ? 
            `linear-gradient(to right, #${gradientFrom.replace('[', '').replace(']', '')}, var(--${gradientTo}, #f59e0b))` :
            `linear-gradient(to right, var(--${gradientFrom}, #F28E1C), var(--${gradientTo}, #f59e0b))`
        }}
      >
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 flex items-center justify-center rounded-full" 
               style={{ backgroundColor: `var(--${iconColor}, #f59e0b)` }}>
            {/* Icon placeholder */}
            <span className="text-white font-medium text-sm">AI</span>
          </div>
          <h3 className="font-semibold">{title}</h3>
        </div>
        <div className="flex items-center space-x-1">
          {!isMinimized && (
            <button 
              onClick={toggleExpand}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              {isExpanded ? (
                <MinimizeIcon className="h-4 w-4 text-white" />
              ) : (
                <MaximizeIcon className="h-4 w-4 text-white" />
              )}
            </button>
          )}
          <button 
            onClick={toggleMinimize}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            {isMinimized ? (
              <MaximizeIcon className="h-4 w-4 text-white" />
            ) : (
              <MinimizeIcon className="h-4 w-4 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Chat container */}
      {!isMinimized && (
        <>
          <div 
            ref={chatContainerRef}
            className="p-4 overflow-y-auto bg-white/90 dark:bg-black/80 backdrop-blur-sm transition-all duration-300 flex flex-col space-y-4"
            style={{ 
              height: "calc(100% - 120px)",
              scrollBehavior: "smooth" 
            }}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "max-w-[85%] rounded-lg p-3 animate-fadeIn",
                  message.role === "user"
                    ? "bg-gray-200 dark:bg-gray-700 ml-auto rounded-tr-none"
                    : "mr-auto rounded-tl-none border"
                )}
                style={message.role === "assistant" ? 
                  gradientFrom.startsWith('[') ? 
                  {
                    backgroundColor: `rgba(${parseInt(gradientFrom.replace('[', '').replace(']', '').substring(0, 2), 16)}, 
                                          ${parseInt(gradientFrom.replace('[', '').replace(']', '').substring(2, 4), 16)}, 
                                          ${parseInt(gradientFrom.replace('[', '').replace(']', '').substring(4, 6), 16)}, 0.1)`,
                    borderColor: `rgba(${parseInt(gradientFrom.replace('[', '').replace(']', '').substring(0, 2), 16)}, 
                                      ${parseInt(gradientFrom.replace('[', '').replace(']', '').substring(2, 4), 16)}, 
                                      ${parseInt(gradientFrom.replace('[', '').replace(']', '').substring(4, 6), 16)}, 0.2)`
                  } : 
                  {
                    backgroundColor: `var(--${gradientFrom}-50, rgba(245, 158, 11, 0.1))`,
                    borderColor: `var(--${gradientFrom}-200, rgba(245, 158, 11, 0.2))`
                  } : {}
                }
              >
                <p className="text-sm">{message.content}</p>
              </div>
            ))}
            {isLoading && (
              <div 
                className="max-w-[85%] rounded-lg p-3 mr-auto rounded-tl-none border"
                style={gradientFrom.startsWith('[') ? 
                  {
                    backgroundColor: `rgba(${parseInt(gradientFrom.replace('[', '').replace(']', '').substring(0, 2), 16)}, 
                                          ${parseInt(gradientFrom.replace('[', '').replace(']', '').substring(2, 4), 16)}, 
                                          ${parseInt(gradientFrom.replace('[', '').replace(']', '').substring(4, 6), 16)}, 0.1)`,
                    borderColor: `rgba(${parseInt(gradientFrom.replace('[', '').replace(']', '').substring(0, 2), 16)}, 
                                      ${parseInt(gradientFrom.replace('[', '').replace(']', '').substring(2, 4), 16)}, 
                                      ${parseInt(gradientFrom.replace('[', '').replace(']', '').substring(4, 6), 16)}, 0.2)`
                  } : 
                  {
                    backgroundColor: `var(--${gradientFrom}-50, rgba(245, 158, 11, 0.1))`,
                    borderColor: `var(--${gradientFrom}-200, rgba(245, 158, 11, 0.2))`
                  }
                }
              >
                <div className="flex space-x-2 items-center">
                  <div className="h-2 w-2 rounded-full animate-pulse" 
                       style={gradientFrom.startsWith('[') ? 
                         { backgroundColor: `#${gradientFrom.replace('[', '').replace(']', '')}` } : 
                         { backgroundColor: `var(--${gradientFrom}, #F28E1C)` }
                       }></div>
                  <div className="h-2 w-2 rounded-full animate-pulse [animation-delay:-0.3s]"
                       style={gradientFrom.startsWith('[') ? 
                         { backgroundColor: `#${gradientFrom.replace('[', '').replace(']', '')}` } : 
                         { backgroundColor: `var(--${gradientFrom}, #F28E1C)` }
                       }></div>
                  <div className="h-2 w-2 rounded-full animate-pulse [animation-delay:-0.6s]"
                       style={gradientFrom.startsWith('[') ? 
                         { backgroundColor: `#${gradientFrom.replace('[', '').replace(']', '')}` } : 
                         { backgroundColor: `var(--${gradientFrom}, #F28E1C)` }
                       }></div>
                </div>
              </div>
            )}
          </div>

          {/* Input area */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-black/90 backdrop-blur-sm flex items-end gap-2">
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="resize-none min-h-[40px] max-h-[120px] flex-grow"
              rows={1}
            />
            <div className="flex flex-col gap-2">
              <Button
                size="icon"
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                className="text-white h-10 w-10 rounded-full"
                style={gradientFrom.startsWith('[') ? 
                  { 
                    backgroundColor: `#${gradientFrom.replace('[', '').replace(']', '')}`,
                    borderColor: 'transparent' 
                  } : 
                  {
                    backgroundColor: `var(--${gradientFrom}, #F28E1C)`,
                    borderColor: `var(--${gradientFrom}-700, #be7316)`
                  }
                }
                aria-label="Send message"
              >
                <SendIcon className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={handleReset}
                className="h-10 w-10 rounded-full"
                aria-label="Reset conversation"
              >
                <RefreshCcwIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}