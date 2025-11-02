document.addEventListener('DOMContentLoaded', function() {
    const phraseInput = document.getElementById('phrase-input');
    const caseSensitiveCheckbox = document.getElementById('case-sensitive');
    const debugModeCheckbox = document.getElementById('debug-mode');
    const findLinksBtn = document.getElementById('find-links');
    const openLinksBtn = document.getElementById('open-links');
    const resultsSection = document.getElementById('results');
    const linksList = document.getElementById('links-list');
    const linkCount = document.getElementById('link-count');
    const status = document.getElementById('status');
    
    let foundLinks = [];
    
    function debugLog(message, ...args) {
        if (debugModeCheckbox.checked) {
            console.log('Mass Link Opener:', message, ...args);
        }
    }
    
    // Focus on input when popup opens
    phraseInput.focus();
    
    // Handle Enter key in input field
    phraseInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            findLinks();
        }
    });
    
    // Find links button click handler
    findLinksBtn.addEventListener('click', findLinks);
    
    // Open links button click handler
    openLinksBtn.addEventListener('click', openLinks);
    
    async function findLinks() {
        const phrase = phraseInput.value.trim();
        
        if (!phrase) {
            showStatus('Please enter a search phrase', 'error');
            return;
        }
        
        try {
            // Get the current active tab
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (!tab) {
                showStatus('No active tab found', 'error');
                return;
            }
            
            debugLog('Current tab:', tab);
            
            // Check if the page is a restricted page
            if (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || 
                tab.url.startsWith('chrome-extension://') || tab.url.startsWith('extension://') ||
                tab.url.startsWith('moz-extension://') || tab.url === 'about:blank') {
                showStatus('Cannot search on browser internal pages', 'error');
                debugLog('Blocked: Restricted page detected:', tab.url);
                return;
            }
            
            showStatus('Searching for links...', 'info');
            findLinksBtn.textContent = 'Searching...';
            findLinksBtn.disabled = true;
            
            try {
                debugLog('Attempting to send message to content script...');
                // First, try to send message to existing content script
                const response = await chrome.tabs.sendMessage(tab.id, {
                    action: 'findLinks',
                    phrase: phrase,
                    caseSensitive: caseSensitiveCheckbox.checked
                });
                debugLog('Content script response:', response);
                
                if (response && response.success) {
                    foundLinks = response.links;
                    displayResults(foundLinks);
                    
                    if (foundLinks.length > 0) {
                        showStatus(`Found ${foundLinks.length} matching link${foundLinks.length === 1 ? '' : 's'}`, 'success');
                        openLinksBtn.disabled = false;
                    } else {
                        showStatus('No matching links found', 'info');
                        openLinksBtn.disabled = true;
                    }
                } else {
                    throw new Error('Invalid response from content script');
                }
            } catch (contentScriptError) {
                console.log('Content script not responding, trying to inject...', contentScriptError);
                
                // Fallback: Inject content script manually
                try {
                    await chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        files: ['content.js']
                    });
                    
                    // Wait a moment for the script to load
                    await new Promise(resolve => setTimeout(resolve, 100));
                    
                    // Try again
                    const response = await chrome.tabs.sendMessage(tab.id, {
                        action: 'findLinks',
                        phrase: phrase,
                        caseSensitive: caseSensitiveCheckbox.checked
                    });
                    
                    if (response && response.success) {
                        foundLinks = response.links;
                        displayResults(foundLinks);
                        
                        if (foundLinks.length > 0) {
                            showStatus(`Found ${foundLinks.length} matching link${foundLinks.length === 1 ? '' : 's'}`, 'success');
                            openLinksBtn.disabled = false;
                        } else {
                            showStatus('No matching links found', 'info');
                            openLinksBtn.disabled = true;
                        }
                    } else {
                        throw new Error('Content script injection failed');
                    }
                } catch (injectionError) {
                    console.error('Script injection failed:', injectionError);
                    showStatus('Cannot access this page. Try refreshing and try again.', 'error');
                    openLinksBtn.disabled = true;
                }
            }
            
        } catch (error) {
            console.error('Error finding links:', error);
            showStatus('Error: Unable to search this page. Try refreshing.', 'error');
            openLinksBtn.disabled = true;
        } finally {
            findLinksBtn.textContent = 'Find Links';
            findLinksBtn.disabled = false;
        }
    }
    
    async function openLinks() {
        if (foundLinks.length === 0) {
            showStatus('No links to open', 'error');
            return;
        }
        
        try {
            openLinksBtn.textContent = 'Opening...';
            openLinksBtn.disabled = true;
            
            // Open each link in a new tab
            for (const link of foundLinks) {
                await chrome.tabs.create({ 
                    url: link.url,
                    active: false // Don't switch to the new tab
                });
            }
            
            showStatus(`Successfully opened ${foundLinks.length} link${foundLinks.length === 1 ? '' : 's'}`, 'success');
            
            // Close the popup after a short delay
            setTimeout(() => {
                window.close();
            }, 1500);
            
        } catch (error) {
            console.error('Error opening links:', error);
            showStatus('Error opening some links', 'error');
        } finally {
            openLinksBtn.textContent = 'Open All Links';
            openLinksBtn.disabled = false;
        }
    }
    
    function displayResults(links) {
        if (links.length === 0) {
            resultsSection.style.display = 'none';
            return;
        }
        
        linksList.innerHTML = '';
        
        links.forEach((link, index) => {
            const linkItem = document.createElement('div');
            linkItem.className = 'link-item';
            
            linkItem.innerHTML = `
                <div class="link-text">${escapeHtml(link.text || 'No text')}</div>
                <div class="link-url">${escapeHtml(link.url)}</div>
            `;
            
            linksList.appendChild(linkItem);
        });
        
        linkCount.textContent = links.length;
        resultsSection.style.display = 'block';
    }
    
    function showStatus(message, type) {
        status.textContent = message;
        status.className = `status ${type}`;
        status.style.display = 'block';
        
        // Auto-hide status after 3 seconds for success messages
        if (type === 'success') {
            setTimeout(() => {
                status.style.display = 'none';
            }, 3000);
        }
    }
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Handle input changes to reset results
    phraseInput.addEventListener('input', function() {
        if (resultsSection.style.display !== 'none') {
            resultsSection.style.display = 'none';
            openLinksBtn.disabled = true;
            foundLinks = [];
            status.style.display = 'none';
        }
    });
    
    caseSensitiveCheckbox.addEventListener('change', function() {
        if (resultsSection.style.display !== 'none') {
            resultsSection.style.display = 'none';
            openLinksBtn.disabled = true;
            foundLinks = [];
            status.style.display = 'none';
        }
    });
    
    debugModeCheckbox.addEventListener('change', function() {
        if (debugModeCheckbox.checked) {
            console.log('Mass Link Opener: Debug mode enabled');
        }
    });
});