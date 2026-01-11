# PWA Installation Troubleshooting

## Install Button Not Showing?

### Common Reasons & Solutions:

#### 1. **Dev Server Not Running**
```bash
npm run dev
```
Make sure the server is running on http://localhost:9002

#### 2. **Browser Requirements**
The install button appears differently in different browsers:

**Chrome/Edge (Desktop & Android):**
- Look for a **➕ Install** icon in the address bar (right side)
- Or three-dot menu → "Install Fluent Progress"

**Safari (iOS/Mac):**
- No automatic install button
- Use: Share button → "Add to Home Screen"

**Firefox:**
- Limited PWA support on desktop
- Android: Three-dot menu → "Install"

#### 3. **Already Installed**
If you've already installed the app, the button won't show again.

**To reset:**
1. Uninstall the app (right-click app icon → Uninstall)
2. Clear browser cache (Ctrl+Shift+Delete)
3. Refresh the page

#### 4. **Check PWA Criteria**
Open DevTools (F12) → Console and check for errors.

**Required for installation:**
- ✅ Valid manifest.json
- ✅ Service worker registered
- ✅ Served over HTTPS (or localhost)
- ✅ At least 192x192 and 512x512 icons
- ✅ Valid start_url

#### 5. **Verify Service Worker**
Open DevTools (F12) → Application → Service Workers

**Should see:**
- Status: "activated and is running"
- Source: http://localhost:9002/sw.js

**If not registered:**
Check browser console for errors like:
- "Failed to register service worker"
- "Service worker registration failed"

#### 6. **Verify Manifest**
Open DevTools (F12) → Application → Manifest

**Should see:**
- App name: "Fluent Progress"
- Icons: Multiple sizes visible
- Start URL: "/"
- Display: "standalone"

**Common manifest errors:**
- "No matching service worker detected"
- "Page does not work offline"
- "Start URL not in service worker scope"

#### 7. **Port Already in Use**
If port 9002 is busy:

```bash
# Kill process on port 9002
lsof -ti:9002 | xargs kill -9

# Or change port
npm run dev -- -p 3000
```

#### 8. **Codespaces/Dev Container Issues**
If using GitHub Codespaces or dev containers:

1. Make sure port 9002 is forwarded
2. Access via the forwarded HTTPS URL, not localhost
3. The install button may not appear on non-localhost non-HTTPS URLs

**Alternative:** Test on local machine or use ngrok/cloudflared tunnel.

---

## Testing Installation Without Install Button

### Manual Installation Methods:

#### Chrome/Edge Desktop:
1. F12 → Application → Manifest
2. Click "Add to Home Screen" link in manifest section

#### Chrome Android:
1. Three-dot menu
2. "Install app" or "Add to Home Screen"

#### Safari iOS:
1. Share button (square with arrow up)
2. Scroll down → "Add to Home Screen"
3. Name it and tap "Add"

---

## Verify PWA Installability

### Using Chrome DevTools:

1. **Open DevTools** (F12)
2. **Go to Application tab**
3. **Check Manifest section:**
   - Should show "App can be installed"
   - All icons visible
   - No errors

4. **Check Service Workers section:**
   - Should show "activated and is running"
   - No errors

5. **Check Console:**
   - Should see: "Service Worker registered successfully"
   - No errors about manifest or SW

### Using Lighthouse:

1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Select "Progressive Web App"
4. Click "Analyze page load"

**Should pass:**
- ✅ Installable
- ✅ PWA optimized
- ✅ Provides a valid manifest
- ✅ Has a registered service worker
- ✅ Works offline

---

## Quick Checklist

Run this in browser console (F12):

```javascript
// Check if service worker is supported
console.log('SW supported:', 'serviceWorker' in navigator);

// Check if service worker is registered
navigator.serviceWorker.getRegistrations().then(registrations => {
  console.log('SW registrations:', registrations.length);
  registrations.forEach(reg => console.log('SW scope:', reg.scope));
});

// Check manifest
fetch('/manifest.json')
  .then(r => r.json())
  .then(m => console.log('Manifest:', m))
  .catch(e => console.error('Manifest error:', e));

// Check if app is installable
if (window.matchMedia('(display-mode: standalone)').matches) {
  console.log('✅ App is already installed!');
} else {
  console.log('📱 App is not installed (install button should show)');
}
```

---

## Still Not Working?

### Step-by-Step Debug:

1. **Clear everything:**
   ```bash
   # Stop dev server (Ctrl+C)
   # Then restart:
   npm run dev
   ```

2. **Hard refresh browser:**
   - Windows/Linux: Ctrl + Shift + R
   - Mac: Cmd + Shift + R

3. **Check browser console** (F12) for any errors

4. **Verify files exist:**
   ```bash
   ls -la public/manifest.json
   ls -la public/sw.js
   ls -la public/icons/*.png
   ```

5. **Test manifest directly:**
   Open http://localhost:9002/manifest.json
   Should see valid JSON

6. **Test service worker directly:**
   Open http://localhost:9002/sw.js
   Should see JavaScript code

7. **Try different browser:**
   - Chrome (best PWA support)
   - Edge (good PWA support)
   - Firefox (limited support)
   - Safari (limited support)

---

## Expected Behavior

### When PWA is Ready to Install:

**Desktop (Chrome/Edge):**
- Install icon (➕) appears in address bar
- Click it → Shows "Install Fluent Progress?" dialog
- Click "Install" → App opens in standalone window

**Mobile (Chrome/Edge):**
- Bottom sheet appears: "Add Fluent Progress to Home screen"
- Or in menu: "Install app"
- Icon appears on home screen

**After Installation:**
- App icon on desktop/home screen
- Opens in standalone window (no browser UI)
- Works offline
- Can be uninstalled like native app

---

## Contact

If you're still having issues, provide:
1. Browser name and version
2. Operating system
3. Console errors (if any)
4. Screenshot of DevTools → Application → Manifest
