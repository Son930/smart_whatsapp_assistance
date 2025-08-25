// api/messages.js
import { json } from "micro"; // micro is Vercel-compatible
import cors from "micro-cors";

const corsHandler = cors();

const platforms = ["WhatsApp", "Messenger", "Telegram", "Instagram"];

function getEnhancedAIResponse(platform, userMessage, sessionId = "default") {
  // copy your AI response logic here
  return `Demo AI response for ${platform}: ${userMessage}, ${sessionId}`;
}

export default corsHandler(async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { platform, userMessage, sessionId } = await json(req);

  if (!platform || !userMessage || !platforms.includes(platform)) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  const aiMessage = getEnhancedAIResponse(platform, userMessage, sessionId);

  res.status(200).json({
    platform,
    userMessage,
    aiMessage,
    timestamp: new Date().toISOString(),
    sessionId: sessionId || "default",
  });
});
