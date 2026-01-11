'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

export function MarkdownViewer({ content }: { content: string }) {
  return (
    <div className="w-full text-slate-800">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm, remarkMath]} 
        rehypePlugins={[rehypeKatex]}
        // FIX: Ensure users cannot inject raw HTML
        skipHtml={true} 
        // On définit les styles précis pour chaque élément HTML, comme dans QuantumH2O
        components={{
          h1: ({node, ...props}) => <h1 className="text-4xl font-black text-slate-900 mt-12 mb-6 border-b-4 border-blue-600 pb-2 tracking-tighter" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-slate-800 mt-10 mb-4 flex items-center gap-2 border-l-4 border-blue-500 pl-4" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-xl font-bold text-blue-600 mt-8 mb-2 uppercase tracking-wider" {...props} />,
          p: ({node, ...props}) => <p className="text-lg leading-relaxed text-slate-600 mb-6 font-medium" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-6 space-y-3 text-slate-600" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-6 space-y-3 text-slate-600" {...props} />,
          li: ({node, ...props}) => <li className="pl-2" {...props} />,
          blockquote: ({node, ...props}) => (
            <blockquote className="border-l-4 border-purple-500 bg-purple-50 p-6 my-8 italic rounded-r-2xl text-purple-900 shadow-inner" {...props} />
          ),
          table: ({node, ...props}) => (
            <div className="overflow-x-auto my-10 border border-slate-200 rounded-2xl shadow-sm bg-white">
              <table className="w-full border-collapse text-left text-sm" {...props} />
            </div>
          ),
          thead: ({node, ...props}) => <thead className="bg-slate-50 border-b border-slate-200 font-bold uppercase text-[10px] tracking-widest text-slate-500" {...props} />,
          th: ({node, ...props}) => <th className="p-4" {...props} />,
          td: ({node, ...props}) => <td className="p-4 border-t border-slate-100 font-medium" {...props} />,
          // Style pour les formules en ligne ou en bloc
          code: ({node, ...props}) => <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-blue-600 font-bold" {...props} />
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}