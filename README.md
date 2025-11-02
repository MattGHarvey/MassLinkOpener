# Mass Link Opener

A Chrome/Edge browser extension that allows you to find and open all links on a webpage that contain a specific phrase.

## Features

- 🔍 **Smart Search**: Find links by searching both link text and URLs
- 📱 **Case Sensitivity**: Toggle between case-sensitive and case-insensitive search
- 🚀 **Batch Opening**: Open all matching links in new tabs with one click
- 📊 **Results Preview**: See all found links before opening them
- 🎯 **URL Validation**: Only opens valid HTTP/HTTPS links for security
- 🔗 **Duplicate Removal**: Automatically removes duplicate URLs

## Installation

### Install from Source (Developer Mode)

1. **Download the Extension**
   - Clone or download this repository to your computer
   - Extract the files if downloaded as a ZIP

2. **Enable Developer Mode**
   - Open Chrome or Edge browser
   - Navigate to Extensions page:
     - **Chrome**: `chrome://extensions/`
     - **Edge**: `edge://extensions/`
   - Toggle "Developer mode" to ON (usually in the top-right corner)

3. **Load the Extension**
   - Click "Load unpacked" or "Load unpacked extension"
   - Select the folder containing the extension files
   - The extension should now appear in your extensions list

4. **Pin the Extension** (Optional)
   - Click the puzzle piece icon in your browser toolbar
   - Find "Mass Link Opener" and click the pin icon to keep it visible

## Usage

1. **Open the Extension**
   - Navigate to any webpage with links
   - Click the Mass Link Opener icon in your browser toolbar

2. **Search for Links**
   - Enter a phrase in the search box (e.g., "download", "article", "github")
   - Optionally check "Case sensitive search" for exact case matching
   - Click "Find Links" to search the current page

3. **Review Results**
   - The extension will show all matching links found on the page
   - Each result shows the link text and URL
   - The total count of found links is displayed

4. **Open Links**
   - Click "Open All Links" to open all found links in new tabs
   - Links open in background tabs so you can continue browsing
   - The popup will automatically close after opening the links

## Examples

### Common Use Cases

- **Download Multiple Files**: Search for "download" to find all download links
- **Open Related Articles**: Search for "article" or "read more" to open multiple articles
- **Social Media Links**: Search for "twitter" or "linkedin" to open all social links
- **Documentation Pages**: Search for "docs" or "guide" to open all documentation
- **GitHub Repositories**: Search for "github" to open all repository links

### Search Tips

- Use partial words: "git" will match "github", "gitlab", etc.
- Use common link text: "more", "read", "view", "download"
- Search URLs: "pdf" will find PDF download links
- Use case-sensitive search for exact matches

## Security Features

- ✅ Only opens HTTP and HTTPS links
- ✅ Validates all URLs before opening
- ✅ Blocks JavaScript and other potentially harmful protocols
- ✅ Works only on the active tab (requires user interaction)

## Browser Compatibility

- ✅ Google Chrome 88+
- ✅ Microsoft Edge 88+
- ✅ Other Chromium-based browsers

## Permissions

The extension requires these permissions:

- **Active Tab**: To read links from the current webpage
- **Tabs**: To open new tabs with the found links

## Troubleshooting

### "Unable to search this page" Error
This error can occur for several reasons:

1. **Browser Internal Pages**: The extension cannot run on `chrome://`, `edge://`, or extension pages
2. **Content Script Not Loaded**: Try refreshing the page and searching again
3. **Permissions Issue**: Make sure the extension has proper permissions

**Solutions:**
- Refresh the page (Ctrl+R or Cmd+R) and try again
- Check that you're on a regular webpage (not a browser internal page)
- Enable "Debug mode" in the extension popup to see detailed error information
- Reload the extension in your browser's extension settings

### Extension Not Working
- Make sure you're on a webpage with links (not chrome:// or edge:// pages)
- Try refreshing the page and searching again
- Check that the extension is enabled in your browser settings
- If you just installed/updated the extension, try reloading the page

