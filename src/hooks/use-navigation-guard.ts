"use client";

import { useState, useEffect, useCallback, startTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export function useNavigationGuard(isBlocked: boolean) {
  const router = useRouter();
  const pathname = usePathname();
  
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [nextPath, setNextPath] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleBeforeUnload = useCallback((e: BeforeUnloadEvent) => {
    if (isBlocked) {
      e.preventDefault();
      e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
    }
  }, [isBlocked]);

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [handleBeforeUnload]);

  useEffect(() => {
    // This is a workaround to handle Next.js App Router's client-side navigation.
    // We're hijacking the history.pushState method.
    const originalPushState = history.pushState;
    history.pushState = (data: any, unused: string, url?: string | URL | null) => {
      const targetPath = url ? url.toString() : '';

      if (isBlocked && targetPath && !targetPath.startsWith(pathname)) {
        setShowConfirmation(true);
        setNextPath(targetPath);
      } else {
        originalPushState.apply(history, [data, unused, url]);
      }
    };

    return () => {
      history.pushState = originalPushState;
    };
  }, [isBlocked, pathname]);

  useEffect(() => {
    if (isConfirmed && nextPath) {
        // We use startTransition to avoid React state updates during render
        startTransition(() => {
            router.push(nextPath);
        });
    }
  }, [isConfirmed, nextPath, router]);


  const confirm = () => {
    setShowConfirmation(false);
    setIsConfirmed(true);
  };

  const cancel = () => {
    setShowConfirmation(false);
    setNextPath('');
    setIsConfirmed(false);
  };

  return { showConfirmation, confirm, cancel };
}
