// background.js - LeetCode AI Assistant
// This is the service worker that handles AI API calls and acts as an intermediary.

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
      case 'testcases':
        result = await generateTestCases(data, apiKey);
        break;
      case 'template':
        result = await generateTemplate(data, apiKey);
        break;
      case 'improvement':
        result = await getSuggestedImprovement(data, apiKey);
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
URL: ${problemData.url}

Provide EXACTLY 4 bullet points. Each bullet point must be on a separate line:

• Problem Statement: [What the problem is asking in one sentence, rephrased for clarity]

• Key Constraints: [Main constraints or edge cases to consider, such as input size, value ranges, or data types.]

• Suggested Approach: [Recommended high-level algorithm(s) or data structure(s) that might be suitable for this problem.]

• Time/Space Complexity: [Target optimal time and space complexity for a good solution.]

IMPORTANT: Put each bullet point on its own line with a line break between them. No paragraphs. Keep each point to 1-2 sentences maximum. Ensure the tone is educational and guiding, not directly solving.`;

  return await callGroq(prompt, apiKey, 300);
}

async function generateHint(hintData, apiKey) {
  const hintLevel = hintData.hintLevel || 1; // Default to level 1 if not provided

  let prompt = `You are a coding mentor. Provide a CONCISE hint for this LeetCode problem:

Problem: ${hintData.title}
Difficulty: ${hintData.difficulty}
URL: ${hintData.url}

`; // Added URL for more context if needed by AI

  if (hintLevel === 1) {
    prompt += `This is hint level 1. Give a very general hint about the overall approach or category of algorithms that might be relevant. Focus on the core idea needed. Keep it to 1-2 sentences.`;
  } else if (hintLevel === 2) {
    prompt += `This is hint level 2. Provide a slightly more specific hint, perhaps suggesting a data structure or a key property to observe in the problem's input or output. Keep it to 1-2 sentences.`;
  } else if (hintLevel === 3) {
    prompt += `This is hint level 3. Give a more direct hint, possibly mentioning a critical step in the algorithm or a specific technique. Keep it to 1-2 sentences, but still avoid giving the full solution or explicit code.`;
  } else {
    // For hint levels beyond 3, provide a more explicit "getting closer" hint
    prompt += `This is hint level ${hintLevel}. You've asked for multiple hints. Here's a hint that gets closer to the solution, focusing on a specific part of the algorithm or an optimization. Keep it to 1-2 sentences.`;
  }

  return await callGroq(prompt, apiKey, 200);
}

async function identifyPattern(problemData, apiKey) {
  const prompt = `You are a coding mentor. Identify the main algorithmic pattern for this LeetCode problem:

Problem: ${problemData.title}
Difficulty: ${problemData.difficulty}
URL: ${problemData.url}

Provide EXACTLY 4 bullet points. Each bullet point must be on a separate line:

• Primary Pattern: [Pattern name - e.g., Two Pointers, Dynamic Programming, Hash Table, Greedy, Backtracking, Divide and Conquer, BFS/DFS, Sliding Window, etc.]

• Key Characteristics: [Briefly explain the defining features or properties of this pattern relevant to the problem, like how it typically operates or what kind of problems it solves.]

• Why This Pattern Fits: [Brief explanation why this specific pattern is suitable for this problem's structure or requirements.]

• Similar Problem: [One specific example of a well-known LeetCode problem (e.g., "Two Sum", "Longest Substring Without Repeating Characters", "Merge Two Sorted Lists") that also uses this pattern. Provide just the problem name.]

IMPORTANT: Put each bullet point on its own line with a line break between them. No paragraphs. Keep each point to 1-2 sentences maximum.`;

  return await callGroq(prompt, apiKey, 300, true); // Use advanced model for analysis
}

async function reviewCode(reviewData, apiKey) {
  // Try to automatically detect language for better review
  const codeLanguage = detectLanguage(reviewData.code);
  const langSpecificPrompt = codeLanguage && codeLanguage !== 'Unknown' ? ` (Language: ${codeLanguage})` : '';

  const prompt = `You are a coding mentor. Provide a CONCISE and encouraging code review for this LeetCode solution for the problem "${reviewData.title}"${langSpecificPrompt}:

Code:
\`\`\`
${reviewData.code}
\`\`\`

Provide EXACTLY 4 bullet points. Each bullet point must be on a separate line:

• Correctness & Edge Cases: [Does it work correctly across various inputs, including common edge cases? Mention any potential issues or strengths.]

• Time/Space Complexity: [Analyze the current time and space complexity of the provided code. Suggest if and how optimization is possible.]

• Code Quality & Style: [Comment on readability, variable naming, and adherence to good coding practices for ${codeLanguage || 'the given language'}.]

• Key Improvements: [Provide actionable suggestions for optimization or clearer code. Include small, illustrative code snippets (within backticks, e.g., \`some_code()\`) if helpful for a suggestion.]

IMPORTANT: Put each bullet point on its own line with a line break between them. No paragraphs. Keep each point to 1-3 sentences maximum. Be encouraging and constructive.`;

  return await callGroq(prompt, apiKey, 450, true); // Use advanced model for code review
}

