'use client';

import { useState } from 'react';
import { X, MessageSquareText, Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';
import { recordAuditLog } from '@/app/actions/audit'; // Notre action d'audit

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  context: {
    page: string;
    projectId?: string;
    systemId?: string;
    domain?: string;
  };
}

export function FeedbackModal({ isOpen, onClose, context }: FeedbackModalProps) {
  const [comment, setComment] = useState('');
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Votre commentaire est vide.");
      return;
    }
    setIsSending(true);
    try {
      await recordAuditLog(
        "FEEDBACK_SUBMITTED", 
        context.domain, 
        { ...context, comment }
      );
      toast.success("Merci pour votre feedback !");
      onClose();
      setComment('');
    } catch (error) {
      toast.error("Erreur lors de l'envoi du feedback.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-3">
            <MessageSquareText className="w-5 h-5 text-blue-600" />
            <h3 className="font-black text-sm uppercase tracking-widest text-slate-900">Envoyer un Feedback</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <p className="text-sm text-slate-600">
            Votre avis nous aide à améliorer Quantum Core. Décrivez votre suggestion ou problème.
          </p>
          <textarea
            className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
            placeholder="Votre commentaire ici..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            disabled={isSending}
          />
          <div className="text-xs text-slate-400 italic">
            Contexte de la page: {context.page} {context.projectId ? `(Projet: ${context.projectId})` : ''}
          </div>
          <button
            type="submit"
            disabled={isSending || !comment.trim()}
            className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Envoyer
          </button>
        </form>
      </div>
    </div>
  );
}