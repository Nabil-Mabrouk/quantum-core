'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Bot, Send, Loader2, MessageSquare, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { clsx } from 'clsx';
import ReactMarkdown from 'react-markdown';
import { t } from '@/lib/i18n'; // Import du helper i18n
import { useParams } from 'next/navigation'; // 1. Import
import { Locale } from '@/lib/i18n'; // 2. Import du type

interface AiChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  context: {
    page: string;
    projectId?: string;
    systemId?: string;
    domain?: string;
  };
}

export function AiChatModal({ isOpen, onClose, context }: AiChatModalProps) {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const params = useParams(); // 3. Récupère les paramètres d'URL
  const locale = (params.locale as Locale) || 'fr'; // 4. Dynamique !

  // Auto-scroll au bas du chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Nettoyage lors de la fermeture
  useEffect(() => {
    if (!isOpen && abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // Initialisation de l'AbortController pour cette requête
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Mise à jour locale immédiate (User + Placeholder AI)
    setMessages(prev => [
      ...prev, 
      { role: 'user', content: userMessage },
      { role: 'ai', content: '' }
    ]);

    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, context }),
        signal: controller.signal,
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedResponse = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedResponse += chunk;

        // Mise à jour réactive du dernier message (IA)
        setMessages(prev => {
          const updated = [...prev];
          if (updated.length > 0) {
            updated[updated.length - 1].content = accumulatedResponse;
          }
          return updated;
        });
      }
    } catch (error: any) {
      if (error.name === 'AbortError') return;
      
      toast.error(t({ fr: "Erreur de connexion avec l'IA", en: "AI Connection Error" }, locale));
      console.error(error);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };
  
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6 bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-3xl h-[85vh] rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 flex flex-col animate-in zoom-in-95 duration-300">
        
        {/* --- HEADER --- */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
                <Bot className="w-6 h-6" />
            </div>
            <div>
                <h3 className="font-black text-lg uppercase tracking-tighter text-slate-900">Quantum AI</h3>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      {t({ fr: "Expert Ingénierie Connecté", en: "Connected Engineering Expert" }, locale)}
                    </p>
                </div>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* --- MESSAGES LIST --- */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar bg-slate-50/30">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center border border-slate-100 shadow-sm text-purple-500">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <p className="font-black text-slate-900 uppercase text-xs tracking-widest">
                  {t({ fr: "Assistant contextuel", en: "Contextual Assistant" }, locale)}
                </p>
                <p className="text-sm text-slate-500 max-w-xs leading-relaxed italic">
                  {t({ 
                    fr: "\"Je connais votre projet et ses équipements. Comment puis-je vous aider dans vos calculs aujourd'hui ?\"", 
                    en: "\"I know your project and its equipment. How can I assist you with your calculations today?\"" 
                  }, locale)}
                </p>
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div 
                key={i} 
                className={clsx(
                    "flex items-start gap-3 animate-in slide-in-from-bottom-2 duration-300",
                    msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                )}
            >
              <div className={clsx(
                "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                msg.role === 'ai' ? "bg-purple-100 text-purple-600 border border-purple-200" : "bg-blue-600 text-white"
              )}>
                {msg.role === 'ai' ? <Bot className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
              </div>

              <div className={clsx(
                "p-4 rounded-[1.5rem] max-w-[85%] text-sm leading-relaxed shadow-sm transition-all",
                msg.role === 'user' 
                  ? "bg-blue-600 text-white rounded-tr-none" 
                  : "bg-white text-slate-800 border border-slate-200 rounded-tl-none"
              )}>
                {msg.role === 'ai' ? (
                  <div className="prose prose-sm prose-slate max-w-none prose-p:leading-relaxed prose-pre:bg-slate-900 prose-pre:text-blue-400">
                    <ReactMarkdown>{msg.content || "..."}</ReactMarkdown>
                  </div>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}

          {isLoading && !messages[messages.length - 1]?.content && (
            <div className="flex items-start gap-3 animate-pulse">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center border border-purple-200">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-[1.5rem] bg-white border border-slate-200 rounded-tl-none flex items-center gap-3 text-slate-400 text-xs italic shadow-sm">
                <Loader2 className="w-4 h-4 animate-spin" /> 
                {t({ fr: "Analyse des données du projet en cours...", en: "Analyzing project data..." }, locale)}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* --- INPUT FORM --- */}
        <form 
            onSubmit={handleSendMessage} 
            className="p-6 border-t border-slate-100 bg-white flex gap-4 shrink-0"
        >
          <input
            type="text"
            className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 text-sm transition-all font-medium"
            placeholder={t({ fr: "Interroger l'IA sur ce système...", en: "Ask the AI about this system..." }, locale)}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-black transition-all disabled:opacity-50 shadow-xl shadow-slate-200 flex items-center justify-center"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </form>
      </div>
    </div>
  );
}