async function handleChatMessage(chatData, apiKey) {
  const { message, context, history = [] } = chatData;

  // Build conversation context
  const messages = [
    {
      role: 'system',
      content: `You are a helpful coding mentor and tutor. The user is currently working on a LeetCode problem titled "${chatData.title}".
      
      The last main action taken was related to: ${context || 'general discussion'}.
      
      Provide concise, helpful responses. Keep answers brief and educational. Focus on guiding the student to understand concepts or debug, rather than just giving direct solutions or full code. If asked for code, provide small snippets, not full solutions. Maintain the persona of a helpful mentor.`
    }
  ];

  // Add chat history (last 6 messages to keep context manageable)
  const recentHistory = history.slice(-6); // Increased history context
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

async function generateTestCases(problemData, apiKey) {
  const prompt = `You are a coding mentor. Generate 5 diverse test cases for this LeetCode problem:

Problem: ${problemData.title}
Difficulty: ${problemData.difficulty}
Description: ${problemData.description}

Provide EXACTLY 5 test cases covering:
• Edge case (empty input, single element, null, etc.)
• Large input (performance/scalability testing)
• Boundary condition (min/max values, limits)
• Common mistake scenario (catches typical bugs)
• Normal case (typical valid input)

Format each test case as:
**Test Case N: [Type]**
Input: [input values]
Expected Output: [expected result]
Reason: [why this test is important]

IMPORTANT: Keep each test case concise (2-3 lines max). Use actual values, not placeholders.`;

  return await callGroq(prompt, apiKey, 500, true); // Use advanced model
}

async function generateTemplate(templateData, apiKey) {
  const language = templateData.language || detectLanguage(templateData.code || '') || 'Python';
  
  const prompt = `You are a coding mentor. Generate a starter code template in ${language} for this LeetCode problem:

Problem: ${templateData.title}
Description: ${templateData.description}

Provide:
• Function signature with proper parameter names and types
• Basic structure/skeleton
• Comments indicating key steps (NO implementation)
• Return statement placeholder

IMPORTANT: 
- Do NOT implement the solution
- Only provide structure and comments as guidance
- Use proper ${language} syntax
- Keep it under 20 lines`;

  return await callGroq(prompt, apiKey, 400);
}

async function getSuggestedImprovement(improvementData, apiKey) {
  const codeLanguage = detectLanguage(improvementData.code);
  const langSpecificPrompt = codeLanguage && codeLanguage !== 'Unknown' ? ` (Language: ${codeLanguage})` : '';

  const prompt = `You are a coding mentor. Analyze this code and provide ONE specific, actionable improvement${langSpecificPrompt}:

Problem: ${improvementData.title}

Code:
\`\`\`
${improvementData.code}
\`\`\`

Provide your response in this EXACT format:

**BEFORE:**
\`\`\`${codeLanguage.toLowerCase()}
[exact code snippet to replace - must be copy-pasteable from the original]
\`\`\`

**AFTER:**
\`\`\`${codeLanguage.toLowerCase()}
[improved code snippet - same length/scope as BEFORE]
\`\`\`

**IMPROVEMENT:** [One sentence explaining why this is better - focus on time/space complexity, readability, or correctness]

IMPORTANT:
- Focus on the MOST impactful improvement
- BEFORE section must match existing code exactly
- Keep snippets small and focused (3-10 lines)
- Be specific and actionable`;

  return await callGroq(prompt, apiKey, 500, true); // Use advanced model
}

async function callGroq(prompt, apiKey, maxTokens = 1000, useAdvancedModel = false) {
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

  return await callGroqWithMessages(messages, apiKey, maxTokens, useAdvancedModel);
}

async function callGroqWithMessages(messages, apiKey, maxTokens = 1000, useAdvancedModel = false) {
  // Use advanced model for complex tasks (review, analysis, improvements)
  // Use fast model for simple tasks (hints, chat, patterns)
  const model = useAdvancedModel ? 'llama-3.3-70b-versatile' : 'llama-3.1-8b-instant';
  
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
      max_tokens: maxTokens,
      temperature: 0.7 // A moderate temperature for balanced creativity and consistency
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Groq API error: ${error.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  if (!data.choices || data.choices.length === 0 || !data.choices[0].message) {
      throw new Error('Invalid response from Groq API.');
  }
  return data.choices[0].message.content;
}

// Helper function for basic language detection
function detectLanguage(code) {
    // These are very basic heuristics and can be expanded for better accuracy.
    // Order matters: more specific checks first.
    if (code.includes('import java.') || code.includes('public class ') || code.includes('System.out.println')) return 'Java';
    if (code.includes('#include') || code.includes('std::cout') || code.includes('int main(') || code.includes('using namespace std;')) return 'C++';
    if (code.includes('def ') || (code.includes('import ') && !code.includes('java.')) || code.includes('print(') || code.includes('elif')) return 'Python';
    if (code.includes('function ') || code.includes('const ') || code.includes('let ') || code.includes('console.log(') || code.includes('var ')) return 'JavaScript';
    if (code.includes('func main()') || code.includes('package main') || code.includes('fmt.Println')) return 'Go';
    if (code.includes('using System;') || code.includes('Console.WriteLine') || code.includes('namespace ')) return 'C#';
    if (code.includes('fn main()') || code.includes('println!') || code.includes('mod ')) return 'Rust';
    if (code.includes('<?php')) return 'PHP';
    // Adding common HTML/CSS/JS file indicators just in case the context is broader
    if (code.includes('<!-- HTML') || code.includes('<html')) return 'HTML'; // This is the line you were asking about!
    if (code.includes('body {') || code.includes('.class {') || code.includes('#id {')) return 'CSS';
    // Specific to Swift typically seen in LeetCode if supported or in Apple environments
    if (code.includes('// swiftlint:disable') || code.includes('import Foundation') || code.includes('class Solution')) return 'Swift';

    return 'Unknown';
}
// Handle extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('LeetCode AI Assistant installed');
});