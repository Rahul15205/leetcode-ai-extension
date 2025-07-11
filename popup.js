// Popup script for LeetCode AI Assistant

document.addEventListener('DOMContentLoaded', function() {
    const apiKeyInput = document.getElementById('apiKey');
    const saveBtn = document.getElementById('saveBtn');
    const testBtn = document.getElementById('testBtn');
    const statusDiv = document.getElementById('status');

    // Load saved API key
    loadSettings();

    // Event listeners
    saveBtn.addEventListener('click', saveSettings);
    testBtn.addEventListener('click', testConnection);
    
    // Enter key to save
    apiKeyInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            saveSettings();
        }
    });

    function loadSettings() {
        chrome.storage.sync.get(['groqApiKey'], function(result) {
            if (result.groqApiKey) {
                apiKeyInput.value = result.groqApiKey;
            }
        });
    }

    function saveSettings() {
        const apiKey = apiKeyInput.value.trim();
        
        if (!apiKey) {
            showStatus('Please enter an API key', 'error');
            return;
        }

        if (!apiKey.startsWith('gsk_')) {
            showStatus('Groq API key should start with "gsk_"', 'error');
            return;
        }

        // Save to Chrome storage
        chrome.storage.sync.set({
            groqApiKey: apiKey
        }, function() {
            if (chrome.runtime.lastError) {
                showStatus('Error saving settings: ' + chrome.runtime.lastError.message, 'error');
            } else {
                showStatus('Settings saved successfully!', 'success');
            }
        });
    }

    async function testConnection() {
        const apiKey = apiKeyInput.value.trim();
        
        if (!apiKey) {
            showStatus('Please enter an API key first', 'error');
            return;
        }

        testBtn.disabled = true;
        testBtn.textContent = 'Testing...';
        
        try {
            const response = await fetch('https://api.groq.com/openai/v1/models', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${apiKey}`
                }
            });

            if (response.ok) {
                showStatus('Connection successful! ✅', 'success');
            } else {
                const error = await response.json();
                showStatus(`Connection failed: ${error.error?.message || 'Unknown error'}`, 'error');
            }
        } catch (error) {
            showStatus(`Connection failed: ${error.message}`, 'error');
        } finally {
            testBtn.disabled = false;
            testBtn.textContent = 'Test Connection';
        }
    }

    function showStatus(message, type) {
        statusDiv.textContent = message;
        statusDiv.className = `status ${type}`;
        statusDiv.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 5000);
    }
});
