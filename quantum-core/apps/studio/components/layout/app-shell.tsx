'use client';

import { useState, Suspense } from 'react';
import { usePathname, useParams, useSearchParams } from 'next/navigation';
import { MessageSquareText, Bot } from 'lucide-react';
import { FeedbackModal } from '@/components/ui/feedback-modal';
import { AiChatModal } from '@/components/ui/ai-chat-modal';
import { getDomainConfig } from '@/lib/registry';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isAiChatModalOpen, setIsAiChatModalOpen] = useState(false);
  
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();
  const config = getDomainConfig();

  const currentProjectId = params?.id ? (params.id as string) : undefined;
  const currentSystemId = searchParams.get('systemId') || undefined;
  
  const context = {
    page: pathname,
    projectId: currentProjectId,
    systemId: currentSystemId,
    domain: config.id,
  };

  return (
    <>
      {children}

      {/* --- BOUTON FLOTTANT DE FEEDBACK (Bas Droite - Position 2) --- */}
      <button 
        onClick={() => setIsFeedbackModalOpen(true)}
        className="fixed bottom-20 right-6 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all z-[90] flex items-center gap-2 group overflow-hidden"
        title="Envoyer un feedback"
      >
        <MessageSquareText className="w-5 h-5 flex-shrink-0" />
        <span className="max-w-0 opacity-0 group-hover:max-w-[100px] group-hover:opacity-100 transition-all duration-300 ease-in-out font-bold text-sm whitespace-nowrap">
          Feedback
        </span>
      </button>

      {/* --- BOUTON FLOTTANT CHAT IA (Bas Droite - Position 1) --- */}
      <button 
        onClick={() => setIsAiChatModalOpen(true)}
        className="fixed bottom-6 right-6 p-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-all z-[90] flex items-center gap-2 group overflow-hidden"
        title="Discuter avec l'IA"
      >
        <Bot className="w-5 h-5 flex-shrink-0" />
        <span className="max-w-0 opacity-0 group-hover:max-w-[100px] group-hover:opacity-100 transition-all duration-300 ease-in-out font-bold text-sm whitespace-nowrap">
          IA Chat
        </span>
      </button>

      {/* --- MODALES --- */}
      <FeedbackModal 
        isOpen={isFeedbackModalOpen} 
        onClose={() => setIsFeedbackModalOpen(false)} 
        context={context}
      />

      <AiChatModal 
        isOpen={isAiChatModalOpen} 
        onClose={() => setIsAiChatModalOpen(false)} 
        context={context}
      />
    </>
  );
}
