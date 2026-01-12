'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Bot, Send, Loader2, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { recordAuditLog } from '@/app/actions/audit';
import { clsx } from 'clsx'

interface AiChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  context: {
    page: string;
    projectId?: string;
    systemId?: string;
    domain?: string;
    // ... toutes les données pertinentes de la page (ex: nodes, edges si sérialisés)
  };
}

export function AiChatModal({ isOpen, onClose, context }: AiChatModalProps) {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!isOpen) return null;

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, context }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur de l'IA.");
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'ai', content: data.response }]);
    } catch (error: any) {
      toast.error(error.message || "Impossible de communiquer avec l'IA.");
      setMessages(prev => [...prev, { role: 'ai', content: `Désolé, une erreur est survenue: ${error.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-2xl h-[80vh] rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200 flex flex-col animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-3">
            <Bot className="w-5 h-5 text-purple-600" />
            <h3 className="font-black text-sm uppercase tracking-widest text-slate-900">Quantum AI Chat</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 p-6 space-y-4 overflow-y-auto custom-scrollbar">
          {messages.length === 0 && (
            <div className="text-center text-slate-400 italic py-10">
              Posez-moi une question sur votre projet ou sur l'ingénierie.
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={clsx("flex items-start gap-3", msg.role === 'user' ? "justify-end" : "")}>
              {msg.role === 'ai' && <Bot className="w-6 h-6 text-purple-500 shrink-0" />}
              <div className={clsx(
                "p-3 rounded-xl max-w-[80%] text-sm",
                msg.role === 'user' 
                  ? "bg-blue-600 text-white rounded-br-none" 
                  : "bg-slate-100 text-slate-800 rounded-bl-none"
              )}>
                {msg.content}
              </div>
              {msg.role === 'user' && <MessageSquare className="w-6 h-6 text-blue-500 shrink-0" />}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3">
              <Bot className="w-6 h-6 text-purple-500 shrink-0" />
              <div className="p-3 rounded-xl bg-slate-100 text-slate-800 rounded-bl-none flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Réflexion...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 bg-slate-50/50 flex gap-3 shrink-0">
          <input
            type="text"
            className="flex-1 p-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
            placeholder="Votre question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </form>
      </div>
    </div>
  );
}
