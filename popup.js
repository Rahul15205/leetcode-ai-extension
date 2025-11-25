// Popup script for LeetCode AI Assistant

document.addEventListener('DOMContentLoaded', function() {
    const apiKeyInput = document.getElementById('apiKey');
    const saveBtn = document.getElementById('saveBtn');
    const testBtn = document.getElementById('testBtn');
    const statusDiv = document.getElementById('status');
    const resetProgressBtn = document.getElementById('resetProgress');

    // Load saved API key and progress
    loadSettings();
    loadProgress();

    // Event listeners
    saveBtn.addEventListener('click', saveSettings);
    testBtn.addEventListener('click', testConnection);
    resetProgressBtn.addEventListener('click', resetProgress);
    
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

    function loadProgress() {
        chrome.storage.local.get(['userProgress'], function(result) {
            const progress = result.userProgress || {
                problemsSolved: [],
                hintsUsed: 0,
                codeReviews: 0,
                improvements: 0,
                templatesGenerated: 0,
                testCasesGenerated: 0
            };

            // Update UI with progress data
            document.getElementById('problemsCount').textContent = progress.problemsSolved.length || 0;
            document.getElementById('hintsCount').textContent = progress.hintsUsed || 0;
            document.getElementById('reviewsCount').textContent = progress.codeReviews || 0;
            document.getElementById('improvementsCount').textContent = progress.improvements || 0;
            document.getElementById('templatesCount').textContent = progress.templatesGenerated || 0;
            document.getElementById('testCasesCount').textContent = progress.testCasesGenerated || 0;
        });
    }

    function resetProgress() {
        if (confirm('Are you sure you want to reset all progress statistics?')) {
            chrome.storage.local.set({ 
                userProgress: {
                    problemsSolved: [],
                    patternsLearned: {},
                    hintsUsed: 0,
                    analyzed: 0,
                    codeReviews: 0,
                    improvements: 0,
                    templatesGenerated: 0,
                    testCasesGenerated: 0,
                    lastActivity: null
                }
            }, function() {
                loadProgress();
                showStatus('Progress reset successfully!', 'success');
            });
        }
    }
});
