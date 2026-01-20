'use client';

import Link from 'next/link';
import { BookOpen, CheckCircle, ChevronRight, ChevronLeft, List } from 'lucide-react';
import { clsx } from 'clsx';

interface TutorialNavProps {
  tutorial: {
    title: string;
    posts: { id: string; title: string; slug: string; order: number }[];
  };
  currentPostId: string;
  locale: string;
}

export function TutorialNav({ tutorial, currentPostId, locale }: TutorialNavProps) {
  const currentIndex = tutorial.posts.findIndex(p => p.id === currentPostId);
  const prevPost = tutorial.posts[currentIndex - 1];
  const nextPost = tutorial.posts[currentIndex + 1];

  return (
    <div className="space-y-8">
      
      {/* 1. TABLE OF CONTENTS BOX */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-200">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Série / Tutoriel</span>
            <h3 className="font-bold text-slate-900 leading-tight">{tutorial.title}</h3>
          </div>
        </div>

        <ul className="space-y-1">
          {tutorial.posts.map((post, idx) => {
            const isActive = post.id === currentPostId;
            // Assuming posts before current are "read"
            const isRead = idx < currentIndex;

            return (
              <li key={post.id}>
                <Link 
                  href={`/${locale}/blog/${post.slug}`}
                  className={clsx(
                    "flex items-start gap-3 p-2 rounded-lg text-sm transition-all",
                    isActive 
                      ? "bg-white shadow-sm text-blue-600 font-bold border border-slate-100" 
                      : "text-slate-600 hover:bg-slate-100"
                  )}
                >
                  <span className={clsx(
                    "mt-0.5 text-[10px] font-mono flex items-center justify-center w-5 h-5 rounded-full border",
                    isActive ? "bg-blue-600 text-white border-blue-600" : 
                    isRead ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-slate-100 text-slate-400 border-slate-200"
                  )}>
                    {isRead ? <CheckCircle className="w-3 h-3" /> : idx + 1}
                  </span>
                  <span className="flex-1">{post.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* 2. NEXT / PREV BUTTONS */}
      <div className="grid grid-cols-2 gap-4">
        {prevPost ? (
          <Link 
            href={`/${locale}/blog/${prevPost.slug}`}
            className="flex flex-col p-4 rounded-2xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all group text-left"
          >
            <span className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-blue-500">
              <ChevronLeft className="w-3 h-3" /> Précédent
            </span>
            <span className="text-xs font-bold text-slate-700 group-hover:text-blue-900 line-clamp-1">
              {prevPost.title}
            </span>
          </Link>
        ) : <div />} {/* Spacer */}

        {nextPost && (
          <Link 
            href={`/${locale}/blog/${nextPost.slug}`}
            className="flex flex-col items-end p-4 rounded-2xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all group text-right"
          >
            <span className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-blue-500">
              Suivant <ChevronRight className="w-3 h-3" />
            </span>
            <span className="text-xs font-bold text-slate-700 group-hover:text-blue-900 line-clamp-1">
              {nextPost.title}
            </span>
          </Link>
        )}
      </div>

    </div>
  );
}