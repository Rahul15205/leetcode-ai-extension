# Quick Start Guide 🚀

Get up and running with LeetCode AI Assistant in 5 minutes!

---

## Step 1: Install the Extension

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right corner)
3. Click **"Load unpacked"**
4. Select the `leetcode-ai-extension` folder
5. The extension icon should appear in your toolbar ✅

---

## Step 2: Get Your FREE API Key

1. Visit [Groq Console](https://console.groq.com/keys)
2. Sign up for a free account (if you don't have one)
3. Click **"Create API Key"**
4. Copy your API key (starts with `gsk_`)
5. Keep it safe! 🔑

---

## Step 3: Configure the Extension

1. Click the LeetCode AI Assistant icon in your Chrome toolbar
2. Paste your API key in the input field
3. Click **"Save Settings"**
4. Click **"Test Connection"** to verify it works
5. You should see "Connection successful! ✅"

---

## Step 4: Try It Out!

### Basic Usage
1. Go to any LeetCode problem: [leetcode.com/problems/two-sum/](https://leetcode.com/problems/two-sum/)
2. The AI Assistant panel appears on the right side 🎉
3. Click **"Analyze Problem"** to get started
4. Use the other buttons to get hints, patterns, etc.

### Try the New Pro Features
1. Click **"Get Template"** to generate starter code
2. Write your solution in the editor
3. Click **"Generate Tests"** to create test cases
4. Click **"Review Code"** to get feedback
5. Click **"Suggest Improvement"** to see optimization opportunities

---

## Step 5: Track Your Progress

1. Click the extension icon in your toolbar
2. Scroll down to **"📊 Your Progress"**
3. See your stats update as you use the features!

---

## 💡 Pro Tips for First-Time Users

### Tip 1: Start Simple
Try this workflow for your first problem:
1. **Analyze Problem** → Understand requirements
2. **Get Hint** → Get a general direction
3. **Identify Pattern** → Learn the approach

### Tip 2: Don't Skip Test Cases
Before submitting any solution:
1. Click **"Generate Tests"**
2. Run your code against all 5 test cases
3. Fix any issues before submitting

### Tip 3: Learn from Improvements
After solving a problem:
1. Click **"Review Code"** for overall feedback
2. Click **"Suggest Improvement"** for specific optimizations
3. Apply the changes and understand WHY they're better

### Tip 4: Use Templates
Save time on every problem:
1. Open a new problem
2. Click **"Get Template"**
3. Copy to editor
4. Start coding immediately!

### Tip 5: Check Your Progress Weekly
- Click the extension icon
- Review your stats
- Celebrate your growth! 🎉

---

## 🎯 Feature Cheat Sheet

| Button | What It Does | When to Use |
|--------|-------------|-------------|
| **Analyze Problem** | Breaks down requirements, constraints, complexity | Start of every problem |
| **Get Hint** | Progressive hints (gets more specific each click) | When stuck |
| **Identify Pattern** | Shows algorithmic pattern + similar problems | Learning patterns |
| **Review Code** | Comprehensive feedback on your solution | After writing code |
| **Suggest Improvement** | One specific code diff with optimization | Optimization phase |
| **Get Template** | Generate starter code skeleton | Starting a problem |
| **Generate Tests** | Create 5 diverse test cases | Before submitting |

---

## ⚙️ Settings & Customization

### Move the Panel
- Click and drag the header to move the panel anywhere on screen
- Your position is saved automatically

### Minimize/Maximize
- Click the **−** or **+** button in the header
- Saves space when you need to focus

### Reset Progress
- Click extension icon
- Scroll to "Your Progress"
- Click **"Reset Progress"**
- Confirm

---

## 🐛 Common Issues & Solutions

### Issue: Panel doesn't appear
**Solution:** 
- Make sure you're on a problem page (not the problem list)
- Refresh the page (Ctrl+R or Cmd+R)
- Check that the extension is enabled in `chrome://extensions/`

### Issue: "API key not configured" error
**Solution:**
- Click the extension icon
- Re-enter your API key
- Click "Save Settings"
- Test the connection

### Issue: Buttons not working
**Solution:**
- Check your internet connection
- Verify your Groq API key is valid
- Check you haven't exceeded API rate limits
- Try reloading the extension

### Issue: Code not detected in editor
**Solution:**
- Make sure you've written code in the LeetCode editor
- Try clicking in the editor to focus it
- Refresh the page and try again

---

## 📚 Example: Complete Walkthrough

Let's solve "Two Sum" together:

### 1. Open the Problem
Go to: https://leetcode.com/problems/two-sum/

### 2. Understand (30 seconds)
- Click **"Analyze Problem"**
- Read the AI's breakdown
- Note the O(n) time complexity target

### 3. Learn the Pattern (30 seconds)
- Click **"Identify Pattern"**
- See that it's a "Hash Table" pattern
- Note similar problems

### 4. Get a Template (10 seconds)
- Click **"Get Template"**
- Copy the template to editor

### 5. Get Hints (as needed)
- Click **"Get Hint"** once for general direction
- Click again if you need more guidance

### 6. Write Your Solution
```python
def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
```

### 7. Generate Tests (30 seconds)
- Click **"Generate Tests"**
- Validate your solution against all 5 test cases

### 8. Review Your Code (30 seconds)
- Click **"Review Code"**
- Check correctness, complexity, edge cases

### 9. Get Improvements (30 seconds)
- Click **"Suggest Improvement"**
- See if there are any optimizations
- Apply if relevant

### 10. Submit!
Your solution is now battle-tested and optimized! 🎉

**Total time:** 3-4 minutes + coding time

---

## 🚀 Next Steps

1. ✅ **Solve 3 problems** using the assistant
2. ✅ **Try each feature** at least once
3. ✅ **Check your progress** in the popup
4. ✅ **Read the full README** for advanced tips
5. ✅ **Share with friends** who are learning LeetCode!

---

## 🎉 You're Ready!

You now have a powerful AI coding mentor at your fingertips. Happy coding! 

**Pro Tip:** The more you use it, the better you'll understand when to use each feature. Don't be afraid to experiment!

---

**Need more help?** Check out:
- [README.md](README.md) - Full documentation
- [UPGRADE_SUMMARY.md](UPGRADE_SUMMARY.md) - Details on new features
- GitHub Issues - Report bugs or request features

---

Version 2.0.0 - Pro Edition
