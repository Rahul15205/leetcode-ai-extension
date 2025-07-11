# LeetCode AI Assistant

🤖 An AI-powered Chrome extension that provides step-by-step problem solving guidance for LeetCode problems with an interactive chat system.

## Features

- **Problem Analysis**: Get concise breakdowns of LeetCode problems with key insights
- **Smart Hints**: Progressive hints that guide you without spoiling the solution
- **Pattern Recognition**: Identify algorithmic patterns and similar problems
- **Code Review**: Get feedback on your solutions with optimization suggestions
- **Interactive Chat**: Ask follow-up questions after any analysis
- **Dark Mode Support**: Automatically adapts to LeetCode's theme
- **Persistent Assistant**: Stays visible across all LeetCode problem tabs

## Installation

### Option 1: Load as Unpacked Extension (Developer Mode)

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked" and select the extension folder
5. The extension icon should appear in your Chrome toolbar

### Option 2: Manual Installation

1. Download the extension files
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
2. The AI Assistant panel will appear on the right side of the page
3. Use the available features:
   - **Analyze Problem**: Get a breakdown of the problem requirements
   - **Get Next Hint**: Receive progressive hints (start with general approaches)
   - **Identify Pattern**: Learn what algorithmic patterns apply
   - **Review My Code**: Get feedback on your solution (paste your code first)

## Features in Detail

### Problem Analysis
- Breaks down problem requirements
- Identifies key constraints
- Suggests general approaches
- Helps understand what the problem is asking

### Step-by-Step Hints
- Progressive hint system (Hint 1, 2, 3, etc.)
- Starts with general approaches
- Becomes more specific with each hint
- Never gives away the complete solution

### Pattern Recognition
- Identifies algorithmic patterns (Two Pointers, DP, etc.)
- Explains why the pattern fits
- Suggests similar problems
- Helps build pattern recognition skills

### Code Review
- Analyzes your solution for correctness
- Suggests optimizations
- Reviews code quality and style
- Identifies potential edge cases

## Privacy & Security

- API key is stored locally in Chrome's secure storage
- No data is collected or transmitted except to Groq for AI processing
- All communication is encrypted (HTTPS)
- Problem data is only sent to Groq for analysis

## API Usage & Costs

- Uses Groq's Llama 3 model (FREE tier available)
- Extremely fast inference (up to 300+ tokens/second)
- Free tier includes generous usage limits
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

### Version 1.0.0
- Initial release
- Basic problem analysis
- Progressive hint system
- Pattern recognition
- Code review functionality
- Chrome extension architecture
