// content.js - LeetCode AI Assistant
// This file is injected into LeetCode problem pages to display the assistant UI and handle user interactions.

class LeetCodeAIAssistant {
  constructor() {
    this.currentProblem = null;
    this.assistantPanel = null;
    this.isInitialized = false;
    // New variables for drag-and-drop functionality
    this.isDragging = false;
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;
    // New map to store hint levels for each problem
    this.problemHintLevels = new Map();
    this.chatHistory = []; // Initialize chat history here
    this.currentContext = null; // Initialize current context here

    this.init();
  }

  init() {
    // Wait for page to load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupAssistant());
    } else {
      this.setupAssistant();
    }

    // Listen for navigation changes (when user clicks on different tabs like Description/Solutions/Submissions)
    this.setupNavigationListener();
  }

  setupNavigationListener() {
    let currentUrl = window.location.href;

    const observer = new MutationObserver(() => {
      if (window.location.href !== currentUrl) {
        currentUrl = window.location.href;
        console.log('URL changed to:', currentUrl);

        // Remove existing panel before creating a new one to prevent duplicates
        if (this.assistantPanel && this.assistantPanel.parentElement) {
          this.assistantPanel.parentElement.removeChild(this.assistantPanel);
          this.assistantPanel = null; // Clear reference
          this.isInitialized = false; // Reset initialization status
          this.chatHistory = []; // Clear chat history on page navigation
        }

        // Small delay to let the page load
        setTimeout(() => {
          this.handleNavigation();
        }, 200);
      }

      // Also check if assistant is missing periodically and re-init if on problem page
      if (this.isProblemPage() && !document.getElementById('leetcode-ai-assistant') && !this.isInitialized) {
        console.log('Periodic check: Assistant missing or not initialized, attempting re-creation...');
        setTimeout(() => {
          this.setupAssistant();
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
    if (!this.isProblemPage()) {
        // If not on a problem page, ensure the assistant is removed
        if (this.assistantPanel && this.assistantPanel.parentElement) {
            this.assistantPanel.parentElement.removeChild(this.assistantPanel);
            this.assistantPanel = null;
            this.isInitialized = false;
        }
        return;
    }

    // If already initialized, no need to re-create
    if (this.isInitialized && document.getElementById('leetcode-ai-assistant')) {
        console.log('LeetCode AI Assistant already initialized and present.');
        return;
    }

    // Extract problem information
    this.extractProblemInfo();

    // Initialize hint level for the current problem if not already set
    if (this.currentProblem && !this.problemHintLevels.has(this.currentProblem.url)) {
        this.problemHintLevels.set(this.currentProblem.url, 0); // Start at hint level 0
    }

    // Create and inject the assistant panel
    this.createAssistantPanel();

    // Load saved position for the panel
    chrome.storage.local.get(['aiAssistantPanelLeft', 'aiAssistantPanelTop'], (result) => {
        if (result.aiAssistantPanelLeft !== undefined) {
            this.assistantPanel.style.left = `${result.aiAssistantPanelLeft}px`;
        }
        if (result.aiAssistantPanelTop !== undefined) {
            this.assistantPanel.style.top = `${result.aiAssistantPanelTop}px`;
        }
    });

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
          </div>
        </div>

        <div class="ai-assistant-section">
          <h4>Code Tools</h4>
          <div class="action-buttons">
            <button id="review-btn" class="ai-btn">Review Code</button>
            <button id="improve-btn" class="ai-btn">Suggest Improvement</button>
            <button id="template-btn" class="ai-btn">Get Template</button>
            <button id="testcases-btn" class="ai-btn">Generate Tests</button>
          </div>
        </div>

        <div class="ai-assistant-section" id="chat-section" style="display: none;">
          <h4>💬 Chat <button id="clear-chat-btn" class="ai-btn btn-secondary" style="width: auto; padding: 4px 8px; margin-left: 10px; font-size: 11px;">Clear Chat</button></h4>
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
    // We will default to appending to body and rely on saved position from storage
    // or initial CSS positioning if no saved position.
    return document.body;
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

    // Suggest improvement
    document.getElementById('improve-btn')?.addEventListener('click', () => {
      this.suggestImprovement();
    });

    // Get template
    document.getElementById('template-btn')?.addEventListener('click', () => {
      this.getTemplate();
    });

    // Generate test cases
    document.getElementById('testcases-btn')?.addEventListener('click', () => {
      this.generateTestCases();
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

    // Clear chat history
    document.getElementById('clear-chat-btn')?.addEventListener('click', () => {
        this.clearChatHistory();
    });

    // Drag functionality for the panel
    const header = this.assistantPanel.querySelector('.ai-assistant-header');
    if (header) {
        header.addEventListener('mousedown', (e) => this.startDragging(e));
    }
  }

  // New method to set button loading state
  setButtonLoading(buttonId, isLoading) {
    const button = document.getElementById(buttonId);
    if (button) {
      button.disabled = isLoading;
      if (isLoading) {
        button.classList.add('loading-button');
        // Change text to indicate loading
        if (buttonId === 'analyze-btn') button.textContent = 'Analyzing...';
        else if (buttonId === 'get-hint-btn') button.textContent = 'Getting Hint...';
        else if (buttonId === 'pattern-btn') button.textContent = 'Identifying...';
        else if (buttonId === 'review-btn') button.textContent = 'Reviewing...';
        else if (buttonId === 'improve-btn') button.textContent = 'Analyzing...';
        else if (buttonId === 'template-btn') button.textContent = 'Generating...';
        else if (buttonId === 'testcases-btn') button.textContent = 'Generating...';
      } else {
        button.classList.remove('loading-button');
        // Revert text
        if (buttonId === 'analyze-btn') button.textContent = 'Analyze Problem';
        else if (buttonId === 'get-hint-btn') button.textContent = 'Get Hint';
        else if (buttonId === 'pattern-btn') button.textContent = 'Identify Pattern';
        else if (buttonId === 'review-btn') button.textContent = 'Review Code';
        else if (buttonId === 'improve-btn') button.textContent = 'Suggest Improvement';
        else if (buttonId === 'template-btn') button.textContent = 'Get Template';
        else if (buttonId === 'testcases-btn') button.textContent = 'Generate Tests';
      }
    }
  }

  // New methods for drag-and-drop
  startDragging(e) {
    this.isDragging = true;
    this.assistantPanel.classList.add('dragging'); // Add dragging class for styling
    this.assistantPanel.style.cursor = 'grabbing';
    this.dragOffsetX = e.clientX - this.assistantPanel.getBoundingClientRect().left;
    this.dragOffsetY = e.clientY - this.assistantPanel.getBoundingClientRect().top;

    document.addEventListener('mousemove', this.doDragging);
    document.addEventListener('mouseup', this.stopDragging);
    e.preventDefault(); // Prevent default drag behavior
  }

  doDragging = (e) => { // Use arrow function to maintain 'this' context
    if (this.isDragging) {
      let newX = e.clientX - this.dragOffsetX;
      let newY = e.clientY - this.dragOffsetY;

      // Clamp newX and newY to keep the panel within the viewport
      const minX = 10; // 10px from left
      const minY = 10; // 10px from top
      const maxX = window.innerWidth - this.assistantPanel.offsetWidth - 10; // 10px from right
      const maxY = window.innerHeight - this.assistantPanel.offsetHeight - 10; // 10px from bottom

      newX = Math.max(minX, Math.min(newX, maxX));
      newY = Math.max(minY, Math.min(newY, maxY));

      this.assistantPanel.style.left = `${newX}px`;
      this.assistantPanel.style.top = `${newY}px`;
      // Store position in local storage for persistence across sessions
      chrome.storage.local.set({
        aiAssistantPanelLeft: newX,
        aiAssistantPanelTop: newY
      });
    }
  }

  stopDragging = () => { // Use arrow function to maintain 'this' context
    this.isDragging = false;
    this.assistantPanel.classList.remove('dragging'); // Remove dragging class
    this.assistantPanel.style.cursor = 'grab';
    document.removeEventListener('mousemove', this.doDragging);
    document.removeEventListener('mouseup', this.stopDragging);
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
    this.setButtonLoading('analyze-btn', true); // Set loading state
    try {
      await this.showConciseResult('analyze', this.currentProblem, 'Analyzing problem...');
      this.trackProgress('analyzed');
    } finally {
      this.setButtonLoading('analyze-btn', false); // Reset loading state
    }
    this.enableChatAfterResult();
  }

  async getHint() {
    this.currentContext = 'hint';
    // Get and increment hint level for the current problem
    const currentLevel = this.problemHintLevels.get(this.currentProblem.url) || 0;
    const nextLevel = currentLevel + 1;
    this.problemHintLevels.set(this.currentProblem.url, nextLevel);

    this.setButtonLoading('get-hint-btn', true); // Set loading state
    try {
      await this.showConciseResult('hint', {
        ...this.currentProblem,
        hintLevel: nextLevel // Pass the hint level to the background script
      }, `Getting hint level ${nextLevel}...`);
      this.trackProgress('hints');
    } finally {
      this.setButtonLoading('get-hint-btn', false); // Reset loading state
    }
    this.enableChatAfterResult();
  }

  async identifyPattern() {
    this.currentContext = 'pattern';
    this.setButtonLoading('pattern-btn', true); // Set loading state
    try {
      await this.showConciseResult('pattern', this.currentProblem, 'Identifying pattern...');
      this.trackProgress('patterns');
    } finally {
      this.setButtonLoading('pattern-btn', false); // Reset loading state
    }
    this.enableChatAfterResult();
  }

  async reviewCode() {
    const code = this.extractCodeFromEditor();
    if (!code) {
      this.showError('No code found in editor. Please ensure your code is in the editor.');
      return;
    }

    this.currentContext = 'review';
    this.setButtonLoading('review-btn', true); // Set loading state
    try {
      await this.showConciseResult('review', { ...this.currentProblem, code: code }, 'Reviewing code...');
      this.trackProgress('codeReviews');
    } finally {
      this.setButtonLoading('review-btn', false); // Reset loading state
    }
    this.enableChatAfterResult();
  }

  async suggestImprovement() {
    const code = this.extractCodeFromEditor();
    if (!code) {
      this.showError('No code found in editor. Please ensure your code is in the editor.');
      return;
    }

    this.currentContext = 'improvement';
    this.setButtonLoading('improve-btn', true);
    try {
      await this.showConciseResult('improvement', { ...this.currentProblem, code: code }, 'Analyzing for improvements...');
      this.trackProgress('improvements');
    } finally {
      this.setButtonLoading('improve-btn', false);
    }
    this.enableChatAfterResult();
  }

  async getTemplate() {
    this.currentContext = 'template';
    this.setButtonLoading('template-btn', true);
    try {
      const code = this.extractCodeFromEditor();
      await this.showConciseResult('template', { ...this.currentProblem, code: code || '' }, 'Generating template...');
      this.trackProgress('templatesGenerated');
    } finally {
      this.setButtonLoading('template-btn', false);
    }
    this.enableChatAfterResult();
  }

  async generateTestCases() {
    this.currentContext = 'testcases';
    this.setButtonLoading('testcases-btn', true);
    try {
      await this.showConciseResult('testcases', this.currentProblem, 'Generating test cases...');
      this.trackProgress('testCasesGenerated');
    } finally {
      this.setButtonLoading('testcases-btn', false);
    }
    this.enableChatAfterResult();
  }

  async showConciseResult(action, data, loadingText) {
    const resultContainer = document.getElementById('main-result');
    resultContainer.innerHTML = `<div class="loading">${loadingText}</div>`;

    try {
      const result = await this.callAI(action, data);
      const formattedResult = this.formatBulletPoints(result);
      resultContainer.innerHTML = `<div class="ai-result">${formattedResult}</div>`;
      this.chatHistory = [{ role: 'assistant', content: result }]; // Start new chat history with AI's initial response
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

    // Close the last bullet point div if any bullet points were created
    if (formatted.includes('<div class="bullet-point">')) {
      formatted = formatted + '</div>';
    }

    return formatted;
  }

  showError(message) {
    const resultContainer = document.getElementById('main-result');
    resultContainer.innerHTML = `<div class="error">Error: ${message}</div>`;
    // Re-enable all buttons on error
    this.setButtonLoading('analyze-btn', false);
    this.setButtonLoading('get-hint-btn', false);
    this.setButtonLoading('pattern-btn', false);
    this.setButtonLoading('review-btn', false);
    this.setButtonLoading('improve-btn', false);
    this.setButtonLoading('template-btn', false);
    this.setButtonLoading('testcases-btn', false);
  }

  enableChatAfterResult() {
    const chatSection = document.getElementById('chat-section');
    chatSection.style.display = 'block';

    // Add a prompt to encourage chat if container is empty
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer && chatContainer.children.length === 0) {
      chatContainer.innerHTML = '<div class="chat-prompt">💡 Ask me follow-up questions or request clarification!</div>';
    }
  }

  // New method to clear chat history
  clearChatHistory() {
    this.chatHistory = [];
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
      chatContainer.innerHTML = '<div class="chat-prompt">💡 Ask me follow-up questions or request clarification!</div>';
    }
    console.log('Chat history cleared.');
  }

  async sendChatMessage() {
    const chatInput = document.getElementById('chat-input');
    const message = chatInput.value.trim();

    if (!message) return;

    const chatContainer = document.getElementById('chat-container');

    // Remove the initial chat prompt if it exists
    const initialPrompt = chatContainer.querySelector('.chat-prompt');
    if (initialPrompt) {
        initialPrompt.remove();
    }

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
        history: this.chatHistory // Pass current chat history
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
      '.monaco-editor textarea', // Monaco editor (common)
      '.CodeMirror-code', // CodeMirror editor (older versions)
      '.view-lines', // Another way to get code lines in Monaco
      'textarea[data-cy="code-editor"]', // Specific data attribute
      'div[class*="CodeMirror-code"] pre' // More generic CodeMirror lines
    ];

    for (let selector of editorSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        // For textarea, get value. For div/pre elements, get textContent
        if (element.tagName === 'TEXTAREA' || element.tagName === 'INPUT') {
            return element.value;
        } else {
            // For codeMirror-like elements, need to reconstruct lines
            const lines = element.querySelectorAll('.CodeMirror-line, .view-line');
            if (lines.length > 0) {
                return Array.from(lines).map(line => line.textContent.trim()).join('\n');
            }
            return element.textContent; // Fallback
        }
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
            reject(new Error(`Extension communication error: ${chrome.runtime.lastError.message}`));
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

  // Progress tracking system
  trackProgress(type) {
    chrome.storage.local.get(['userProgress'], (result) => {
      const progress = result.userProgress || {
        problemsSolved: [],
        patternsLearned: {},
        hintsUsed: 0,
        analyzed: 0,
        codeReviews: 0,
        improvements: 0,
        templatesGenerated: 0,
        testCasesGenerated: 0,
        lastActivity: null
      };

      // Update based on type
      if (type === 'hints') {
        progress.hintsUsed = (progress.hintsUsed || 0) + 1;
      } else if (type === 'patterns') {
        const pattern = this.currentProblem.title; // You could extract actual pattern from AI response
        progress.patternsLearned[pattern] = (progress.patternsLearned[pattern] || 0) + 1;
      } else if (type === 'analyzed') {
        progress.analyzed = (progress.analyzed || 0) + 1;
      } else if (type === 'codeReviews') {
        progress.codeReviews = (progress.codeReviews || 0) + 1;
      } else if (type === 'improvements') {
        progress.improvements = (progress.improvements || 0) + 1;
      } else if (type === 'templatesGenerated') {
        progress.templatesGenerated = (progress.templatesGenerated || 0) + 1;
      } else if (type === 'testCasesGenerated') {
        progress.testCasesGenerated = (progress.testCasesGenerated || 0) + 1;
      }

      // Track unique problems
      if (!progress.problemsSolved.includes(this.currentProblem.url)) {
        progress.problemsSolved.push(this.currentProblem.url);
      }

      progress.lastActivity = new Date().toISOString();

      chrome.storage.local.set({ userProgress: progress });
    });
  }
}

// Initialize the assistant when the script loads
new LeetCodeAIAssistant();
