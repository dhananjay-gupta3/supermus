import type { ReactNode } from 'react';

interface SectionTitleProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export default function SectionTitle({ title, description, children }: SectionTitleProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-slate-950 dark:text-white">{title}</h2>
        {children}
      </div>
      {description ? <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{description}</p> : null}
    </div>
  );
}
