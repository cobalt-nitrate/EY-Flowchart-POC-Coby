'use client';

import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-gray-400">
      <Loader2 className="w-8 h-8 animate-spin mb-4" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

