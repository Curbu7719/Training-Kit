import {
  forwardRef,
  type ElementRef,
  type ComponentPropsWithoutRef,
  type ReactElement,
} from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ToastProvider = ToastPrimitive.Provider;

export const ToastViewport = forwardRef<
  ElementRef<typeof ToastPrimitive.Viewport>,
  ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn(
      // pointer-events-none so the (often empty) fixed viewport never swallows
      // clicks on the page beneath it; each Toast re-enables pointer-events on
      // itself (pointer-events-auto), so toasts stay interactive.
      'pointer-events-none fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:max-w-sm',
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = 'ToastViewport';

const toastVariants = {
  default: 'border border-border bg-card text-card-foreground',
  success: 'border border-success/20 bg-success/10 text-success',
  destructive: 'border border-destructive/20 bg-destructive/10 text-destructive',
};

export type ToastVariant = keyof typeof toastVariants;

interface ToastProps extends ComponentPropsWithoutRef<typeof ToastPrimitive.Root> {
  variant?: ToastVariant;
}

export const Toast = forwardRef<ElementRef<typeof ToastPrimitive.Root>, ToastProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <ToastPrimitive.Root
      ref={ref}
      className={cn(
        'group pointer-events-auto relative flex w-full items-center justify-between gap-3 overflow-hidden rounded-lg p-4 shadow-md',
        'transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)]',
        'data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full',
        'data-[state=open]:slide-in-from-bottom-full',
        toastVariants[variant],
        className
      )}
      {...props}
    />
  )
);
Toast.displayName = 'Toast';

export const ToastTitle = forwardRef<
  ElementRef<typeof ToastPrimitive.Title>,
  ComponentPropsWithoutRef<typeof ToastPrimitive.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Title
    ref={ref}
    className={cn('text-sm font-semibold', className)}
    {...props}
  />
));
ToastTitle.displayName = 'ToastTitle';

export const ToastDescription = forwardRef<
  ElementRef<typeof ToastPrimitive.Description>,
  ComponentPropsWithoutRef<typeof ToastPrimitive.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Description
    ref={ref}
    className={cn('text-sm opacity-90', className)}
    {...props}
  />
));
ToastDescription.displayName = 'ToastDescription';

export const ToastClose = forwardRef<
  ElementRef<typeof ToastPrimitive.Close>,
  ComponentPropsWithoutRef<typeof ToastPrimitive.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Close
    ref={ref}
    className={cn(
      'rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring',
      className
    )}
    {...props}
  >
    <X className="h-4 w-4" />
    <span className="sr-only">Dismiss</span>
  </ToastPrimitive.Close>
));
ToastClose.displayName = 'ToastClose';

// ---------------------------------------------------------------------------
// useToast hook — simple imperative API backed by a module-level queue.
// ---------------------------------------------------------------------------

export interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

type ToastRecord = ToastOptions & { id: string };
type Listener = (toasts: ToastRecord[]) => void;

let toastQueue: ToastRecord[] = [];
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((l) => l([...toastQueue]));
}

export function toast(opts: ToastOptions) {
  const id = Math.random().toString(36).slice(2);
  toastQueue = [...toastQueue, { ...opts, id }];
  notify();

  // Auto-remove after duration (default 4 s).
  const duration = opts.duration ?? 4000;
  setTimeout(() => {
    toastQueue = toastQueue.filter((t) => t.id !== id);
    notify();
  }, duration);
}

import { useState, useEffect } from 'react';

export function useToasts() {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);

  useEffect(() => {
    listeners.add(setToasts);
    return () => { listeners.delete(setToasts); };
  }, []);

  function dismiss(id: string) {
    toastQueue = toastQueue.filter((t) => t.id !== id);
    notify();
  }

  return { toasts, dismiss };
}

// ---------------------------------------------------------------------------
// Toaster — mount once at the app root to render active toasts.
// ---------------------------------------------------------------------------

export function Toaster() {
  const { toasts, dismiss } = useToasts();

  return (
    <ToastProvider>
      {toasts.map((t) => (
        <Toast key={t.id} variant={t.variant} onOpenChange={(open) => { if (!open) dismiss(t.id); }}>
          <div className="flex flex-col gap-0.5">
            <ToastTitle>{t.title}</ToastTitle>
            {t.description && <ToastDescription>{t.description}</ToastDescription>}
          </div>
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  );
}

export type { ToastRecord, ReactElement };
