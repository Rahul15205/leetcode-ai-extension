# LeetCode AI Assistant

🤖 An AI-powered Chrome extension that provides step-by-step problem solving guidance for LeetCode problems with an interactive chat system.

## Features

### Core Analysis Tools
- **Problem Analysis**: Get concise breakdowns of LeetCode problems with key insights (uses advanced AI)
- **Smart Hints**: Progressive hints that guide you without spoiling the solution
- **Pattern Recognition**: Identify algorithmic patterns and similar problems
- **Interactive Chat**: Ask follow-up questions after any analysis

### Code Tools (New! 🔥)
- **Code Review**: Get detailed feedback on your solutions with optimization suggestions (uses advanced AI)
- **Code Improvements**: Get before/after code diffs with specific improvements (uses advanced AI)
- **Template Generation**: Generate starter code templates in any language
- **Test Case Generation**: Generate 5 diverse test cases covering edge cases, performance, and common mistakes (uses advanced AI)

### Smart Features
- **Dual AI Models**: Automatically uses Llama 3.3 70B for complex tasks (reviews, analysis) and Llama 3.1 8B for fast tasks (hints, chat)
- **Progress Tracking**: Track problems worked on, hints used, code reviews, and more
- **Dark Mode Support**: Automatically adapts to LeetCode's theme
- **Persistent Assistant**: Stays visible across all LeetCode problem tabs
- **Draggable Panel**: Move the assistant anywhere on your screen

## Installation

### Option 1: Load as Unpacked Extension (Developer Mode)

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked" and select the extension folder
5. The extension icon should appear in your Chrome toolbar

### Option 2: Install from Source

1. Clone this repository: `git clone https://github.com/yourusername/leetcode-ai-extension.git`
2. Follow the same steps as Option 1

## Setup

1. Click the extension icon in your Chrome toolbar
2. Enter your Groq API key in the popup
   - Get your FREE API key from [Groq Console](https://console.groq.com/keys)
   - API key should start with `gsk_`
3. Click "Save Settings"
4. Test the connection to ensure it works

## Usage

1. Navigate to any LeetCode problem page (e.g., `https://leetcode.com/problems/two-sum/`)
2. The AI Assistant panel will appear on the right side of the page (you can drag it anywhere!)
3. Use the available features:

### Quick Analysis Tools
   - **Analyze Problem**: Get a breakdown of the problem requirements and complexity targets
   - **Get Hint**: Receive progressive hints (each click gives a more detailed hint)
   - **Identify Pattern**: Learn what algorithmic patterns apply and see similar problems

### Code Tools
   - **Review Code**: Get comprehensive feedback on your solution in the editor
   - **Suggest Improvement**: Get a specific before/after code diff with one key improvement
   - **Get Template**: Generate a starter code template (detects language from editor)
   - **Generate Tests**: Create 5 diverse test cases including edge cases and performance tests

## Features in Detail

### Problem Analysis (Advanced AI)
- Breaks down problem requirements
- Identifies key constraints and edge cases
- Suggests optimal approaches and data structures
- Provides target time/space complexity

### Step-by-Step Hints
- Progressive hint system (Hint 1, 2, 3, etc.)
- Each problem remembers its hint level
- Starts with general approaches
- Becomes more specific with each hint
- Never gives away the complete solution

### Pattern Recognition
- Identifies algorithmic patterns (Two Pointers, DP, Hash Table, etc.)
- Explains why the pattern fits this problem
- Suggests similar LeetCode problems for practice
- Helps build pattern recognition skills over time

### Code Review (Advanced AI)
- Analyzes your solution for correctness
- Detailed time/space complexity analysis
- Reviews code quality and style
- Identifies potential edge cases you might have missed

### Code Improvements (Advanced AI)
- Provides specific before/after code diffs
- Focuses on the most impactful improvement
- Shows exact code snippets to replace
- Explains why the improvement is better

### Template Generation
- Auto-detects language from your code editor
- Generates proper function signatures
- Includes structural comments for guidance
- NO implementation - just the skeleton

### Test Case Generation (Advanced AI)
- Generates 5 diverse test cases:
  - Edge cases (empty, null, single element)
  - Large inputs (performance testing)
  - Boundary conditions (min/max values)
  - Common mistake scenarios
  - Normal cases
- Each test includes input, expected output, and reasoning

### Progress Tracking
- Tracks unique problems worked on
- Counts hints used, code reviews, improvements
- Tracks templates and test cases generated
- View stats in the extension popup
- Reset progress anytime

## Privacy & Security

- API key is stored locally in Chrome's secure storage
- No data is collected or transmitted except to Groq for AI processing
- All communication is encrypted (HTTPS)
- Problem data is only sent to Groq for analysis

## API Usage & Costs

- Uses **dual AI models** for optimal performance:
  - **Llama 3.3 70B Versatile** for complex tasks (analysis, reviews, improvements, test cases)
  - **Llama 3.1 8B Instant** for fast tasks (hints, chat, patterns, templates)
- FREE tier available on Groq with generous limits
- Extremely fast inference (up to 300+ tokens/second)
- Smart model selection saves tokens and improves response quality
- Paid plans available for heavy usage

## Troubleshooting

### Extension Not Appearing
- Ensure you're on a LeetCode problem page
- Check that the extension is enabled in Chrome
- Refresh the page

### API Errors
- Verify your API key is correct
- Check your Groq account is active
- Ensure you have internet connectivity

### Panel Not Showing
- Try refreshing the page
- Check browser console for errors
- Ensure you're on `https://leetcode.com/problems/*`

## Development

### File Structure
```
leetcode-ai-extension/
├── manifest.json          # Extension configuration
├── content.js            # Content script (injected into LeetCode pages)
├── background.js         # Background service worker
├── popup.html           # Extension popup interface
├── popup.js             # Popup functionality
├── styles.css           # UI styling
├── icons/              # Extension icons
└── README.md           # This file
```

### Local Development
1. Make changes to the files
2. Go to `chrome://extensions/`
3. Click the refresh button on the extension card
4. Test your changes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - See LICENSE file for details

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check the troubleshooting section above
- Verify Groq API status

## Changelog

### Version 2.0.0 - Pro Edition
- 🔥 **Code Improvement Suggestions**: Get before/after code diffs
- 🔥 **Test Case Generation**: Generate 5 diverse test cases automatically
- 🔥 **Template Generation**: Get starter code templates in any language
- 🔥 **Dual AI Models**: Smart switching between 70B and 8B models
- 🔥 **Progress Tracking**: Track your learning journey with detailed stats
- Updated to latest Groq models (deprecated model fix)
- Improved prompts for better AI responses
- Enhanced UI with separate "Code Tools" section
- Better error handling and loading states

### Version 1.0.0
- Initial release
- Basic problem analysis
- Progressive hint system
- Pattern recognition
- Code review functionality
- Chrome extension architecture
