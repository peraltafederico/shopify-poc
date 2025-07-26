import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
}

export default function PageWrapper({ children, className }: PageWrapperProps) {
  return (
    <div className={cn(
      'flex-1 p-4 md:p-8 animate-fade-in',
      'min-h-screen',
      className
    )}>
      {children}
    </div>
  );
}