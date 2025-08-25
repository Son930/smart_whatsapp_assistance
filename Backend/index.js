import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Supported platforms
const platforms = ["WhatsApp", "Messenger", "Telegram", "Instagram"];

// Store conversation history for better context (in production, use a database)
const conversationHistory = new Map();

// Enhanced AI response function with much better intelligence
function getEnhancedAIResponse(
  platform,
  userMessage,
  sessionId = "default",
  previousMessages = []
) {
  const message = userMessage.toLowerCase().trim();

  // Get conversation context
  if (!conversationHistory.has(sessionId)) {
    conversationHistory.set(sessionId, []);
  }
  const history = conversationHistory.get(sessionId);

  // Context-aware responses based on conversation history
  const recentMessages = history
    .slice(-3)
    .map((m) => m.userMessage?.toLowerCase() || "");
  const isFollowUp = recentMessages.some(
    (prev) =>
      message.includes("yes") ||
      message.includes("no") ||
      message.includes("thanks") ||
      message.includes("okay") ||
      message.includes("sure") ||
      message.includes("alright")
  );

  // Store current message in history
  history.push({ userMessage: message, timestamp: new Date(), platform });
  if (history.length > 20) history.shift(); // Keep only last 20 messages

  // Greeting responses
  if (
    message.match(
      /^(hi|hello|hey|good morning|good afternoon|good evening|sup|what's up)/
    )
  ) {
    const greetings = [
      `Hello! 👋 I'm your ${platform} AI assistant. How can I help you today?`,
      `Hi there! Welcome to ${platform} AI support. What would you like to know?`,
      `Hey! Great to see you on ${platform}. I'm here to assist you with anything you need.`,
      `Good to meet you! I'm your intelligent ${platform} assistant. What brings you here today?`,
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  // Questions about the platform or assistant
  if (
    (message.includes("what") || message.includes("who")) &&
    (message.includes("you") ||
      message.includes("this") ||
      message.includes("bot"))
  ) {
    return `I'm an advanced AI assistant integrated with ${platform}! I can help you with:
• Answering questions on various topics
• Providing personalized recommendations  
• Weather and time information
• General conversation and advice
• Problem-solving assistance
• Learning and educational support
• And much more! What specific help do you need? 🤖`;
  }

  // Weather related queries
  if (
    message.includes("weather") ||
    message.includes("temperature") ||
    message.includes("forecast")
  ) {
    const weather = [
      "sunny ☀️",
      "cloudy ⛅",
      "rainy 🌧️",
      "partly cloudy 🌤️",
      "clear skies 🌤️",
    ];
    const temp = Math.floor(Math.random() * 15) + 15;
    const conditions = weather[Math.floor(Math.random() * weather.length)];

    return `Current weather conditions show ${conditions} with a temperature around ${temp}°C. 
${
  conditions.includes("rainy")
    ? "Don't forget your umbrella! ☂️"
    : conditions.includes("sunny")
    ? "Perfect day to go outside! 😎"
    : "Great day for any activities! 🌟"
} 

Would you like tips for activities suitable for this weather?`;
  }

  // Time and date related
  if (
    message.includes("time") ||
    message.includes("date") ||
    message.includes("today") ||
    message.includes("now")
  ) {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const dateStr = now.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return `📅 Current time: ${timeStr}
📆 Today's date: ${dateStr}

Is there anything specific you need help with regarding scheduling or time management?`;
  }

  // Help and support requests
  if (
    message.includes("help") ||
    message.includes("support") ||
    message.includes("problem") ||
    message.includes("issue")
  ) {
    return `I'm here to help! 🆘 Could you tell me more about what specific challenge you're facing? 

I can assist with:
• Technical questions and troubleshooting 🔧
• General information and research 📚  
• Personal recommendations 💡
• Problem-solving strategies 🎯
• Learning new topics 📖

What area would you like help with?`;
  }

  // Food and dining
  if (
    message.includes("food") ||
    message.includes("restaurant") ||
    message.includes("eat") ||
    message.includes("hungry") ||
    message.includes("dinner") ||
    message.includes("lunch")
  ) {
    const cuisines = [
      "Italian 🍝",
      "Chinese 🥢",
      "Mexican 🌮",
      "Indian 🍛",
      "Japanese 🍱",
      "Thai 🍜",
      "Mediterranean 🥗",
    ];
    const cuisine = cuisines[Math.floor(Math.random() * cuisines.length)];
    const tips = [
      "Try checking local reviews before deciding!",
      "Consider ordering something you've never tried before!",
      "Food delivery apps often have great deals.",
      "Local family-owned restaurants often have the best authentic flavors!",
    ];

    return `Feeling hungry? 🍽️ I'd recommend trying some ${cuisine} today! ${
      tips[Math.floor(Math.random() * tips.length)]
    }

What type of cuisine are you in the mood for? I can suggest specific dishes or help you find great places nearby! 😋`;
  }

  // Shopping and purchasing
  if (
    message.includes("buy") ||
    message.includes("shop") ||
    message.includes("purchase") ||
    message.includes("store")
  ) {
    const shoppingTips = [
      "Compare prices across different retailers",
      "Read reviews before making big purchases",
      "Check for seasonal sales and discounts",
      "Consider both online and in-store options",
    ];

    return `Shopping time! 🛍️ ${
      shoppingTips[Math.floor(Math.random() * shoppingTips.length)]
    }.

What are you looking to buy? I can help you:
• Find the best deals and discounts 💰
• Compare different options 📊
• Suggest trusted retailers 🏪
• Provide buying tips and advice 💡

Tell me more about what you're shopping for!`;
  }

  // Technology related
  if (
    message.includes("phone") ||
    message.includes("computer") ||
    message.includes("tech") ||
    message.includes("app") ||
    message.includes("software") ||
    message.includes("device")
  ) {
    return `Tech questions are my specialty! 💻📱 

I can help with:
• Troubleshooting common issues 🔧
• Software and app recommendations 📲
• Device comparisons and reviews 📊
• Setup and configuration guides ⚙️
• Security and privacy tips 🔒
• Performance optimization 🚀

What specific tech challenge can I assist you with today?`;
  }

  // Travel and vacation
  if (
    message.includes("travel") ||
    message.includes("trip") ||
    message.includes("vacation") ||
    message.includes("holiday") ||
    message.includes("visit")
  ) {
    const destinations = [
      "Paris 🗼",
      "Tokyo 🏯",
      "New York 🗽",
      "London 🎡",
      "Barcelona 🏖️",
      "Sydney 🏄‍♂️",
    ];
    const dest = destinations[Math.floor(Math.random() * destinations.length)];

    return `Travel planning is exciting! ✈️ ${dest} is amazing this time of year!

I can help you with:
• Destination recommendations 🌍
• Travel tips and advice 🎒
• Budget planning 💰
• Best times to visit 📅
• Local attractions and activities 🎯
• Packing suggestions 👜

Where are you thinking of going? What type of experience are you looking for? 🗺️`;
  }

  // Learning and education
  if (
    message.includes("learn") ||
    message.includes("study") ||
    message.includes("explain") ||
    message.includes("understand") ||
    message.includes("teach") ||
    message.includes("how to")
  ) {
    return `I love helping people learn new things! 📚✨

I can help you:
• Explain complex concepts simply 🧠
• Provide step-by-step tutorials 📝
• Suggest learning resources 📖
• Create study plans 📅
• Answer specific questions ❓
• Share practical examples 💡

What topic interests you? Knowledge is power, and I'm here to help you unlock it! 🚀`;
  }

  // Entertainment and fun
  if (
    message.includes("movie") ||
    message.includes("music") ||
    message.includes("game") ||
    message.includes("fun") ||
    message.includes("entertainment") ||
    message.includes("bored")
  ) {
    const activities = [
      "watching a highly-rated movie or series 🎬",
      "trying a new podcast or audiobook 🎧",
      "playing an engaging mobile game 🎮",
      "exploring music from different genres 🎵",
      "reading an interesting article or blog 📖",
    ];

    return `Looking for some entertainment? 🎉 I suggest ${
      activities[Math.floor(Math.random() * activities.length)]
    }!

I can recommend:
• Movies and TV shows 📺
• Music and podcasts 🎶  
• Games and apps 🕹️
• Books and articles 📚
• Fun activities to try 🎨

What type of entertainment are you in the mood for?`;
  }

  // Health and fitness
  if (
    message.includes("health") ||
    message.includes("fitness") ||
    message.includes("exercise") ||
    message.includes("workout") ||
    message.includes("diet")
  ) {
    return `Great that you're thinking about health! 💪 

I can provide general wellness tips like:
• Simple exercise routines 🏃‍♂️
• Healthy eating suggestions 🥗
• Stress management techniques 🧘‍♀️
• Sleep improvement tips 😴
• Motivation and goal-setting 🎯

Remember: For specific medical concerns, always consult with healthcare professionals! 👩‍⚕️

What aspect of health and wellness interests you most?`;
  }

  // Work and productivity
  if (
    message.includes("work") ||
    message.includes("job") ||
    message.includes("productive") ||
    message.includes("career") ||
    message.includes("office")
  ) {
    return `Work and productivity - important topics! 💼

I can help with:
• Time management strategies ⏰
• Productivity tips and tools 📈
• Career advice and development 📊
• Work-life balance suggestions ⚖️
• Goal setting and planning 🎯
• Communication skills 🗣️

What specific work challenge would you like help with? Let's boost your productivity! 🚀`;
  }

  // Money and finance
  if (
    message.includes("money") ||
    message.includes("budget") ||
    message.includes("save") ||
    message.includes("invest") ||
    message.includes("finance") ||
    message.includes("cost")
  ) {
    return `Financial topics are crucial! 💰 

I can share general tips about:
• Budgeting strategies 📊
• Saving money techniques 🏦
• Basic investment concepts 📈
• Cost comparison methods 💸
• Financial goal setting 🎯

Remember: For specific financial advice, consult with qualified financial professionals! 👨‍💼

What financial topic would you like to explore?`;
  }

  // Goodbye responses
  if (message.match(/^(bye|goodbye|see you|talk later|thanks|thank you|thx)/)) {
    const farewells = [
      `Goodbye! 👋 It was great chatting with you on ${platform}. Feel free to reach out anytime you need assistance. Have a wonderful day! 😊`,
      `Thank you for chatting! 🌟 I'm always here on ${platform} whenever you need help. Take care and have an amazing day! 🌈`,
      `See you later! 👋 Don't hesitate to come back if you have more questions. Enjoy the rest of your day! ✨`,
      `Thanks for the great conversation! 😊 I'm here 24/7 on ${platform} for any future assistance. Have a fantastic day ahead! 🌞`,
    ];
    return farewells[Math.floor(Math.random() * farewells.length)];
  }

  // Follow-up responses
  if (isFollowUp) {
    if (
      message.includes("yes") ||
      message.includes("sure") ||
      message.includes("ok") ||
      message.includes("okay")
    ) {
      return `Excellent! 🌟 I'm glad I could help. Is there anything else you'd like to know or discuss? I'm here and ready to assist with whatever you need! 😊`;
    }

    if (
      message.includes("no") ||
      message.includes("nope") ||
      message.includes("not really")
    ) {
      return `No problem at all! 👍 If you think of anything later, just let me know. I'm always here on ${platform} ready to help whenever you need it! 💫`;
    }
  }

  // Questions (contains ?)
  if (message.includes("?")) {
    const questionResponses = [
      `That's a great question! 🤔 Let me think about this... Based on what you're asking, there are several factors to consider. Could you provide a bit more context so I can give you the most helpful answer?`,
      `Interesting question! 💭 I love when people are curious. To give you the best possible response, could you tell me a bit more about your specific situation or what prompted this question?`,
      `Excellent question! 🎯 This is actually something many people wonder about. To provide you with the most accurate and useful information, what's your main goal or concern here?`,
      `Great question! 🌟 I can definitely help with that. To make sure I give you exactly what you need, could you share a bit more detail about what you're looking for?`,
    ];
    return questionResponses[
      Math.floor(Math.random() * questionResponses.length)
    ];
  }

  // Emotional responses - empathy
  if (
    message.includes("sad") ||
    message.includes("upset") ||
    message.includes("frustrated") ||
    message.includes("angry") ||
    message.includes("stressed") ||
    message.includes("worried")
  ) {
    const supportiveResponses = [
      `I'm sorry you're feeling that way. 💙 It's completely normal to have these feelings sometimes. Would you like to talk about what's bothering you? I'm here to listen and help however I can.`,
      `That sounds really difficult. 🤗 Sometimes sharing what's on your mind can help. I'm here to listen without judgment and offer support if you'd like.`,
      `I hear you, and I'm sorry you're going through this. 💜 Everyone faces challenges, and it's okay to feel overwhelmed sometimes. What's weighing on your mind?`,
    ];
    return supportiveResponses[
      Math.floor(Math.random() * supportiveResponses.length)
    ];
  }

  if (
    message.includes("happy") ||
    message.includes("excited") ||
    message.includes("great") ||
    message.includes("awesome") ||
    message.includes("amazing") ||
    message.includes("wonderful")
  ) {
    const celebratoryResponses = [
      `That's wonderful to hear! 😊🎉 I love when people share positive energy. Your enthusiasm is contagious! What's making you so happy today?`,
      `How amazing! 🌟 It sounds like things are going really well for you. I'd love to hear more about what's bringing you so much joy!`,
      `That's fantastic! 🥳 Positive energy like yours makes my day brighter too. Tell me more about what's got you feeling so great!`,
    ];
    return celebratoryResponses[
      Math.floor(Math.random() * celebratoryResponses.length)
    ];
  }

  // Compliments or praise
  if (
    message.includes("good job") ||
    message.includes("well done") ||
    message.includes("impressive") ||
    message.includes("smart") ||
    message.includes("helpful") ||
    message.includes("perfect")
  ) {
    return `Thank you so much! 😊 That really means a lot to me. I'm here to be as helpful as possible, and it's wonderful to know I'm succeeding. Is there anything else I can help you with today? 🌟`;
  }

  // Jokes or humor
  if (
    message.includes("joke") ||
    message.includes("funny") ||
    message.includes("laugh") ||
    message.includes("humor") ||
    message.includes("haha") ||
    message.includes("lol")
  ) {
    const jokes = [
      `Why don't scientists trust atoms? Because they make up everything! 😄 Hope that brought a smile to your face!`,
      `What do you call a bear with no teeth? A gummy bear! 🐻 I know, I know... my jokes are pretty bear-y good! 😅`,
      `Why did the scarecrow win an award? Because he was outstanding in his field! 🌾 Classic, right? 😄`,
      `I told my computer a joke about UDP... but I'm not sure if it got it! 💻 Tech humor - it's a bit niche! 😅`,
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  }

  // Science and facts
  if (
    message.includes("science") ||
    message.includes("fact") ||
    message.includes("research") ||
    message.includes("study") ||
    message.includes("discover")
  ) {
    const scienceFacts = [
      `Here's a fascinating fact: Octopuses have three hearts and blue blood! 🐙 Two hearts pump blood to their gills, while the third pumps blood to the rest of their body. Science is amazing!`,
      `Did you know that honey never spoils? 🍯 Archaeologists have found edible honey in ancient Egyptian tombs that's over 3,000 years old! The low water content and acidic pH make it naturally antimicrobial.`,
      `Amazing space fact: A day on Venus is longer than its year! 🪐 Venus rotates so slowly that one day (243 Earth days) is longer than one orbit around the sun (225 Earth days).`,
    ];
    return (
      scienceFacts[Math.floor(Math.random() * scienceFacts.length)] +
      `\n\nWhat aspect of science interests you most? I love sharing fascinating discoveries! 🔬`
    );
  }

  // Default intelligent responses with better context awareness
  const contextualResponses = [
    `That's really interesting! "${userMessage}" sounds like something worth exploring further. 🤔 Tell me more about your thoughts on this - I'd love to understand your perspective better and see how I can help!`,

    `I see what you mean about "${userMessage}". 💭 This reminds me of similar topics I've discussed before. Based on that, I think the key factors to consider are usually context, timing, and personal goals. What's your specific situation here?`,

    `Good point about "${userMessage}"! 🎯 This is actually a topic that can have many different angles depending on what you're looking for. Could you help me understand what outcome you're hoping for? That way I can give you more targeted advice.`,

    `Thanks for bringing up "${userMessage}" - it's always great when people share their thoughts! 📋 To give you the most helpful response, I'd love to know: what prompted you to think about this? Are you looking for advice, information, or just want to discuss it?`,

    `"${userMessage}" is definitely something worth discussing! 💡 I find that the best approach usually depends on the specific circumstances and what someone is trying to achieve. What's your main goal or concern here? I'm here to help however I can!`,
  ];

  return contextualResponses[
    Math.floor(Math.random() * contextualResponses.length)
  ];
}

// POST /api/messages - Enhanced endpoint
app.post("/api/messages", (req, res) => {
  const { platform, userMessage, sessionId = "default" } = req.body;

  // Input validation
  if (!platform || !userMessage) {
    return res.status(400).json({
      error: "Missing required fields: platform and userMessage are required",
      received: { platform: !!platform, userMessage: !!userMessage },
    });
  }

  if (!platforms.includes(platform)) {
    return res.status(400).json({
      error: `Unsupported platform: "${platform}". Choose from: ${platforms.join(
        ", "
      )}`,
      supportedPlatforms: platforms,
    });
  }

  // Rate limiting check (simple in-memory implementation)
  const clientKey = req.ip || "unknown";
  if (!global.rateLimiter) global.rateLimiter = new Map();

  const now = Date.now();
  const windowMs = 60000; // 1 minute window
  const maxRequests = 30; // 30 requests per minute

  if (!global.rateLimiter.has(clientKey)) {
    global.rateLimiter.set(clientKey, { count: 1, resetTime: now + windowMs });
  } else {
    const clientData = global.rateLimiter.get(clientKey);
    if (now > clientData.resetTime) {
      clientData.count = 1;
      clientData.resetTime = now + windowMs;
    } else {
      clientData.count++;
      if (clientData.count > maxRequests) {
        return res.status(429).json({
          error:
            "Rate limit exceeded. Please wait before sending more messages.",
          retryAfter: Math.ceil((clientData.resetTime - now) / 1000),
        });
      }
    }
  }

  try {
    // Generate enhanced AI response with conversation history
    const aiMessage = getEnhancedAIResponse(platform, userMessage, sessionId);

    // Log for monitoring (in production, use proper logging)
    console.log(
      `[${new Date().toISOString()}] ${platform} | ${sessionId} | "${userMessage.substring(
        0,
        50
      )}${userMessage.length > 50 ? "..." : ""}"`
    );

    // Response with additional metadata
    res.json({
      platform,
      userMessage,
      aiMessage,
      timestamp: new Date().toISOString(),
      sessionId,
      responseTime: Date.now() - now,
    });
  } catch (error) {
    console.error("Error generating AI response:", error);
    res.status(500).json({
      error: "Internal server error while processing your message",
      platform,
      userMessage:
        userMessage.substring(0, 100) + (userMessage.length > 100 ? "..." : ""),
    });
  }
});

// GET /api/platforms - List supported platforms
app.get("/api/platforms", (req, res) => {
  res.json({
    platforms,
    totalSupported: platforms.length,
    description:
      "Multi-platform AI assistant supporting major messaging platforms",
  });
});

// GET /api/health - Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    platforms: platforms.length,
  });
});

// GET /api/conversation/:sessionId - Get conversation history
app.get("/api/conversation/:sessionId", (req, res) => {
  const { sessionId } = req.params;
  const history = conversationHistory.get(sessionId) || [];

  res.json({
    sessionId,
    messageCount: history.length,
    history: history.slice(-10), // Return last 10 messages for privacy
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: "Something went wrong!",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    availableEndpoints: [
      "POST /api/messages",
      "GET /api/platforms",
      "GET /api/health",
      "GET /api/conversation/:sessionId",
    ],
  });
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("Received SIGTERM, shutting down gracefully...");
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(
    `✅ Enhanced Multi-platform AI Backend running on http://localhost:${PORT}`
  );
  console.log(`🚀 Supported platforms: ${platforms.join(", ")}`);
  console.log(`🧠 Enhanced AI responses with conversation memory enabled`);
  console.log(`📊 Available endpoints:`);
  console.log(`   POST /api/messages - Send messages to AI`);
  console.log(`   GET  /api/platforms - List supported platforms`);
  console.log(`   GET  /api/health - Health check`);
  console.log(
    `   GET  /api/conversation/:sessionId - Get conversation history`
  );
});
