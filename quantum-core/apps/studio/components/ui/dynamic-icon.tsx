'use client';

import * as Icons from 'lucide-react';
import { LucideProps } from 'lucide-react';

interface DynamicIconProps extends LucideProps {
  name: string;
}

export function DynamicIcon({ name, ...props }: DynamicIconProps) {
  // @ts-ignore - On récupère l'icône dynamiquement par son nom
  const IconComponent = Icons[name];

  if (!IconComponent) {
    return <Icons.HelpCircle {...props} />; // Icône par défaut si non trouvée
  }

  return <IconComponent {...props} />;
}