import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <section className={`rounded-[28px] border theme-card p-6 ${className}`}>
      {children}
    </section>
  );
}
