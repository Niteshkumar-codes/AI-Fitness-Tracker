import React, { useState, useEffect, useRef } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { Sparkles, User, Send, Trash2, Copy, Check, Loader2 } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AIChatAssistant = () => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Initialize messages from sessionStorage to preserve across navigations in the current session
  const [messages, setMessages] = useState(() => {
    const saved = sessionStorage.getItem('fitai_chat_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved chat history:', e);
      }
    }
    return [
      {
        id: 'welcome',
        text: 'Hello! I am FitAI, your certified fitness assistant. How can I help you today? You can ask me about workouts, diet recommendations, hydration, or how to reach your active fitness goals!',
        sender: 'ai',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'gemini'
      }
    ];
  });

  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Persist messages to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('fitai_chat_history', JSON.stringify(messages));
  }, [messages]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMessageText = inputText.trim();
    setInputText('');

    // 1. Add user message to UI
    const userMsg = {
      id: `user-${Date.now()}`,
      text: userMessageText,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // 2. Call backend /api/ai/chat endpoint
      const response = await api.post('/ai/chat', { message: userMessageText });

      if (response.data && response.data.success) {
        // 3. Add AI message response to UI
        const aiMsg = {
          id: `ai-${Date.now()}`,
          text: response.data.data.reply,
          sender: 'ai',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          source: response.data.source || 'gemini',
        };
        setMessages((prev) => [...prev, aiMsg]);
        
        toast.success(
          response.data.source === 'fallback' 
            ? 'Response compiled from local fitness data'
            : 'Gemini Coach response received',
          {
            icon: response.data.source === 'fallback' ? '📋' : '🤖',
            style: {
              background: '#0f172a',
              color: '#f8fafc',
              border: '1px solid #1e293b',
              borderRadius: '1rem',
            }
          }
        );
      } else {
        throw new Error('Failed to get response');
      }
    } catch (error) {
      console.error('Error in chat request:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Sorry, I encountered an error. Please try again.';
      toast.error('Failed to get AI response');

      const errorMsgBubble = {
        id: `ai-err-${Date.now()}`,
        text: `I encountered an issue connecting to my core services. Here is some support advice:\n\n${errorMsg}`,
        sender: 'ai',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'fallback',
      };
      setMessages((prev) => [...prev, errorMsgBubble]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text, id) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Copied to clipboard!', {
      style: {
        background: '#0f172a',
        color: '#f8fafc',
        border: '1px solid #1e293b',
        borderRadius: '1rem',
      },
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome',
        text: 'Hello! I am FitAI, your certified fitness assistant. How can I help you today? You can ask me about workouts, diet recommendations, hydration, or how to reach your active fitness goals!',
        sender: 'ai',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'gemini'
      }
    ]);
    sessionStorage.removeItem('fitai_chat_history');
    toast.success('Chat history cleared');
  };

  // Parsing bold elements and headers in response text to render premium styling
  const formatText = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, idx) => {
      // Check for headers (e.g. ### Header or **Header**)
      if (line.startsWith('###') || line.startsWith('##') || line.startsWith('#')) {
        const cleanText = line.replace(/^[#\s]+/, '');
        return <h4 key={idx} className="text-base font-extrabold text-white mt-3 mb-1.5 tracking-tight">{cleanText}</h4>;
      }
      
      // Check for bullet points
      if (line.startsWith('*') || line.startsWith('-')) {
        const cleanText = line.substring(1).trim();
        return (
          <div key={idx} className="flex items-start gap-2 text-slate-300 text-xs md:text-sm my-1 pl-2 leading-relaxed">
            <span className="text-purple-400 mt-1 text-sm">•</span>
            <span>{parseBoldText(cleanText)}</span>
          </div>
        );
      }
      
      // Normal paragraphs
      if (line.trim() === '') return <div key={idx} className="h-2"></div>;
      
      return <p key={idx} className="text-slate-300 text-xs md:text-sm my-1 leading-relaxed">{parseBoldText(line)}</p>;
    });
  };

  const parseBoldText = (text) => {
    const parts = text.split(/\*\*([^*]+)\*\*/g);
    return parts.map((part, index) => {
      // Every odd index is bold text
      if (index % 2 === 1) {
        return <strong key={index} className="font-bold text-slate-100">{part}</strong>;
      }
      return part;
    });
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-6 md:gap-8 max-w-4xl mx-auto pb-12">
        {/* Header section */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-widest">
            <Sparkles className="w-4.5 h-4.5" />
            <span>Interactive Coach</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            AI Chat Assistant
          </h1>
          <p className="text-xs md:text-sm text-slate-400">
            Chat live with FitAI, your certified fitness assistant. Get real-time advice personalized with your profile and today's logs.
          </p>
        </div>

        {/* Chat Interface Container */}
        <div className="flex flex-col h-[600px] rounded-3xl border border-slate-900 bg-gradient-to-b from-slate-950/40 to-slate-900/20 backdrop-blur-md overflow-hidden relative shadow-2xl">
          
          {/* Chat Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-900 bg-slate-950/60 backdrop-blur-md z-10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Sparkles className="w-4.5 h-4.5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white tracking-tight">FitAI Coach</h2>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Online
                </span>
              </div>
            </div>

            {/* Clear Chat Button */}
            {messages.length > 1 && (
              <button
                onClick={handleClearChat}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-semibold text-slate-400 hover:text-red-400 hover:border-red-500/20 hover:bg-red-500/5 transition-all duration-200 cursor-pointer"
                title="Clear current session chat history"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Chat</span>
              </button>
            )}
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-950/10">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              
              if (isUser) {
                return (
                  <div key={msg.id} className="flex justify-end items-start gap-2.5 max-w-[85%] ml-auto animate-fade-in">
                    <div className="flex flex-col items-end gap-1">
                      <div className="bg-gradient-to-tr from-purple-600/20 to-indigo-600/20 border border-purple-500/25 text-slate-100 rounded-2xl rounded-tr-none px-4 py-3 text-xs md:text-sm leading-relaxed shadow-lg">
                        {msg.text}
                      </div>
                      <span className="text-[9px] text-slate-500 px-1">{msg.time}</span>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-purple-400 flex-shrink-0 mt-0.5 shadow-md">
                      <User className="w-4 h-4 text-purple-400" />
                    </div>
                  </div>
                );
              }

              return (
                <div key={msg.id} className="flex justify-start items-start gap-2.5 max-w-[85%] animate-fade-in">
                  <div className="w-8 h-8 rounded-lg bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0 mt-0.5 shadow-md">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="flex flex-col items-start gap-1">
                    <div className="bg-slate-900/60 border border-slate-900 text-slate-100 rounded-2xl rounded-tl-none px-4 py-3 text-xs md:text-sm leading-relaxed shadow-lg relative group">
                      <div className="pr-6 whitespace-pre-wrap">{formatText(msg.text)}</div>
                      
                      {/* Copy AI Response Button */}
                      <button
                        onClick={() => handleCopy(msg.text, msg.id)}
                        className="absolute top-2.5 right-2.5 p-1.5 rounded-lg border border-slate-800 text-slate-500 hover:text-slate-200 hover:border-slate-700 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer shadow-md"
                        title="Copy to clipboard"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-2 px-1">
                      <span className="text-[9px] text-slate-500">{msg.time}</span>
                      {msg.source && (
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full border tracking-wide uppercase ${
                          msg.source === 'gemini'
                            ? 'bg-purple-600/10 border-purple-500/20 text-purple-400'
                            : 'bg-amber-600/10 border-amber-500/20 text-amber-400'
                        }`}>
                          {msg.source === 'gemini' ? '🤖 Gemini AI' : '📋 Fallback AI'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex justify-start items-start gap-2.5 max-w-[85%] animate-pulse">
                <div className="w-8 h-8 rounded-lg bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0 mt-0.5 shadow-md">
                  <Sparkles className="w-4 h-4 text-purple-450 animate-pulse" />
                </div>
                <div className="bg-slate-900/60 border border-slate-900 text-slate-100 rounded-2xl rounded-tl-none px-4 py-3 shadow-lg flex items-center gap-1.5 min-h-[40px]">
                  <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Footer Input Section */}
          <div className="p-4 border-t border-slate-900 bg-slate-950/40 backdrop-blur-md z-10">
            <form onSubmit={handleSend} className="flex gap-2.5 items-center">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask FitAI a fitness question..."
                disabled={isLoading}
                className="flex-1 bg-slate-900/50 border border-slate-855 hover:border-slate-800 focus:border-purple-500/50 rounded-2xl px-4 py-3.5 text-xs md:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={isLoading || !inputText.trim()}
                className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer flex-shrink-0 hover:scale-[1.02] active:scale-[0.98]"
                title="Send message"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </MainLayout>
  );
};

export default AIChatAssistant;
