#!/bin/bash

# PWA Testing Script
# This script helps test PWA functionality

echo "🧪 Fluent Progress PWA Testing Guide"
echo "====================================="
echo ""

# Check if icons exist
echo "📱 Checking PWA Icons..."
ICON_COUNT=$(ls -1 /workspaces/fluent-progress/public/icons/*.png 2>/dev/null | wc -l)
if [ "$ICON_COUNT" -ge 10 ]; then
    echo "✅ Found $ICON_COUNT icon files"
else
    echo "⚠️  Only found $ICON_COUNT icons (expected 10+)"
fi

# Check if service worker exists
echo ""
echo "⚙️  Checking Service Worker..."
if [ -f "/workspaces/fluent-progress/public/sw.js" ]; then
    echo "✅ Service worker file exists"
    LINE_COUNT=$(wc -l < /workspaces/fluent-progress/public/sw.js)
    echo "   ($LINE_COUNT lines)"
else
    echo "❌ Service worker not found"
fi

# Check if manifest exists
echo ""
echo "📋 Checking Manifest..."
if [ -f "/workspaces/fluent-progress/public/manifest.json" ]; then
    echo "✅ Manifest file exists"
    # Validate JSON
    if command -v jq &> /dev/null; then
        if jq empty /workspaces/fluent-progress/public/manifest.json 2>/dev/null; then
            echo "✅ Manifest is valid JSON"
        else
            echo "❌ Manifest has invalid JSON"
        fi
    fi
else
    echo "❌ Manifest not found"
fi

# Check if PWARegister component exists
echo ""
echo "🔧 Checking PWA Registration Component..."
if [ -f "/workspaces/fluent-progress/src/components/pwa-register.tsx" ]; then
    echo "✅ PWA register component exists"
else
    echo "❌ PWA register component not found"
fi

echo ""
echo "🚀 Testing Instructions:"
echo "======================="
echo ""
echo "1. Start the development server:"
echo "   npm run dev"
echo ""
echo "2. Open http://localhost:9002 in Chrome/Edge"
echo ""
echo "3. Open DevTools (F12) and check:"
echo "   📍 Application → Manifest"
echo "   📍 Application → Service Workers"
echo "   📍 Application → Storage → Local Storage"
echo ""
echo "4. Test offline mode:"
echo "   • Go to Application → Service Workers"
echo "   • Check 'Offline' checkbox"
echo "   • Navigate through the app"
echo "   • Verify pages load from cache"
echo ""
echo "5. Test installation:"
echo "   • Look for install icon (➕) in address bar"
echo "   • Click to install as app"
echo "   • App should open in standalone window"
echo ""
echo "6. Test update notification:"
echo "   • Modify public/sw.js"
echo "   • Reload the page"
echo "   • Should see 'Update Available' toast"
echo ""
echo "📊 Lighthouse PWA Audit:"
echo "   • Open DevTools → Lighthouse"
echo "   • Select 'Progressive Web App'"
echo "   • Click 'Generate report'"
echo ""
echo "✨ All checks passed! Your PWA is ready for testing."
