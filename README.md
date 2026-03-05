# Gemini Productivity Skills

A collection of custom skills for the Gemini CLI to enhance productivity with file generation, media processing, and professional design.

## Available Skills

### 1. [npm-file-creator](./npm-file-creator)
Generate Office documents (PowerPoint, Word, Excel) and PDFs programmatically using Node.js libraries.
- **PowerPoint**: Uses `pptxgenjs`
- **Word**: Uses `docx`
- **Excel**: Uses `exceljs`
- **PDF**: Uses `pdf-lib`

### 2. [presentation-expert](./presentation-expert)
A specialized skill for designing modern, professional corporate presentation slides and pitch decks following 2026 design trends.
- **Modern Design**: Bento Grids, Dark Mode, Massive Typography, Glassmorphism.
- **Storytelling**: Narrative Headlines, 5-Second Clarity Test, Three-Act Arc.
- **Data Visualization**: One Insight Rule, High-impact callouts.

### 3. [monthly-report-expert](./monthly-report-expert)
Craft high-impact monthly reports using McKinsey standards (Pyramid Principle, MECE) and automation-specific KPIs.
- **Strategic Communication**: Pyramid Principle (Answer First), "So What?" Test.
- **Structure**: MECE (Mutually Exclusive, Collectively Exhaustive) framework.
- **Automation KPIs**: Efficiency gains, accuracy rates, and system reliability.

### 4. [professional-canvas-designer](./professional-canvas-designer)
Programmatically generate professional visual assets (posters, banners, infographics) with Node.js `node-canvas`.
- **Design Principles**: Visual Hierarchy, Grid Systems, and modern Typography.
- **Thai Support**: Multi-line Thai text wrapping and font-specific adjustments.
- **Advanced Layouts**: Split-screen, curved dividers, and gradient overlays.

### 5. [video-silence-cutter](./video-silence-cutter)
Automatically detect and remove silent sections from video files using FFmpeg's `silencedetect` filter. Optimized for high-quality "jump-cut" style editing.

---

## Installation for Other Users

Users can install these skills directly using the Gemini CLI:

### Install via URL
```bash
# To install monthly-report-expert (Recommended)
gemini skills install https://github.com/ThanabordeeN/gemini-productivity-skills.git --path monthly-report-expert

# To install professional-canvas-designer
gemini skills install https://github.com/ThanabordeeN/gemini-productivity-skills.git --path professional-canvas-designer

# To install presentation-expert
gemini skills install https://github.com/ThanabordeeN/gemini-productivity-skills.git --path presentation-expert

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
- "ช่วยเขียนสรุปรายงานประจำเดือน (Monthly Report) ตามมาตรฐาน McKinsey"
- "ออกแบบ Poster งานสัมมนาโดยใช้ professional-canvas-designer"
- "สร้างไฟล์ PowerPoint สรุปเนื้อหา..."
- "ช่วยออกแบบ Company Profile โดยใช้ทักษะ presentation-expert"
- "ตัดช่วงเงียบออกจากวิดีโอ input.mp4 ให้หน่อย"