### No Links Found
- Try a broader search term (e.g., "http" to find all external links)
- Disable case-sensitive search
- Check if the page has loaded completely
- Some dynamic content may not be detected immediately
- Enable debug mode to see how many total links were found

### Links Not Opening
- Check your popup blocker settings
- Ensure the extension has proper permissions
- Try opening one link manually to test
- Some browsers may limit the number of tabs that can be opened at once

### Debug Mode
Enable "Debug mode" in the extension popup to see detailed console logs that can help identify issues:
1. Open the extension popup
2. Check "Debug mode"  
3. Open browser developer tools (F12)
4. Go to Console tab
5. Try searching for links
6. Look for "Mass Link Opener:" messages in the console

## Development

### File Structure
```
MassLinkOpener/
├── manifest.json          # Extension configuration
├── popup.html             # Extension popup interface
├── popup.css              # Popup styling
├── popup.js               # Popup functionality
├── content.js             # Content script for webpage interaction
├── icons/                 # Extension icons
│   ├── icon16.svg
│   ├── icon48.svg
│   └── icon128.svg
└── README.md              # This file
```

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Distribution & Packaging

### Building for Distribution

The extension includes build scripts to create distribution packages:

#### Quick Build (macOS/Linux)
```bash
./build.sh
```

#### Quick Build (Windows)
```batch
build.bat
```

#### Manual Packaging
1. Create a new folder for the package
2. Copy these files only:
   - `manifest.json`
   - `popup.html`
   - `popup.css` 
   - `popup.js`
   - `content.js`
   - `icons/` folder (entire folder)
3. Create a ZIP file from these files

### Distribution Options

#### 1. Chrome Web Store (Recommended)
- **File**: Use the generated ZIP file (`mass-link-opener-v1.0.0.zip`)
- **Cost**: $5 one-time developer registration fee
- **Benefits**: Automatic updates, wider reach, user trust
- **Process**: 
  1. Register as Chrome Web Store developer
  2. Upload the ZIP file
  3. Fill in store listing details
  4. Submit for review

#### 2. GitHub Releases
- **File**: Attach the ZIP file to a GitHub release
- **Cost**: Free
- **Benefits**: Version control integration, developer-friendly
- **Process**:
  1. Create a new release on GitHub
  2. Tag the version (e.g., `v1.0.0`)
  3. Attach the ZIP file as a release asset
  4. Write release notes

#### 3. Self-Hosting on Your Website
- **File**: Host the ZIP file on your website
- **Cost**: Hosting costs only
- **Benefits**: Full control, custom branding
- **Requirements**:
  - HTTPS hosting
  - Clear installation instructions
  - Version management

### Installation Instructions for Users

Include these instructions with your distributed extension:

#### For Developer Mode Installation:
1. Download the extension ZIP file
2. Extract the ZIP file to a folder
3. Open Chrome/Edge and go to `chrome://extensions/` or `edge://extensions/`
4. Enable "Developer mode" (toggle in top-right)
5. Click "Load unpacked" and select the extracted folder
6. The extension will appear in your browser toolbar

#### For .CRX File (Advanced):
If you create a .CRX file for self-hosting:
1. Users must enable "Allow extensions from other stores" in browser settings
2. Download the .CRX file
3. Drag and drop onto the extensions page

### Version Management

- Update the version number in `manifest.json` before building
- Use semantic versioning (e.g., 1.0.0, 1.1.0, 2.0.0)
- Create Git tags for each release
- Maintain a changelog for user-facing changes

### Files Included in Distribution

✅ **Included:**
- `manifest.json` - Extension configuration
- `popup.html` - User interface
- `popup.css` - Styling
- `popup.js` - Popup functionality  
- `content.js` - Page interaction script
- `icons/` - Extension icons

❌ **Excluded:**
- `build.sh` / `build.bat` - Build scripts
- `generate-icons.html` - Development helper
- `README.md` - Documentation
- `.gitignore` - Git configuration
- `build/` and `dist/` folders

## License

This project is open source and available under the MIT License.

## Support

If you encounter any issues or have feature requests, please:
1. Check the troubleshooting section above
2. Create an issue on the project repository
3. Provide details about your browser version and the specific problem

---

**Happy browsing! 🌐**