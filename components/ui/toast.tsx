'use client';

import React, { useEffect, useState } from 'react';
import { toast, Toast } from '@/lib/toast';
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const ToastComponent: React.FC<{ toast: Toast; onRemove: (id: string) => void }> = ({ toast: t, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onRemove(t.id), 300);
    }, t.duration || 5000);

    return () => clearTimeout(timer);
  }, [t.id, t.duration, onRemove]);

  const getIcon = () => {
    switch (t.type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const getBackgroundColor = () => {
    switch (t.type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-50 max-w-sm w-full bg-white border rounded-lg shadow-lg p-4 transition-all duration-300',
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0',
        getBackgroundColor()
      )}
    >
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1 min-w-0">
          {t.title && (
            <div className="font-medium text-sm text-gray-900 mb-1">
              {t.title}
            </div>
          )}
          {t.description && (
            <div className="text-sm text-gray-600">
              {t.description}
            </div>
          )}
        </div>
        <button
          onClick={() => onRemove(t.id)}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export const Toaster: React.FC = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const unsubscribe = toast.subscribe(setToasts);
    return unsubscribe;
  }, []);

  const handleRemove = (id: string) => {
    toast.remove(id);
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((t) => (
        <ToastComponent key={t.id} toast={t} onRemove={handleRemove} />
      ))}
    </div>
  );
};
