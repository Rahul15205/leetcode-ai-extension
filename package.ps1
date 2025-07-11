# PowerShell script to package LeetCode AI Assistant for Chrome Web Store

Write-Host "📦 Packaging LeetCode AI Assistant Extension..." -ForegroundColor Green

# Get current directory
$currentDir = Get-Location

# Create package folder
$packageDir = Join-Path $currentDir "package"
if (Test-Path $packageDir) {
    Remove-Item $packageDir -Recurse -Force
}
New-Item -ItemType Directory -Path $packageDir | Out-Null

# Files to include in the package
$filesToInclude = @(
    "manifest.json",
    "content.js",
    "background.js",
    "popup.html",
    "popup.js",
    "styles.css",
    "README.md",
    "LICENSE",
    "PRIVACY_POLICY.md"
)

# Copy files to package directory
foreach ($file in $filesToInclude) {
    if (Test-Path $file) {
        Copy-Item $file $packageDir
        Write-Host "✅ Added $file" -ForegroundColor Green
    } else {
        Write-Host "❌ Missing $file" -ForegroundColor Red
    }
}

# Copy icons folder
if (Test-Path "icons") {
    Copy-Item "icons" $packageDir -Recurse
    Write-Host "✅ Added icons folder" -ForegroundColor Green
} else {
    Write-Host "❌ Missing icons folder" -ForegroundColor Red
}

# Create ZIP file
$zipFile = Join-Path $currentDir "leetcode-ai-assistant.zip"
if (Test-Path $zipFile) {
    Remove-Item $zipFile -Force
}

# Use .NET to create ZIP (compatible with older PowerShell)
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($packageDir, $zipFile)

Write-Host "📁 Package created: $zipFile" -ForegroundColor Yellow

# Clean up package directory
Remove-Item $packageDir -Recurse -Force

# Display file information
$fileInfo = Get-Item $zipFile
Write-Host "📊 Package size: $([math]::Round($fileInfo.Length / 1MB, 2)) MB" -ForegroundColor Cyan

Write-Host ""
Write-Host "🎉 Extension packaged successfully!" -ForegroundColor Green
Write-Host "📤 Ready to upload to Chrome Web Store!" -ForegroundColor Yellow
Write-Host ""
Write-Host "Next steps:" -ForegroundColor White
Write-Host "1. Go to https://chrome.google.com/webstore/devconsole" -ForegroundColor Gray
Write-Host "2. Click 'Add new item'" -ForegroundColor Gray
Write-Host "3. Upload leetcode-ai-assistant.zip" -ForegroundColor Gray
Write-Host "4. Fill in store listing information" -ForegroundColor Gray
Write-Host "5. Submit for review" -ForegroundColor Gray
