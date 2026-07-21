"use client";

import { Suspense, lazy, useEffect, useState } from 'react';

const ScrollToTop = lazy(() => import('@/components/ui/ScrollToTop'));
const SilasChat = lazy(() => import('@/components/ui/SilasChat'));

export default function DeferredGlobalWidgets() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let idleId: number | null = null;

    const activate = () => setReady(true);

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      idleId = (window as any).requestIdleCallback(activate, { timeout: 2000 });
    } else {
      timeoutId = setTimeout(activate, 300);
    }

    return () => {
      if (idleId != null && typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
        (window as any).cancelIdleCallback(idleId);
      }
      if (timeoutId != null) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  if (!ready) return null;

  return (
    <Suspense fallback={null}>
      <ScrollToTop />
      <SilasChat />
    </Suspense>
  );
}
