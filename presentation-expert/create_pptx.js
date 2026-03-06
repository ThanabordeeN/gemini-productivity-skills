const { execSync } = require("child_process");
const G = execSync("npm root -g").toString().trim() + "/";
const PptxGenJS = require(G + "pptxgenjs");

(async () => {
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "Gemini CLI Presentation Expert";
  pptx.title = "Gemini CLI: The Future of Corporate Efficiency";

  // --- Theme Colors ---
  const BG_COLOR = "080808";
  const ACCENT_COLOR = "00E5FF"; // Electric Blue for Corporate trust
  const TEXT_COLOR = "F5F5F5";
  const SUB_TEXT_COLOR = "A0A0A0";
  const GLASS_BG = "1A1A1A";

  // --- Slide 1: Title ---
  {
    const slide = pptx.addSlide();
    slide.background = { color: BG_COLOR };
    slide.addText("GEMINI CLI", { x: 0, y: 2.5, w: "100%", h: 1.5, fontSize: 110, bold: true, color: ACCENT_COLOR, align: "center", fontFace: "Arial Black" });
    slide.addText("REDEFINING ORGANIZATIONAL PRODUCTIVITY", { x: 0, y: 4.0, w: "100%", h: 0.5, fontSize: 18, color: TEXT_COLOR, align: "center", charSpacing: 5 });
    slide.addShape("rect", { x: 4.5, y: 5.5, w: 4, h: 0.05, fill: { color: ACCENT_COLOR } });
  }

  // --- Slide 2: The Chaos (Corporate Version) ---
  {
    const slide = pptx.addSlide();
    slide.background = { color: BG_COLOR };
    slide.addText("Information Overload is the\nSilent Productivity Killer", { x: 0.5, y: 0.5, w: 12, h: 1.5, fontSize: 54, bold: true, color: TEXT_COLOR, align: "left" });
    slide.addText("DATA SILOS", { x: 0.5, y: 2.5, w: 12, h: 4, fontSize: 140, bold: true, color: "151515", align: "center", valign: "middle" });
    slide.addText("Employees spend 20% of their time searching for information across scattered platforms, emails, and internal documents.", { x: 0.5, y: 6.5, w: 9, h: 0.8, fontSize: 20, color: SUB_TEXT_COLOR });
  }

  // --- Slide 3: The Gap (Bento Grid - Corporate) ---
  {
    const slide = pptx.addSlide();
    slide.background = { color: BG_COLOR };
    slide.addText("Traditional Workflows Lack Agility", { x: 0.5, y: 0.5, w: 12, h: 1.0, fontSize: 44, bold: true, color: TEXT_COLOR });
    const boxStyle = { fill: { color: GLASS_BG }, line: { color: "333333", width: 1 } };
    slide.addShape("roundRect", { x: 0.5, y: 1.8, w: 3.8, h: 4.5, ...boxStyle, rectRadius: 0.1 });
    slide.addText("FRAGMENTED DATA", { x: 0.7, y: 2.1, w: 3.4, fontSize: 28, bold: true, color: ACCENT_COLOR });
    slide.addText("Insights are buried in thousands of PDFs and spreadsheets.", { x: 0.7, y: 2.8, w: 3.4, fontSize: 18, color: TEXT_COLOR });
    slide.addShape("roundRect", { x: 4.6, y: 1.8, w: 3.8, h: 4.5, ...boxStyle, rectRadius: 0.1 });
    slide.addText("REPETITIVE TASKS", { x: 4.8, y: 2.1, w: 3.4, fontSize: 28, bold: true, color: ACCENT_COLOR });
    slide.addText("Hours lost on routine reporting and document drafting.", { x: 4.8, y: 2.8, w: 3.4, fontSize: 18, color: TEXT_COLOR });
    slide.addShape("roundRect", { x: 8.7, y: 1.8, w: 3.8, h: 4.5, ...boxStyle, rectRadius: 0.1 });
    slide.addText("DELAYED DECISIONS", { x: 8.9, y: 2.1, w: 3.4, fontSize: 28, bold: true, color: ACCENT_COLOR });
    slide.addText("Slow access to information leads to missed opportunities.", { x: 8.9, y: 2.8, w: 3.4, fontSize: 18, color: TEXT_COLOR });
  }

  // --- Slide 4: The Solution (Corporate) ---
  {
    const slide = pptx.addSlide();
    slide.background = { color: BG_COLOR };
    slide.addText("Gemini CLI: Your Global Intelligence\nInterface for Business Operations", { x: 0.5, y: 0.5, w: 12, h: 1.5, fontSize: 48, bold: true, color: ACCENT_COLOR });
    slide.addShape("rect", { x: 1, y: 2.5, w: 11, h: 3, fill: { color: "111111" }, line: { color: ACCENT_COLOR, width: 2 } });
    slide.addText("> gemini \"analyze Q4 sales and draft executive summary\"", { x: 1.5, y: 3.5, w: 10, fontSize: 32, fontFace: "Courier New", color: "FFFFFF" });
    slide.addText("Smart. Secure. Scalable across all departments.", { x: 0.5, y: 6.2, w: 12, fontSize: 24, italic: true, color: SUB_TEXT_COLOR, align: "center" });
  }

  // --- Slide 5: Corporate Demo Workflow ---
  {
    const slide = pptx.addSlide();
    slide.background = { color: BG_COLOR };
    slide.addText("Workflow: From Raw Data to Strategic Action", { x: 0.5, y: 0.5, w: 12, fontSize: 40, bold: true, color: TEXT_COLOR });
    
    const demoBoxStyle = { fill: { color: "111111" }, line: { color: "333333", width: 1 } };
    slide.addShape("roundRect", { x: 0.5, y: 1.5, w: 12, h: 5, ...demoBoxStyle, rectRadius: 0.05 });
    
    slide.addText("1. [RESEARCH] Cross-referencing Q4 reports and market trends...", { x: 1, y: 2.0, fontSize: 22, color: ACCENT_COLOR, bold: true });
    slide.addText("> gemini \"Find top 3 growth regions from current data siloes\"", { x: 1.2, y: 2.5, fontSize: 18, color: TEXT_COLOR, fontFace: "Courier New" });
    
    slide.addText("2. [STRATEGY] Drafting action plans for regional managers...", { x: 1, y: 3.5, fontSize: 22, color: ACCENT_COLOR, bold: true });
    slide.addText("> gemini \"Generate tailored follow-up emails for APAC managers\"", { x: 1.2, y: 4.0, fontSize: 18, color: TEXT_COLOR, fontFace: "Courier New" });
    
    slide.addText("3. [EXECUTE] Consolidating insights into a board-ready deck...", { x: 1, y: 5.0, fontSize: 22, color: ACCENT_COLOR, bold: true });
    slide.addText("> gemini \"Create a PPTX outline from these insights\"", { x: 1.2, y: 5.5, fontSize: 18, color: TEXT_COLOR, fontFace: "Courier New" });
  }

  // --- Slide 6: Case Study (Corporate Impact) ---
  {
    const slide = pptx.addSlide();
    slide.background = { color: BG_COLOR };
    slide.addText("Organizational Impact: Scaling Excellence", { x: 0.5, y: 0.5, w: 12, fontSize: 40, bold: true, color: TEXT_COLOR });

    // Stats Grid
    slide.addShape("roundRect", { x: 0.5, y: 1.5, w: 5.5, h: 2.5, fill: { color: GLASS_BG }, line: { color: ACCENT_COLOR, width: 2 }, rectRadius: 0.1 });
    slide.addText("85%", { x: 0.5, y: 1.8, w: 5.5, fontSize: 80, bold: true, color: ACCENT_COLOR, align: "center" });
    slide.addText("Faster Internal Information Retrieval", { x: 0.5, y: 3.2, w: 5.5, fontSize: 18, color: TEXT_COLOR, align: "center" });

    slide.addShape("roundRect", { x: 7.0, y: 1.5, w: 5.5, h: 2.5, fill: { color: GLASS_BG }, line: { color: ACCENT_COLOR, width: 2 }, rectRadius: 0.1 });
    slide.addText("15h+", { x: 7.0, y: 1.8, w: 5.5, fontSize: 80, bold: true, color: ACCENT_COLOR, align: "center" });
    slide.addText("Saved Weekly per Employee in Admin Tasks", { x: 7.0, y: 3.2, w: 5.5, fontSize: 18, color: TEXT_COLOR, align: "center" });

    slide.addText("\"Gemini CLI has become our Digital Chief of Staff. It handles the mundane, allowing our leadership teams to focus exclusively on strategy and growth.\"", {
        x: 1, y: 5.0, w: 11, fontSize: 24, italic: true, color: SUB_TEXT_COLOR, align: "center"
    });
    slide.addText("- COO, Global Financial Services Group", { x: 1, y: 6.2, w: 11, fontSize: 18, color: TEXT_COLOR, align: "center", bold: true });
  }

  // --- Slide 7: Security & Compliance ---
  {
    const slide = pptx.addSlide();
    slide.background = { color: BG_COLOR };
    slide.addText("Enterprise-Grade Security & Full Compliance", { x: 0.5, y: 0.5, w: 12, h: 1.0, fontSize: 40, bold: true, color: TEXT_COLOR });
    slide.addShape("roundRect", { x: 3.5, y: 2.5, w: 6, h: 3, fill: { color: "222222" }, rectRadius: 0.2 });
    slide.addText("SECURE & AUDITABLE", { x: 3.5, y: 3.0, w: 6, fontSize: 32, bold: true, color: ACCENT_COLOR, align: "center" });
    slide.addText("Full audit logs of every interaction. Zero data leaks. Your corporate knowledge stays within your secure environment.", { x: 4, y: 4.0, w: 5, fontSize: 18, color: TEXT_COLOR, align: "center" });
  }

  // --- Slide 8: Final CTA ---
  {
    const slide = pptx.addSlide();
    slide.background = { color: BG_COLOR };
    slide.addText("Modernize Your Workforce Today", { x: 0, y: 2.5, w: "100%", fontSize: 54, bold: true, color: ACCENT_COLOR, align: "center" });
    slide.addText("Empower your team with Gemini CLI.", { x: 0, y: 3.8, w: "100%", fontSize: 24, color: TEXT_COLOR, align: "center" });
    slide.addShape("rect", { x: 5.5, y: 5.0, w: 2, h: 2, fill: { color: "FFFFFF" } });
    slide.addText("[QR CODE]", { x: 5.5, y: 5.8, w: 2, color: "000000", align: "center", bold: true });
  }

  await pptx.writeFile({ fileName: "Gemini_CLI_Corporate_2026.pptx" });
  console.log("Success: Gemini_CLI_Corporate_2026.pptx created.");
})();
