// Background service worker for LeetCode AI Assistant

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'ai-request') {
    handleAIRequest(request, sendResponse);
    return true; // Keep the message channel open for async response
  }
});

async function handleAIRequest(request, sendResponse) {
  try {
    const { action, data } = request;
    
    // Get API key from storage
    const apiKey = await getApiKey();
    if (!apiKey) {
      sendResponse({ error: 'API key not configured. Please set it in the extension popup.' });
      return;
    }
    
    let result;
    switch (action) {
      case 'analyze':
        result = await analyzeProblem(data, apiKey);
        break;
      case 'hint':
        result = await generateHint(data, apiKey);
        break;
      case 'pattern':
        result = await identifyPattern(data, apiKey);
        break;
      case 'review':
        result = await reviewCode(data, apiKey);
        break;
      case 'chat':
        result = await handleChatMessage(data, apiKey);
        break;
      default:
        throw new Error('Unknown action: ' + action);
    }
    
    sendResponse({ result });
  } catch (error) {
    console.error('AI request error:', error);
    sendResponse({ error: error.message });
  }
}

async function getApiKey() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['groqApiKey'], (result) => {
      resolve(result.groqApiKey);
    });
  });
}

async function analyzeProblem(problemData, apiKey) {
  const prompt = `You are a coding mentor. Provide a CONCISE analysis of this LeetCode problem:

Problem: ${problemData.title}
Difficulty: ${problemData.difficulty}
Description: ${problemData.description}

Provide EXACTLY 4 bullet points. Each bullet point must be on a separate line:

• Problem Statement: [What the problem is asking in one sentence]

• Key Constraints: [Main constraints to consider]

• Suggested Approach: [Recommended algorithm/data structure]

• Time/Space Complexity: [Target complexity]

IMPORTANT: Put each bullet point on its own line with a line break between them. No paragraphs. Keep each point to 1-2 sentences maximum.`;

  return await callGroq(prompt, apiKey, 300);
}

async function generateHint(hintData, apiKey) {
  const prompt = `Provide a CONCISE hint for this LeetCode problem:

Problem: ${hintData.title}
Difficulty: ${hintData.difficulty}

Give a brief, focused hint that nudges the student in the right direction without giving away the solution. Keep it to 1-2 sentences max.`;

  return await callGroq(prompt, apiKey, 200);
}

async function identifyPattern(problemData, apiKey) {
  const prompt = `Identify the main algorithmic pattern for this LeetCode problem:

Problem: ${problemData.title}
Difficulty: ${problemData.difficulty}

Provide EXACTLY 3 bullet points. Each bullet point must be on a separate line:

• Primary Pattern: [Pattern name - e.g., Two Pointers, DP, Hash Table]

• Why This Pattern: [Brief explanation why it fits]

• Similar Problem: [One example of similar problem]

IMPORTANT: Put each bullet point on its own line with a line break between them. No paragraphs. Keep each point to 1 sentence maximum.`;

  return await callGroq(prompt, apiKey, 250);
}

async function reviewCode(reviewData, apiKey) {
  const prompt = `Provide a CONCISE code review for this LeetCode solution:

Problem: ${reviewData.title}
Code:
\`\`\`
${reviewData.code}
\`\`\`

Provide EXACTLY 3 bullet points. Each bullet point must be on a separate line:

• Correctness: [Does it work? Any issues?]

• Time/Space Complexity: [Current complexity and if it can be optimized]

• Improvements: [Key suggestions for better code]

IMPORTANT: Put each bullet point on its own line with a line break between them. No paragraphs. Keep each point to 1-2 sentences maximum. Be encouraging.`;

  return await callGroq(prompt, apiKey, 350);
}

async function handleChatMessage(chatData, apiKey) {
  const { message, context, history = [] } = chatData;
  
  // Build conversation context
  const messages = [
    {
      role: 'system',
      content: `You are a helpful coding mentor. The user is working on a LeetCode problem: "${chatData.title}". 
      
Current context: ${context || 'general discussion'}
      
Provide concise, helpful responses. Keep answers brief and educational. Focus on guiding the student rather than giving direct solutions.`
    }
  ];
  
  // Add chat history (last 4 messages to keep context manageable)
  const recentHistory = history.slice(-4);
  messages.push(...recentHistory.map(msg => ({
    role: msg.role,
    content: msg.content
  })));
  
  // Add current message
  messages.push({
    role: 'user',
    content: message
  });
  
  return await callGroqWithMessages(messages, apiKey, 400);
}

async function callGroq(prompt, apiKey, maxTokens = 1000) {
  const messages = [
    {
      role: 'system',
      content: 'You are a helpful coding mentor and tutor. Always provide educational guidance that helps students learn, rather than just giving direct answers. Keep responses concise and educational.'
    },
    {
      role: 'user',
      content: prompt
    }
  ];
  
  return await callGroqWithMessages(messages, apiKey, maxTokens);
}

async function callGroqWithMessages(messages, apiKey, maxTokens = 1000) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'llama3-8b-8192',
      messages: messages,
      max_tokens: maxTokens,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Groq API error: ${error.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// Handle extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('LeetCode AI Assistant installed');
});
