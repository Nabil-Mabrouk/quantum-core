'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export function MarkdownViewer({ content }: { content: string }) {
  return (
    <div className="w-full text-slate-800">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm, remarkMath]} 
        rehypePlugins={[rehypeKatex]}
        skipHtml={true} 
        components={{
          // ... vos composants h1, h2, p, etc. inchangés ...
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

          // --- LE CORRECTIF EST ICI ---
          // On force la balise <pre> parente à être transparente et sans marge
          // pour qu'elle n'interfère pas avec notre fenêtre de code personnalisée.
          pre: ({node, ...props}) => (
            <pre className="!bg-transparent !p-0 !m-0 !shadow-none !rounded-none" {...props} />
          ),

          code(props) {
            const {children, className, node, ...rest} = props;
            const match = /language-(\w+)/.exec(className || '');
            
            return match ? (
              // Le 'not-prose' ici protège le contenu, mais le 'pre' ci-dessus protège le conteneur
              <div className="not-prose my-8 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-[#1e1e1e]">
                
                {/* Header Mac OS */}
                <div className="bg-[#252526] px-4 py-2 flex items-center gap-2 border-b border-black/20">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                        <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                    </div>
                    <span className="ml-auto text-[10px] font-mono text-slate-400 uppercase tracking-wider">{match[1]}</span>
                </div>

                <SyntaxHighlighter
                  {...rest}
                  PreTag="div"
                  children={String(children).replace(/\n$/, '')}
                  language={match[1]}
                  style={vscDarkPlus}
                  customStyle={{ margin: 0, padding: '1.5rem', background: 'transparent', fontSize: '0.9rem' }} 
                  codeTagProps={{ style: { backgroundColor: 'transparent' } }}
                />
              </div>
            ) : (
              <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-blue-600 font-bold border border-slate-200 text-sm" {...rest}>
                {children}
              </code>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}