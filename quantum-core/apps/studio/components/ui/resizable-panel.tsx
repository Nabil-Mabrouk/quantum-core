'use client';

import { useState, useEffect, useCallback } from 'react';
import { clsx } from 'clsx';

interface ResizablePanelProps {
  children: React.ReactNode;
  initialWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  side?: 'left' | 'right'; // 'left' pour la palette, 'right' pour les propriétés
}

export function ResizablePanel({ 
  children, 
  initialWidth = 320, 
  minWidth = 200, 
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
        // Calcul depuis le bord droit
        newWidth = window.innerWidth - e.clientX;
      } else {
        // Calcul depuis le bord gauche (pour la palette)
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
    <div 
      className="h-full flex shrink-0 relative bg-white"
      style={{ width: `${width}px` }}
    >
      {/* POIGNÉE DE REDIMENSIONNEMENT */}
      <div
        onMouseDown={startResizing}
        className={clsx(
          "absolute top-0 bottom-0 w-1.5 cursor-col-resize z-50 transition-colors hover:bg-blue-500/50",
          isResizing ? "bg-blue-600" : "bg-transparent",
          side === 'right' ? "left-0" : "right-0" // Inversion selon le côté
        )}
      />
      
      {/* CONTENU DU PANNEAU */}
      <div className="w-full h-full flex flex-col overflow-hidden border-x border-slate-200 shadow-xl">
        {children}
      </div>
      
      {/* OVERLAY DE SÉCURITÉ PENDANT LE DRAG */}
      {isResizing && <div className="fixed inset-0 z-[9999] cursor-col-resize" />}
    </div>
  );
}