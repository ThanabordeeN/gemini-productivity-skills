# Gemini Productivity Skills

A collection of custom skills for the Gemini CLI to enhance productivity with file generation and media processing.

## Available Skills

### 1. [npm-file-creator](./npm-file-creator)
Generate Office documents (PowerPoint, Word, Excel) and PDFs programmatically using Node.js libraries.
- **PowerPoint**: Uses `pptxgenjs`
- **Word**: Uses `docx`
- **Excel**: Uses `exceljs`
- **PDF**: Uses `pdf-lib`

### 2. [video-silence-cutter](./video-silence-cutter)
Automatically detect and remove silent sections from video files using FFmpeg's `silencedetect` filter. Optimized for high-quality "jump-cut" style editing.

---

## Installation for Other Users

Users can install these skills directly using the Gemini CLI:

### Install via URL
```bash
# To install npm-file-creator
gemini skills install https://github.com/ThanabordeeN/gemini-productivity-skills.git --path npm-file-creator

# To install video-silence-cutter
gemini skills install https://github.com/ThanabordeeN/gemini-productivity-skills.git --path video-silence-cutter
```

### Manual Installation
1. Clone this repository:
   ```bash
   git clone https://github.com/ThanabordeeN/gemini-productivity-skills.git
   ```
2. Link the repository to your Gemini CLI:
   ```bash
   gemini skills link ./gemini-productivity-skills
   ```
3. Or copy the skill folders to your local skills directory:
   - **Windows**: `%USERPROFILE%\.gemini\skills\`
   - **macOS/Linux**: `~/.gemini/skills/`

---

## Usage
Once installed, you can trigger these skills by asking Gemini to perform the respective tasks:
- "สร้างไฟล์ PowerPoint สรุปเนื้อหา..."
- "ตัดช่วงเงียบออกจากวิดีโอ input.mp4 ให้หน่อย"
