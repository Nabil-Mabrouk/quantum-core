'use client';

import { useState, useActionState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { updatePostAction } from '@/app/actions/admin-blog'; // Vérifie bien le chemin
import { uploadImageAction } from '@/app/actions/upload';    // Vérifie bien le chemin
import { 
  Save, Layout, FileEdit, Loader2, Tag as TagIcon, 
  X, Plus, Eye, Edit3, Image as ImageIcon, 
  ArrowLeft, Clock, Hash, Trash2, UploadCloud, AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { MarkdownViewer } from '@/components/ui/markdown-viewer';
import { clsx } from 'clsx';

export function EditPostForm({ post, existingTags = [] }: { post: any, existingTags?: string[] }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [state, formAction, isPending] = useActionState(updatePostAction, null);
  
  // --- ÉTATS LOCAUX ---
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [title, setTitle] = useState(post.title || ''); // État contrôlé pour l'aperçu live
  const [content, setContent] = useState(post.content || '');
  const [tags, setTags] = useState<string[]>(post.tags ? post.tags.split(',').map((t: string) => t.trim()) : []);
  const [newTagInput, setNewTagInput] = useState('');
  const [heroImage, setHeroImage] = useState(post.image || '');
  const [isUploading, setIsUploading] = useState(false);

  // --- CALCULS ÉDITORIAUX ---
  const wordCount = useMemo(() => content.split(/\s+/).filter(w => w.length > 0).length, [content]);
  const readingTime = Math.ceil(wordCount / 200);

  useEffect(() => {
    if (state?.error) toast.error(state.error);
    if (state?.success) toast.success("Article mis à jour avec succès");
  }, [state]);

  // --- LOGIQUE IMAGE ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'image est trop lourde (max 5Mo)");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const imageUrl = await uploadImageAction(formData);
      setHeroImage(imageUrl);
      toast.success("Image téléchargée");
    } catch (error) {
      toast.error("Erreur lors du téléchargement");
    } finally {
      setIsUploading(false);
    }
  };

  // --- LOGIQUE TAGS ---
  const addTag = (tag: string) => {
    const cleanTag = tag.trim().toLowerCase();
    if (cleanTag && !tags.includes(cleanTag)) {
      setTags([...tags, cleanTag]);
    }
    setNewTagInput('');
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleClearContent = () => {
    if (confirm("Voulez-vous vraiment vider tout le contenu de l'éditeur ?")) {
      setContent('');
    }
  };

  return (
    <form action={formAction} className="max-w-[1600px] mx-auto grid grid-cols-12 gap-8 items-start pb-20">
      {/* Inputs cachés synchronisés avec les états pour la Server Action */}
      <input type="hidden" name="id" value={post.id} />
      <input type="hidden" name="tags" value={tags.join(',')} />
      <input type="hidden" name="image" value={heroImage} />
      <input type="hidden" name="title" value={title} />
      
      {/* 1. COLONNE GAUCHE (ÉDITION & APERÇU) */}
      <div className="col-span-12 lg:col-span-8 space-y-6">
        
        {/* BARRE D'OUTILS */}
        <div className="flex items-center justify-between bg-white p-2 rounded-2xl border border-slate-200 shadow-sm sticky top-20 z-30">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button 
              type="button"
              onClick={() => setViewMode('edit')}
              className={clsx(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all", 
                viewMode === 'edit' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <Edit3 size={14} /> Édition
            </button>
            <button 
              type="button"
              onClick={() => setViewMode('preview')}
              className={clsx(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all", 
                viewMode === 'preview' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <Eye size={14} /> Aperçu Live
            </button>
          </div>
          
          <div className="flex items-center gap-4 px-4">
             <div className="hidden sm:flex items-center gap-4 text-[10px] font-black uppercase text-slate-400 tracking-widest border-r pr-4 border-slate-100">
                <span className="flex items-center gap-1"><Hash size={12}/> {wordCount} mots</span>
                <span className="flex items-center gap-1"><Clock size={12}/> ~{readingTime} min</span>
             </div>
             <button 
                type="button"
                onClick={handleClearContent}
                className="text-slate-300 hover:text-red-500 transition-colors p-1"
                title="Vider l'éditeur"
             >
                <Trash2 size={16} />
             </button>
          </div>
        </div>

        {/* ZONE DE RÉDACTION */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden min-h-[700px] flex flex-col">
          {viewMode === 'edit' ? (
            <>
              <div className="p-8 border-b border-slate-100 bg-slate-50/30">
                <input 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-transparent text-4xl font-black tracking-tighter outline-none placeholder:text-slate-200 text-slate-900" 
                  placeholder="Titre de l'expertise..."
                  required 
                />
              </div>
              <textarea 
                name="content" 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="flex-1 w-full p-10 font-mono text-sm leading-relaxed outline-none resize-none bg-white text-slate-700 min-h-[500px]"
                placeholder="# Commencez à rédiger en Markdown..."
              />
            </>
          ) : (
            <div className="p-10 animate-in fade-in duration-300">
                <article className="max-w-3xl mx-auto">
                    {heroImage && (
                        <div className="mb-10 aspect-video rounded-[2rem] overflow-hidden shadow-2xl">
                          <img src={heroImage} alt="Hero" className="w-full h-full object-cover" />
                        </div>
                    )}
                    <h1 className="text-5xl font-black text-slate-900 mb-8 tracking-tighter leading-tight">
                        {title || "Titre de l'article"}
                    </h1>
                    <div className="prose prose-slate prose-lg max-w-none">
                        <MarkdownViewer content={content || "*Aucun contenu à afficher...*"} />
                    </div>
                </article>
            </div>
          )}
        </div>
      </div>

      {/* 2. BARRE LATÉRALE (PARAMÈTRES) */}
      <aside className="col-span-12 lg:col-span-4 space-y-6 lg:sticky lg:top-28">
        
        {/* ACTIONS PRINCIPALES */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl space-y-4">
            <button 
                type="submit" 
                disabled={isPending || isUploading} 
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-500 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Sauvegarder les modifications
            </button>
            <button 
                type="button"
                onClick={() => router.push('/admin/blog')}
                className="w-full bg-white/5 text-slate-400 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-3"
            >
                <ArrowLeft size={16} /> Annuler
            </button>
        </div>

        {/* IMAGE DE COUVERTURE */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-lg space-y-4">
            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2">
                <ImageIcon size={14} className="text-blue-500" /> Image Hero
            </h4>
            
            <div 
                onClick={() => fileInputRef.current?.click()}
                className={clsx(
                    "relative aspect-video rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden group",
                    heroImage ? "border-transparent" : "border-slate-200 hover:border-blue-400 hover:bg-blue-50/30"
                )}
            >
                {isUploading ? (
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Traitement...</span>
                    </div>
                ) : heroImage ? (
                    <>
                        <img src={heroImage} className="absolute inset-0 w-full h-full object-cover" alt="Preview" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <UploadCloud size={24} className="text-white" />
                        </div>
                    </>
                ) : (
                    <div className="text-center space-y-2">
                        <UploadCloud size={24} className="mx-auto text-slate-300 group-hover:text-blue-500 transition-colors" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight">Cliquer pour uploader</p>
                    </div>
                )}
            </div>
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileUpload} 
            />
        </div>

        {/* TAGS */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-lg space-y-6">
            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2">
                <TagIcon size={14} className="text-blue-500" /> Taxonomie
            </h4>
            
            <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                    <span key={tag} className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-bold border border-blue-100 transition-all">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500"><X size={12} /></button>
                    </span>
                ))}
            </div>

            <div className="space-y-4">
                <div className="relative">
                    <input 
                        type="text"
                        value={newTagInput}
                        onChange={(e) => setNewTagInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                addTag(newTagInput);
                            }
                        }}
                        placeholder="Ajouter un tag..."
                        className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/10"
                    />
                    <button 
                        type="button"
                        onClick={() => addTag(newTagInput)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-blue-600"
                    >
                        <Plus size={16} />
                    </button>
                </div>

                {existingTags.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1">
                          <Plus size={10} /> Suggestions
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                            {existingTags.filter(t => !tags.includes(t)).slice(0, 12).map(t => (
                                <button 
                                    key={t}
                                    type="button"
                                    onClick={() => addTag(t)}
                                    className="px-2.5 py-1.5 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-[9px] font-bold text-slate-500 border border-transparent hover:border-blue-100 transition-all"
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* RÉSUMÉ / EXCERPT */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-lg space-y-4">
            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2">
                <Layout size={14} className="text-blue-500" /> Résumé SEO
            </h4>
            <textarea 
                name="excerpt" 
                defaultValue={post.excerpt || ""} 
                className="w-full h-28 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-medium outline-none focus:bg-white transition-all resize-none italic leading-relaxed" 
                placeholder="Description courte pour les moteurs de recherche..."
            />
        </div>

        {/* VISIBILITÉ */}
        <label className="flex items-center justify-between p-6 bg-slate-900 rounded-[2rem] shadow-xl cursor-pointer group hover:bg-black transition-all">
            <div className="flex items-center gap-3">
                <div className={clsx(
                    "w-2.5 h-2.5 rounded-full",
                    post.published ? "bg-emerald-500 animate-pulse" : "bg-orange-500"
                )} />
                <span className="text-[10px] font-black uppercase tracking-widest text-white">Statut : {post.published ? 'Publié' : 'Brouillon'}</span>
            </div>
            <input 
                type="checkbox" 
                name="published" 
                defaultChecked={post.published} 
                className="w-6 h-6 rounded-lg accent-blue-500" 
            />
        </label>

      </aside>
    </form>
  );
}