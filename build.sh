#!/bin/bash

# Mass Link Opener - Build Script
# This script packages the extension for distribution

set -e

# Configuration
EXTENSION_NAME="mass-link-opener"
VERSION=$(grep '"version"' manifest.json | sed 's/.*"version": "\([^"]*\)".*/\1/')
BUILD_DIR="build"
DIST_DIR="dist"

echo "🔧 Building Mass Link Opener Extension v${VERSION}"

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf "$BUILD_DIR" "$DIST_DIR"
mkdir -p "$BUILD_DIR" "$DIST_DIR"

# Copy extension files to build directory
echo "📦 Copying extension files..."
cp manifest.json "$BUILD_DIR/"
cp popup.html "$BUILD_DIR/"
cp popup.css "$BUILD_DIR/"
cp popup.js "$BUILD_DIR/"
cp content.js "$BUILD_DIR/"
cp -r icons "$BUILD_DIR/"

# Create ZIP file for distribution
echo "🗜️  Creating distribution ZIP..."
cd "$BUILD_DIR"
zip -r "../${DIST_DIR}/${EXTENSION_NAME}-v${VERSION}.zip" .
cd ..

# Create a copy with generic name for latest version
cp "${DIST_DIR}/${EXTENSION_NAME}-v${VERSION}.zip" "${DIST_DIR}/${EXTENSION_NAME}-latest.zip"

echo "✅ Build complete!"
echo "📁 Distribution files created in ${DIST_DIR}/"
echo "   • ${EXTENSION_NAME}-v${VERSION}.zip"
echo "   • ${EXTENSION_NAME}-latest.zip"
echo ""
echo "🚀 Ready for distribution!"
echo "   • Upload to Chrome Web Store: ${EXTENSION_NAME}-v${VERSION}.zip"
echo "   • GitHub Releases: ${EXTENSION_NAME}-v${VERSION}.zip"
echo "   • Self-hosting: ${EXTENSION_NAME}-latest.zip"