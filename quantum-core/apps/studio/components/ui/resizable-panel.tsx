'use client';

import { useState, useEffect, useCallback } from 'react';

interface ResizablePanelProps {
  children: React.ReactNode;
  initialWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  side?: 'left' | 'right';
}

export function ResizablePanel({ 
  children, 
  initialWidth = 320, 
  minWidth = 280, 
  maxWidth = 600,
  side = 'right'
}: ResizablePanelProps) {
  const [width, setWidth] = useState(initialWidth);
  const [isResizing, setIsResizing] = useState(false);

  const startResizing = useCallback(() => setIsResizing(true), []);
  const stopResizing = useCallback(() => setIsResizing(false), []);

  const resize = useCallback((e: MouseEvent) => {
    if (isResizing) {
      let newWidth;
      if (side === 'right') {
        // Pour un panneau à droite, on calcule depuis le bord droit
        newWidth = window.innerWidth - e.clientX;
      } else {
        newWidth = e.clientX;
      }

      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setWidth(newWidth);
      }
    }
  }, [isResizing, minWidth, maxWidth, side]);

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

  return (
    <div className="flex h-full shrink-0 relative">
      {/* POIGNÉE DE REDIMENSIONNEMENT (À GAUCHE DU PANNEAU) */}
      <div
        onMouseDown={startResizing}
        className={`w-1 cursor-col-resize z-50 transition-colors hover:bg-blue-500 absolute top-0 bottom-0 left-0 ${
          isResizing ? 'bg-blue-600' : 'bg-transparent hover:bg-blue-300'
        }`}
      />
      
      {/* CONTENU DU PANNEAU */}
      <div style={{ width: `${width}px` }} className="h-full flex flex-col overflow-hidden bg-white border-l border-slate-200 shadow-xl">
        {children}
      </div>
      
      {/* OVERLAY DE SÉCURITÉ (Pour éviter que la souris ne se perde dans les iframes ou autres pendant le drag) */}
      {isResizing && <div className="fixed inset-0 z-[9999] cursor-col-resize" />}
    </div>
  );
}