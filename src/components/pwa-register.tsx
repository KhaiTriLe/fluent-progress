"use client";

import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function PWARegister() {
  const { toast } = useToast();

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator
    ) {
      // Register service worker
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('Service Worker registered successfully:', registration.scope);

            // Check for updates periodically
            setInterval(() => {
              registration.update();
            }, 60000); // Check every minute

            // Handle updates
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // New service worker is ready
                    toast({
                      title: 'Update Available',
                      description: 'A new version is available. Refresh to update.',
                      duration: 10000,
                    });
                  }
                });
              }
            });
          })
          .catch((error) => {
            console.error('Service Worker registration failed:', error);
          });
      });

      // Handle offline/online status
      const handleOnline = () => {
        toast({
          title: 'Back Online',
          description: 'Your connection has been restored.',
        });
      };

      const handleOffline = () => {
        toast({
          title: 'Offline Mode',
          description: 'You are now offline. Some features may be limited.',
          variant: 'destructive',
        });
      };

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, [toast]);

  return null;
}
