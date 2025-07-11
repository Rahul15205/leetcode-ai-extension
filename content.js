// Content script for LeetCode AI Assistant
class LeetCodeAIAssistant {
  constructor() {
    this.currentProblem = null;
    this.assistantPanel = null;
    this.isInitialized = false;
    this.init();
  }

  init() {
    // Wait for page to load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupAssistant());
    } else {
      this.setupAssistant();
    }
    
    // Listen for navigation changes (when user clicks on different tabs)
    this.setupNavigationListener();
  }
  
  setupNavigationListener() {
    // Listen for URL changes (when navigating between Description/Solutions/Submissions)
    let currentUrl = window.location.href;
    
    // Use MutationObserver to detect when the page content changes
    const observer = new MutationObserver(() => {
      if (window.location.href !== currentUrl) {
        currentUrl = window.location.href;
        console.log('URL changed to:', currentUrl);
        
        // Small delay to let the page load
        setTimeout(() => {
          this.handleNavigation();
        }, 200);
      }
      
      // Also check if assistant is missing periodically
      if (this.isProblemPage() && !document.getElementById('leetcode-ai-assistant')) {
        console.log('Assistant missing, recreating...');
        setTimeout(() => {
          this.handleNavigation();
        }, 100);
      }
    });
    
    // Start observing with more comprehensive options
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });
    
    // Also listen for popstate events (back/forward navigation)
    window.addEventListener('popstate', () => {
      console.log('Popstate event');
      setTimeout(() => {
        this.handleNavigation();
      }, 200);
    });
    
    // Periodic check to ensure assistant stays visible
    setInterval(() => {
      if (this.isProblemPage() && !document.getElementById('leetcode-ai-assistant')) {
        console.log('Periodic check: Assistant missing, recreating...');
        this.handleNavigation();
      }
    }, 2000); // Check every 2 seconds
  }
  
  handleNavigation() {
    // If we're still on a problem page but assistant is missing, recreate it
    if (this.isProblemPage() && !document.getElementById('leetcode-ai-assistant')) {
      console.log('Assistant missing after navigation, recreating...');
      this.setupAssistant();
    }
  }

  setupAssistant() {
    // Check if we're on a problem page
    if (!this.isProblemPage()) return;

    // Extract problem information
    this.extractProblemInfo();
    
    // Create and inject the assistant panel
    this.createAssistantPanel();
    
    // Set up event listeners
    this.setupEventListeners();
    
    this.isInitialized = true;
    console.log('LeetCode AI Assistant initialized');
  }

  isProblemPage() {
    const path = window.location.pathname;
    // Check if we're on any problem-related page (including submissions, editorial, etc.)
    return path.includes('/problems/') && path.split('/').length >= 3;
  }

  extractProblemInfo() {
    try {
      // Extract problem title
      const titleElement = document.querySelector('[data-cy="question-title"]') || 
                           document.querySelector('h1') ||
                           document.querySelector('.text-title-large');
      
      // Extract problem description
      const descriptionElement = document.querySelector('[data-track-load="description_content"]') ||
                                document.querySelector('.content__u3I1') ||
                                document.querySelector('.question-content');

      // Extract difficulty
      const difficultyElement = document.querySelector('[diff]') ||
                               document.querySelector('.difficulty') ||
                               document.querySelector('[data-degree]');

      this.currentProblem = {
        title: titleElement?.textContent?.trim() || 'Unknown Problem',
        description: descriptionElement?.textContent?.trim() || '',
        difficulty: difficultyElement?.textContent?.trim() || 'Unknown',
        url: window.location.href
      };

      console.log('Problem extracted:', this.currentProblem);
    } catch (error) {
      console.error('Error extracting problem info:', error);
    }
  }

  createAssistantPanel() {
    // Create the assistant panel
    this.assistantPanel = document.createElement('div');
    this.assistantPanel.id = 'leetcode-ai-assistant';
    this.assistantPanel.className = 'ai-assistant-panel';
    this.chatHistory = [];
    this.currentContext = null;
    
    this.assistantPanel.innerHTML = `
      <div class="ai-assistant-header">
        <h3>🤖 AI Assistant</h3>
        <button id="ai-assistant-toggle" class="toggle-btn">−</button>
      </div>
      <div class="ai-assistant-content" id="ai-assistant-content">
        <div class="ai-assistant-section">
          <h4>Quick Analysis</h4>
          <div class="action-buttons">
            <button id="analyze-btn" class="ai-btn">Analyze Problem</button>
            <button id="get-hint-btn" class="ai-btn">Get Hint</button>
            <button id="pattern-btn" class="ai-btn">Identify Pattern</button>
            <button id="review-btn" class="ai-btn">Review Code</button>
          </div>
        </div>
        
        <div class="ai-assistant-section" id="chat-section" style="display: none;">
          <h4>💬 Chat</h4>
          <div id="chat-container" class="chat-container"></div>
          <div class="chat-input-container">
            <input type="text" id="chat-input" placeholder="Ask a follow-up question..." class="chat-input">
            <button id="send-chat" class="chat-send-btn">Send</button>
          </div>
        </div>
        
        <div class="ai-assistant-section" id="result-section">
          <div id="main-result" class="result-container"></div>
        </div>
      </div>
    `;

    // Find a good place to inject the panel
    const targetContainer = this.findInjectionPoint();
    if (targetContainer) {
      targetContainer.appendChild(this.assistantPanel);
    } else {
      document.body.appendChild(this.assistantPanel);
    }
  }

  findInjectionPoint() {
    // Try to find the main content area
    const containers = [
      document.querySelector('.question-content'),
      document.querySelector('.content__u3I1'),
      document.querySelector('[data-track-load="description_content"]'),
      document.querySelector('.css-1jqueqk'),
      document.querySelector('main')
    ];

    for (let container of containers) {
      if (container) {
        return container.parentElement;
      }
    }
    return null;
  }

  setupEventListeners() {
    // Toggle panel
    document.getElementById('ai-assistant-toggle')?.addEventListener('click', () => {
      this.togglePanel();
    });

    // Analyze problem
    document.getElementById('analyze-btn')?.addEventListener('click', () => {
      this.analyzeProblem();
    });

    // Get hint
    document.getElementById('get-hint-btn')?.addEventListener('click', () => {
      this.getHint();
    });

    // Identify pattern
    document.getElementById('pattern-btn')?.addEventListener('click', () => {
      this.identifyPattern();
    });

    // Review code
    document.getElementById('review-btn')?.addEventListener('click', () => {
      this.reviewCode();
    });

    // Chat functionality
    document.getElementById('send-chat')?.addEventListener('click', () => {
      this.sendChatMessage();
    });

    // Enter key in chat input
    document.getElementById('chat-input')?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.sendChatMessage();
      }
    });
  }

  togglePanel() {
    const content = document.getElementById('ai-assistant-content');
    const toggle = document.getElementById('ai-assistant-toggle');
    
    if (content.style.display === 'none') {
      content.style.display = 'block';
      toggle.textContent = '−';
    } else {
      content.style.display = 'none';
      toggle.textContent = '+';
    }
  }

  async analyzeProblem() {
    this.currentContext = 'analyze';
    await this.showConciseResult('analyze', this.currentProblem, 'Analyzing problem...');
    this.enableChatAfterResult();
  }

  async getHint() {
    this.currentContext = 'hint';
    await this.showConciseResult('hint', this.currentProblem, 'Getting hint...');
    this.enableChatAfterResult();
  }

  async identifyPattern() {
    this.currentContext = 'pattern';
    await this.showConciseResult('pattern', this.currentProblem, 'Identifying pattern...');
    this.enableChatAfterResult();
  }

  async reviewCode() {
    const code = this.extractCodeFromEditor();
    if (!code) {
      this.showError('No code found in editor');
      return;
    }
    
    this.currentContext = 'review';
    await this.showConciseResult('review', { ...this.currentProblem, code: code }, 'Reviewing code...');
    this.enableChatAfterResult();
  }

  async showConciseResult(action, data, loadingText) {
    const resultContainer = document.getElementById('main-result');
    resultContainer.innerHTML = `<div class="loading">${loadingText}</div>`;
    
    try {
      const result = await this.callAI(action, data);
      const formattedResult = this.formatBulletPoints(result);
      resultContainer.innerHTML = `<div class="ai-result">${formattedResult}</div>`;
      this.chatHistory = [{ role: 'assistant', content: result }];
    } catch (error) {
      this.showError(error.message);
    }
  }

  formatBulletPoints(text) {
    // Replace bullet points that are in paragraph format with proper line breaks
    let formatted = text.replace(/• /g, '<br/>• ');
    
    // Remove the first <br/> if it's at the beginning
    if (formatted.startsWith('<br/>')) {
      formatted = formatted.substring(5);
    }
    
    // Add extra spacing between bullet points for better readability
    formatted = formatted.replace(/• /g, '<div class="bullet-point">• ');
    formatted = formatted.replace(/<br\/>/g, '</div><div class="bullet-point">');
    
    // Close the last bullet point div
    if (formatted.includes('<div class="bullet-point">')) {
      formatted = formatted + '</div>';
    }
    
    return formatted;
  }

  showError(message) {
    const resultContainer = document.getElementById('main-result');
    resultContainer.innerHTML = `<div class="error">Error: ${message}</div>`;
  }

  enableChatAfterResult() {
    const chatSection = document.getElementById('chat-section');
    chatSection.style.display = 'block';
    
    // Add a prompt to encourage chat
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer.children.length === 0) {
      chatContainer.innerHTML = '<div class="chat-prompt">💡 Ask me follow-up questions or request clarification!</div>';
    }
  }

  async sendChatMessage() {
    const chatInput = document.getElementById('chat-input');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    const chatContainer = document.getElementById('chat-container');
    
    // Add user message
    this.addChatMessage('user', message);
    chatInput.value = '';
    
    // Add loading indicator
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'chat-message assistant loading';
    loadingDiv.innerHTML = '<div class="chat-content">Thinking...</div>';
    chatContainer.appendChild(loadingDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    try {
      const response = await this.callAI('chat', {
        ...this.currentProblem,
        context: this.currentContext,
        message: message,
        history: this.chatHistory
      });
      
      // Remove loading indicator
      loadingDiv.remove();
      
      // Add assistant response
      this.addChatMessage('assistant', response);
      this.chatHistory.push({ role: 'user', content: message });
      this.chatHistory.push({ role: 'assistant', content: response });
      
    } catch (error) {
      loadingDiv.remove();
      this.addChatMessage('assistant', `Error: ${error.message}`);
    }
  }

  addChatMessage(role, content) {
    const chatContainer = document.getElementById('chat-container');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${role}`;
    
    const icon = role === 'user' ? '👤' : '🤖';
    messageDiv.innerHTML = `
      <div class="chat-icon">${icon}</div>
      <div class="chat-content">${content}</div>
    `;
    
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  extractCodeFromEditor() {
    // Try multiple selectors for different LeetCode editor versions
    const editorSelectors = [
      '.monaco-editor textarea',
      '.CodeMirror-code',
      '.view-lines',
      'textarea[data-cy="code-editor"]'
    ];

    for (let selector of editorSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        return element.value || element.textContent;
      }
    }
    return null;
  }

  async callAI(type, data) {
    // Check if chrome.runtime is available
    if (!chrome || !chrome.runtime || !chrome.runtime.sendMessage) {
      throw new Error('Chrome extension API not available. Please reload the extension.');
    }
    
    // Send message to background script to handle AI API calls
    return new Promise((resolve, reject) => {
      try {
        chrome.runtime.sendMessage({
          type: 'ai-request',
          action: type,
          data: data
        }, (response) => {
          // Check if there was an error in the message passing
          if (chrome.runtime.lastError) {
            reject(new Error(`Extension error: ${chrome.runtime.lastError.message}`));
            return;
          }
          
          if (!response) {
            reject(new Error('No response from background script. Please check if the extension is properly loaded.'));
            return;
          }
          
          if (response.error) {
            reject(new Error(response.error));
          } else {
            resolve(response.result);
          }
        });
      } catch (error) {
        reject(new Error(`Failed to send message: ${error.message}`));
      }
    });
  }
}

// Initialize the assistant when the script loads
new LeetCodeAIAssistant();
