@echo off
REM Mass Link Opener - Build Script (Windows)
REM This script packages the extension for distribution

setlocal enabledelayedexpansion

REM Configuration
set EXTENSION_NAME=mass-link-opener
set BUILD_DIR=build
set DIST_DIR=dist

REM Extract version from manifest.json (simple approach)
for /f "tokens=2 delims=:" %%a in ('findstr "version" manifest.json') do (
    set VERSION_LINE=%%a
)
set VERSION=!VERSION_LINE:"=!
set VERSION=!VERSION: =!
set VERSION=!VERSION:,=!

echo 🔧 Building Mass Link Opener Extension v%VERSION%

REM Clean previous builds
echo 🧹 Cleaning previous builds...
if exist "%BUILD_DIR%" rmdir /s /q "%BUILD_DIR%"
if exist "%DIST_DIR%" rmdir /s /q "%DIST_DIR%"
mkdir "%BUILD_DIR%"
mkdir "%DIST_DIR%"

REM Copy extension files to build directory
echo 📦 Copying extension files...
copy manifest.json "%BUILD_DIR%\"
copy popup.html "%BUILD_DIR%\"
copy popup.css "%BUILD_DIR%\"
copy popup.js "%BUILD_DIR%\"
copy content.js "%BUILD_DIR%\"
xcopy icons "%BUILD_DIR%\icons\" /s /i

REM Create ZIP file (requires PowerShell)
echo 🗜️  Creating distribution ZIP...
powershell -command "Compress-Archive -Path '%BUILD_DIR%\*' -DestinationPath '%DIST_DIR%\%EXTENSION_NAME%-v%VERSION%.zip' -Force"
copy "%DIST_DIR%\%EXTENSION_NAME%-v%VERSION%.zip" "%DIST_DIR%\%EXTENSION_NAME%-latest.zip"

echo ✅ Build complete!
echo 📁 Distribution files created in %DIST_DIR%\
echo    • %EXTENSION_NAME%-v%VERSION%.zip
echo    • %EXTENSION_NAME%-latest.zip
echo.
echo 🚀 Ready for distribution!
echo    • Upload to Chrome Web Store: %EXTENSION_NAME%-v%VERSION%.zip
echo    • GitHub Releases: %EXTENSION_NAME%-v%VERSION%.zip
echo    • Self-hosting: %EXTENSION_NAME%-latest.zip

pause