'use client';
import { Trash } from 'lucide-react';
import { deletePostAction } from '@/app/actions/admin-blog';

export function BlogDeleteButton({ postId, postTitle }: { postId: string, postTitle: string }) {
    const handleClick = async () => {
        if (confirm(`Supprimer l'article "${postTitle}" ?`)) {
            await deletePostAction(postId);
        }
    };

    return (
        <button onClick={handleClick} className="p-2 hover:bg-red-50 rounded-xl transition-all">
            <Trash className="w-4 h-4 text-red-400" />
        </button>
    );
}
