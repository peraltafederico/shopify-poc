import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export default function Container({ children, className, fullWidth = false }: ContainerProps) {
  return (
    <div className={cn(
      'w-full',
      !fullWidth && 'max-w-7xl mx-auto',
      className
    )}>
      {children}
    </div>
  );
}