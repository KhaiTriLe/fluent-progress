#!/bin/bash

# Simple SVG icon generator for Fluent Progress PWA
# This creates basic placeholder icons - replace with proper design later

ICON_DIR="/workspaces/fluent-progress/public/icons"
mkdir -p "$ICON_DIR"

# Create a simple SVG icon
cat > "$ICON_DIR/base-icon.svg" << 'EOF'
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#3399CC" rx="80"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
        font-family="Arial, sans-serif" font-size="280" font-weight="bold" fill="white">F</text>
  <circle cx="256" cy="380" r="30" fill="#66CCFF"/>
  <circle cx="206" cy="380" r="20" fill="#66CCFF" opacity="0.6"/>
  <circle cx="306" cy="380" r="20" fill="#66CCFF" opacity="0.6"/>
</svg>
EOF

# Check if ImageMagick is available
if command -v convert &> /dev/null; then
    echo "Generating PWA icons with ImageMagick..."
    
    SIZES=(72 96 128 144 152 192 384 512)
    
    for size in "${SIZES[@]}"; do
        convert "$ICON_DIR/base-icon.svg" -resize "${size}x${size}" "$ICON_DIR/icon-${size}x${size}.png"
        echo "Created icon-${size}x${size}.png"
    done
    
    # Create maskable icons (with safe zone padding)
    convert "$ICON_DIR/base-icon.svg" -resize 192x192 -gravity center -extent 192x192 "$ICON_DIR/icon-maskable-192x192.png"
    convert "$ICON_DIR/base-icon.svg" -resize 512x512 -gravity center -extent 512x512 "$ICON_DIR/icon-maskable-512x512.png"
    
    echo "✅ PWA icons generated successfully!"
else
    echo "⚠️  ImageMagick not found. Please install it or use an online tool:"
    echo "   - https://realfavicongenerator.net/"
    echo "   - https://www.pwabuilder.com/imageGenerator"
    echo ""
    echo "   Or install ImageMagick: sudo apt-get install imagemagick"
fi
