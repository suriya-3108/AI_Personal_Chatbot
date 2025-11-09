import { jsPDF } from "jspdf";

// Clean any text before printing and capitalize names
const clean = (val) => {
  if (val === null || val === undefined) return "(no message)";
  if (typeof val !== "string") val = String(val);
  return val
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/[\r\n]+/g, "\n")
    .replace(/\u0000/g, "")
    // Remove emojis and other special characters that break formatting
    .replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, "")
    // Remove other problematic characters
    .replace(/[^\x00-\x7F]/g, "")
    .trim();
};

// Capitalize the first letter of each word for names
const capitalizeName = (name) => {
  if (!name || typeof name !== "string") return "User";
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Safe text splitting function with better emoji handling
const safeSplitText = (pdf, text, maxWidth) => {
  try {
    // First clean the text of emojis and problematic characters
    const cleanText = clean(text);
    return pdf.splitTextToSize(cleanText, maxWidth);
  } catch (error) {
    console.warn("Text splitting failed, using fallback:", error);
    // Fallback: split by spaces and manually break lines
    const cleanText = clean(text);
    const words = cleanText.split(' ');
    const lines = [];
    let currentLine = '';
    
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      if (pdf.getTextWidth(testLine) <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  }
};

export const generatePDF = (messages = [], userName = "User", chatbotName = "AI Assistant", theme = "dark") => {
  const pdf = new jsPDF("p", "pt", "a4");

  const pageWidth = pdf.internal.pageSize.getWidth() || 595;
  const pageHeight = pdf.internal.pageSize.getHeight() || 842;
  const margin = 40;
  const maxWidth = pageWidth - margin * 2;
  const lineHeight = 14;
  let y = margin;

  // Use standard font for better compatibility
  const mainFont = "helvetica";

  // Capitalize names for better presentation
  const capitalizedUserName = capitalizeName(userName);
  const capitalizedChatbotName = capitalizeName(chatbotName);

  // ---- Header -------------------------------------------------
  pdf.setFont(mainFont, "bold");
  pdf.setFontSize(18);
  
  // Header color
  if (theme === "dark") {
    pdf.setTextColor(59, 130, 246); // blue
  } else {
    pdf.setTextColor(37, 99, 235); // blue
  }
  
  // Clean header with capitalized names
  const headerText = `Chat with ${clean(capitalizedChatbotName)}`;
  pdf.text(headerText, margin, y);
  y += 25;

  // User info
  pdf.setFont(mainFont, "normal");
  pdf.setFontSize(11);
  
  if (theme === "dark") {
    pdf.setTextColor(180, 190, 200);
  } else {
    pdf.setTextColor(90, 100, 110);
  }
  
  const userInfo = `${clean(capitalizedUserName)} | ${new Date().toLocaleString()}`;
  pdf.text(userInfo, margin, y);
  y += 20;

  // Separator line
  if (theme === "dark") {
    pdf.setDrawColor(70, 70, 70);
  } else {
    pdf.setDrawColor(180, 180, 180);
  }
  pdf.line(margin, y, pageWidth - margin, y);
  y += 20;

  // ---- Messages ------------------------------------------------
  for (const msg of messages) {
    if (!msg || !msg.content) continue;

    // Use capitalized names for display
    const sender = msg.role === "user" ? capitalizedUserName : capitalizedChatbotName;
    const content = clean(msg.content);

    // Check if we need a new page before adding new message
    if (y > pageHeight - 100) {
      pdf.addPage();
      y = margin;
    }

    // Sender label
    pdf.setFont(mainFont, "bold");
    
    // Sender color
    if (msg.role === "user") {
      if (theme === "dark") {
        pdf.setTextColor(96, 165, 250); // light blue
      } else {
        pdf.setTextColor(37, 99, 235); // blue
      }
    } else {
      if (theme === "dark") {
        pdf.setTextColor(240, 240, 240); // light gray
      } else {
        pdf.setTextColor(20, 20, 20); // dark gray
      }
    }
    
    const senderText = `${clean(sender)}:`;
    pdf.text(senderText, margin, y);
    y += 16;

    // Message content
    pdf.setFont(mainFont, "normal");
    
    // Message text color
    if (theme === "dark") {
      pdf.setTextColor(255, 255, 255); // white
    } else {
      pdf.setTextColor(0, 0, 0); // black
    }

    // Split text into lines (emoji cleaning happens inside safeSplitText)
    const lines = safeSplitText(pdf, content, maxWidth - 20);
    
    for (const line of lines) {
      // Check for page break before each line
      if (y > pageHeight - 80) {
        pdf.addPage();
        y = margin;
      }
      pdf.text(line, margin + 20, y);
      y += lineHeight;
    }

    // Add spacing after message
    y += 10;
    
    // Message separator line
    if (theme === "dark") {
      pdf.setDrawColor(80, 80, 80);
    } else {
      pdf.setDrawColor(200, 200, 200);
    }
    pdf.line(margin, y - 4, pageWidth - margin, y - 4);
    y += 10;
  }

  // ---- Footer -------------------------------------------------
  pdf.setFont(mainFont, "normal");
  pdf.setFontSize(10);
  
  if (theme === "dark") {
    pdf.setTextColor(160, 160, 160);
  } else {
    pdf.setTextColor(100, 100, 100);
  }
  
  const footerText = `Generated by ${clean(capitalizedChatbotName)} on ${new Date().toLocaleString()}`;
  pdf.text(footerText, margin, pageHeight - 30);

  return pdf;
};

// -------- Export helpers --------------------------------------

export const downloadChatPDF = (messages, userName, chatbotName, theme = "dark") => {
  try {
    // Validation
    if (!messages || messages.length === 0) {
      alert("No messages to download.");
      return;
    }

    const pdf = generatePDF(messages, userName, chatbotName, theme);
    
    // Use capitalized names for filename too
    const capitalizedUserName = capitalizeName(userName);
    const capitalizedChatbotName = capitalizeName(chatbotName);
    
    const fileName = `chat-${capitalizedUserName || "User"}-${capitalizedChatbotName || "AI"}-${new Date()
      .toISOString()
      .split("T")[0]}.pdf`;
    pdf.save(fileName);
    console.log("✅ PDF saved:", fileName);
  } catch (err) {
    console.error("❌ PDF download failed:", err);
    alert("PDF generation failed. Please try again.");
  }
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text ?? "");
    console.log("✅ Copied to clipboard");
    return true;
  } catch (err) {
    console.error("❌ Copy failed:", err);
    return false;
  }
};

export const exportChatAsText = (messages, userName, chatbotName) => {
  try {
    if (!messages || messages.length === 0) {
      alert("No messages to export.");
      return;
    }

    // Use capitalized names for text export too
    const capitalizedUserName = capitalizeName(userName);
    const capitalizedChatbotName = capitalizeName(chatbotName);

    const textContent = (messages || [])
      .map(
        (m) =>
          `${m?.role === "user" ? capitalizedUserName || "User" : capitalizedChatbotName || "AI"}: ${clean(m?.content)}`
      )
      .join("\n\n");

    const blob = new Blob([textContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-${capitalizedUserName || "User"}-${capitalizedChatbotName || "AI"}-${new Date()
      .toISOString()
      .split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    console.log("✅ Text export completed");
  } catch (err) {
    console.error("❌ Text export failed:", err);
    alert("Text export failed. Please try again.");
  }
};