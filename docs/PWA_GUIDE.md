# PWA Configuration Guide

## Overview
Fluent Progress is now configured as a Progressive Web App (PWA), allowing users to:
- ✅ Install the app on their device (mobile & desktop)
- ✅ Use the app offline
- ✅ Receive update notifications
- ✅ Enjoy native-like app experience

## Features

### 1. **Offline Support**
The service worker caches:
- All pages (`/`, `/practice`, `/sentences`, `/settings`)
- Static assets (CSS, JS)
- API responses (for offline access to cached data)

### 2. **Caching Strategy**
- **Navigation (Pages)**: Network-first, fallback to cache
- **Assets & API**: Cache-first with background update
- **Runtime Cache**: Automatically caches new resources as you browse

### 3. **Update Notifications**
Users receive toast notifications when:
- A new version is available
- They go offline
- Their connection is restored

## Installation

### On Mobile (Android/iOS)

#### Android (Chrome/Edge)
1. Visit the app in Chrome or Edge
2. Tap the three-dot menu
3. Select "Install app" or "Add to Home screen"
4. The app icon will appear on your home screen

#### iOS (Safari)
1. Visit the app in Safari
2. Tap the Share button (box with arrow)
3. Scroll down and tap "Add to Home Screen"
4. Name the app and tap "Add"

### On Desktop (Chrome/Edge)

1. Visit the app in Chrome or Edge
2. Look for the install icon (➕) in the address bar
3. Click it and confirm installation
4. The app will open in its own window

## Testing PWA Features

### Test Offline Mode
1. Open the app
2. Open DevTools (F12)
3. Go to Application → Service Workers
4. Check "Offline"
5. Navigate through the app - it should still work!

### Test Installation
1. Open DevTools (F12)
2. Go to Application → Manifest
3. Verify all icons are present
4. Click "Install" to test installation

### Test Update Notifications
1. Make changes to the service worker
2. Reload the page
3. You should see an "Update Available" toast

## Files Structure

```
public/
├── sw.js                    # Service worker (offline caching)
├── manifest.json           # PWA manifest (app metadata)
└── icons/                  # App icons
    ├── icon-72x72.png
    ├── icon-96x96.png
    ├── icon-128x128.png
    ├── icon-144x144.png
    ├── icon-152x152.png
    ├── icon-192x192.png
    ├── icon-384x384.png
    ├── icon-512x512.png
    ├── icon-maskable-192x192.png
    └── icon-maskable-512x512.png

src/components/
└── pwa-register.tsx        # Service worker registration
```

## Cache Management

### Cache Names
- `fluent-progress-v1` - Static assets cache
- `fluent-progress-runtime` - Runtime cache for dynamic content

### Updating Cache Version
When you make major updates, increment the cache version in `sw.js`:
```javascript
const CACHE_NAME = 'fluent-progress-v2'; // Update version number
```

## Customization

### Update App Colors
Edit `public/manifest.json`:
```json
{
  "theme_color": "#3399CC",        // Browser UI color
  "background_color": "#F0F8FF"   // Splash screen color
}
```

### Update App Icons
Replace icons in `public/icons/` or regenerate:
```bash
bash scripts/generate-icons.sh
```

### Modify Caching Strategy
Edit `public/sw.js` to customize:
- Which pages to precache
- Caching strategies per route
- Cache expiration policies

## Debugging

### View Service Worker
1. Open DevTools → Application → Service Workers
2. See active workers, update status, and logs

### Clear Cache
```javascript
// In browser console
caches.keys().then(names => {
  names.forEach(name => caches.delete(name));
});
```

### Unregister Service Worker
```javascript
// In browser console
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(r => r.unregister());
});
```

## Production Checklist

- [x] Service worker registered
- [x] Manifest.json configured
- [x] Icons generated (multiple sizes)
- [x] Offline support enabled
- [x] Update notifications implemented
- [x] HTTPS enabled (required for PWA in production)

## Notes

- **HTTPS Required**: PWAs require HTTPS in production (localhost works without it)
- **Data Persistence**: All app data is stored in LocalStorage (persists offline)
- **Audio Cache**: TTS audio is cached in-memory for the session
- **Auto Updates**: Service worker checks for updates every minute

## Resources

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
