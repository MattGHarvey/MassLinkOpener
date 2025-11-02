// Content script for Mass Link Opener extension
// This script runs on every webpage and listens for messages from the popup

(function() {
    'use strict';
    
    // Prevent multiple injections
    if (window.massLinkOpenerInjected) {
        return;
    }
    window.massLinkOpenerInjected = true;
    
    // Listen for messages from the popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'findLinks') {
            try {
                // Wait for DOM to be ready if it's not already
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', () => {
                        const links = findMatchingLinks(request.phrase, request.caseSensitive);
                        sendResponse({ success: true, links: links });
                    });
                } else {
                    const links = findMatchingLinks(request.phrase, request.caseSensitive);
                    sendResponse({ success: true, links: links });
                }
            } catch (error) {
                console.error('Error finding links:', error);
                sendResponse({ success: false, error: error.message });
            }
        }
        
        // Return true to indicate we will send a response asynchronously
        return true;
    });
    
    function findMatchingLinks(phrase, caseSensitive) {
        const foundLinks = [];
        
        try {
            // Get all anchor tags on the page, including those in shadow DOM if possible
            const allLinks = document.querySelectorAll('a[href]');
            
            console.log(`Mass Link Opener: Searching ${allLinks.length} links for phrase: "${phrase}"`);
            
            if (allLinks.length === 0) {
                console.log('Mass Link Opener: No links found on this page');
                return [];
            }
            
            allLinks.forEach((link, index) => {
                try {
                    // Get the link's text content and URL
                    const linkText = (link.textContent || link.innerText || '').trim();
                    const linkUrl = link.href;
                    
                    // Skip if no valid URL
                    if (!linkUrl || linkUrl === '#' || linkUrl.startsWith('javascript:') || linkUrl.startsWith('mailto:')) {
                        return;
                    }
                    
                    // Prepare search text (link text + URL for comprehensive search)
                    const searchText = linkText + ' ' + linkUrl;
                    
                    // Perform case-sensitive or case-insensitive search
                    const matches = caseSensitive 
                        ? searchText.includes(phrase)
                        : searchText.toLowerCase().includes(phrase.toLowerCase());
                    
                    if (matches) {
                        // Validate and normalize the URL
                        const normalizedUrl = normalizeUrl(linkUrl);
                        
                        if (normalizedUrl) {
                            foundLinks.push({
                                text: linkText || normalizedUrl,
                                url: normalizedUrl,
                                element: link.tagName + (link.id ? '#' + link.id : '') + (link.className ? '.' + link.className.split(' ').join('.') : '')
                            });
                        }
                    }
                } catch (error) {
                    console.warn('Mass Link Opener: Error processing link:', error, link);
                }
            });
            
            // Remove duplicates based on URL
            const uniqueLinks = [];
            const seenUrls = new Set();
            
            foundLinks.forEach(link => {
                if (!seenUrls.has(link.url)) {
                    seenUrls.add(link.url);
                    uniqueLinks.push(link);
                }
            });
            
            console.log(`Mass Link Opener: Found ${uniqueLinks.length} unique matching links`);
            
            return uniqueLinks;
            
        } catch (error) {
            console.error('Mass Link Opener: Error in findMatchingLinks:', error);
            throw error;
        }
    }
    
    function normalizeUrl(url) {
        try {
            // Handle relative URLs
            if (url.startsWith('/')) {
                return new URL(url, window.location.origin).href;
            }
            
            // Handle protocol-relative URLs
            if (url.startsWith('//')) {
                return new URL(window.location.protocol + url).href;
            }
            
            // Handle relative URLs without leading slash
            if (!url.includes('://') && !url.startsWith('/')) {
                return new URL(url, window.location.href).href;
            }
            
            // Validate absolute URLs
            const urlObj = new URL(url);
            
            // Only allow http and https protocols for security
            if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
                return urlObj.href;
            }
            
            return null;
        } catch (error) {
            console.warn('Invalid URL:', url, error);
            return null;
        }
    }
    
    // Helper function to highlight matching phrases (optional feature)
    function highlightMatchingLinks(phrase, caseSensitive) {
        const allLinks = document.querySelectorAll('a[href]');
        
        allLinks.forEach(link => {
            const linkText = link.textContent || link.innerText || '';
            const linkUrl = link.href;
            const searchText = linkText + ' ' + linkUrl;
            
            const matches = caseSensitive 
                ? searchText.includes(phrase)
                : searchText.toLowerCase().includes(phrase.toLowerCase());
            
            if (matches) {
                link.style.backgroundColor = '#ffeb3b';
                link.style.outline = '2px solid #ff9800';
                link.style.outlineOffset = '2px';
            }
        });
    }
    
    // Optional: Add a method to remove highlights
    function removeHighlights() {
        const highlightedLinks = document.querySelectorAll('a[href]');
        highlightedLinks.forEach(link => {
            link.style.backgroundColor = '';
            link.style.outline = '';
            link.style.outlineOffset = '';
        });
    }
    
    // Debug: Log when content script loads
    console.log('Mass Link Opener content script loaded');
})();