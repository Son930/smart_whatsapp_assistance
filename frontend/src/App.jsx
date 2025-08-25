import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  MessageCircle,
  Phone,
  Instagram,
  Zap,
  Trash2,
  Settings,
  Sparkles,
  WifiOff,
  Wifi,
} from "lucide-react";

// Enhanced AI Response Logic (moved to separate function)
function getEnhancedAIResponse(
  platform,
  userMessage,
  conversationHistory = []
) {
  const message = userMessage.toLowerCase().trim();
  const recentMessages = conversationHistory
    .slice(-3)
    .map((m) => m.userMessage?.toLowerCase() || "");
  const isFollowUp = recentMessages.some(
    (prev) =>
      message.includes("yes") ||
      message.includes("no") ||
      message.includes("thanks") ||
      message.includes("okay")
  );

  if (
    message.match(/^(hi|hello|hey|good morning|good afternoon|good evening)/)
  ) {
    const greetings = [
      `Hello! 👋 I'm your ${platform} AI assistant. How can I help you today?`,
      `Hi there! Welcome to ${platform} AI support. What would you like to know?`,
      `Hey! Great to see you on ${platform}. I'm here to assist you with anything you need.`,
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  if (message.includes("what") && message.includes("do")) {
    return `I'm an AI assistant integrated with ${platform}! I can help you with:\n• Answering questions\n• Providing recommendations\n• General conversation\n• Task assistance\n• And much more! What specific help do you need?`;
  }

  if (message.includes("weather")) {
    const weather = ["sunny ☀️", "cloudy ⛅", "rainy 🌧️", "partly cloudy 🌤️"];
    const temp = Math.floor(Math.random() * 15) + 15;
    return `Based on current data, it's ${
      weather[Math.floor(Math.random() * weather.length)]
    } with a temperature around ${temp}°C. Don't forget to dress appropriately! 🌡️`;
  }

  if (message.includes("time") || message.includes("date")) {
    const now = new Date();
    return `Current time is ${now.toLocaleTimeString()} on ${now.toLocaleDateString()}. Is there anything specific you need help with regarding scheduling? 📅`;
  }

  if (
    message.includes("help") ||
    message.includes("support") ||
    message.includes("problem")
  ) {
    return `I'm here to help! 🆘 Could you tell me more about what specific issue you're facing? I can assist with:\n• Technical questions\n• General information\n• Recommendations\n• Problem-solving`;
  }

  if (
    message.includes("food") ||
    message.includes("restaurant") ||
    message.includes("eat")
  ) {
    const cuisines = [
      "Italian 🍝",
      "Chinese 🥢",
      "Mexican 🌮",
      "Indian 🍛",
      "Japanese 🍱",
    ];
    const cuisine = cuisines[Math.floor(Math.random() * cuisines.length)];
    return `Feeling hungry? I'd recommend trying some ${cuisine} today! There are usually great options nearby. What type of cuisine are you in the mood for?`;
  }

  if (message.match(/^(bye|goodbye|see you|talk later|thanks)/)) {
    return `Goodbye! 👋 It was great chatting with you on ${platform}. Feel free to reach out anytime you need assistance. Have a wonderful day! 😊`;
  }

  const contextualResponses = [
    `That's interesting! Tell me more about "${userMessage}". I'd love to understand your perspective better. 🤔`,
    `I see what you mean about "${userMessage}". Based on that, here's what I think might help... What's your take on this? 💭`,
    `Good point about "${userMessage}". This reminds me of similar situations where the key was to... How does that sound to you? 🎯`,
    `Thanks for sharing that! When it comes to "${userMessage}", I usually recommend... Would you like me to elaborate? 📋`,
    `Interesting topic! "${userMessage}" is something many people ask about. In my experience, the best approach is... What are your thoughts? 💡`,
  ];

  return contextualResponses[
    Math.floor(Math.random() * contextualResponses.length)
  ];
}

// Platform Configuration
const platformConfig = {
  WhatsApp: {
    icon: Phone,
    color: "bg-green-500",
    gradient: "from-green-400 to-green-600",
    lightColor: "bg-green-100 text-green-800",
  },
  Messenger: {
    icon: MessageCircle,
    color: "bg-blue-500",
    gradient: "from-blue-400 to-blue-600",
    lightColor: "bg-blue-100 text-blue-800",
  },
  Instagram: {
    icon: Instagram,
    color: "bg-pink-500",
    gradient: "from-pink-400 to-purple-600",
    lightColor: "bg-pink-100 text-pink-800",
  },
  Telegram: {
    icon: Zap,
    color: "bg-sky-500",
    gradient: "from-sky-400 to-sky-600",
    lightColor: "bg-sky-100 text-sky-800",
  },
};

// Status Badge Component
const StatusBadge = ({ useBackend, onToggle }) => (
  <button
    onClick={onToggle}
    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 hover:scale-105 ${
      useBackend
        ? "bg-green-500/20 text-green-300 border border-green-500/30 shadow-green-500/20"
        : "bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-amber-500/20"
    } shadow-lg backdrop-blur-sm`}
    title={useBackend ? "Using Backend API" : "Using Demo Mode"}
  >
    {useBackend ? (
      <Wifi className="w-3 h-3" />
    ) : (
      <WifiOff className="w-3 h-3" />
    )}
    {useBackend ? "Live API" : "Demo"}
  </button>
);

// Platform Selector Component
const PlatformSelector = ({ currentPlatform, onPlatformChange }) => (
  <div className="flex gap-2 mt-4">
    {Object.entries(platformConfig).map(([platform, config]) => {
      const Icon = config.icon;
      return (
        <button
          key={platform}
          onClick={() => onPlatformChange(platform)}
          className={`group relative p-3 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 ${
            currentPlatform === platform
              ? `bg-linear-to-r ${config.gradient} shadow-xl shadow-${config.color}/25 scale-110`
              : "bg-white/10 hover:bg-white/20 backdrop-blur-sm"
          }`}
          title={platform}
        >
          <Icon className="w-5 h-5 text-white" />
          {currentPlatform === platform && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-pulse" />
          )}
        </button>
      );
    })}
  </div>
);

// Message Component
const Message = ({ message, isUser, platform, timestamp }) => {
  const platformGradient =
    platformConfig[platform]?.gradient || "from-purple-400 to-pink-600";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`flex items-end gap-3 max-w-[85%] ${
          isUser ? "flex-row-reverse" : ""
        }`}
      >
        <div
          className={`shrink-0 p-2.5 rounded-full shadow-lg ${
            isUser
              ? "bg-linear-to-r from-blue-500 to-blue-600"
              : `bg-linear-to-r ${platformGradient}`
          }`}
        >
          {isUser ? (
            <User className="w-4 h-4 text-white" />
          ) : (
            <Bot className="w-4 h-4 text-white" />
          )}
        </div>
        <div
          className={`relative p-4 rounded-2xl shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl ${
            isUser
              ? "bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-br-md"
              : "bg-white/20 text-white rounded-bl-md border border-white/10"
          }`}
        >
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {message}
          </div>
          <div className="text-xs opacity-75 mt-2 text-right">
            {timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// System Message Component
const SystemMessage = ({ message }) => (
  <div className="flex justify-center my-4">
    <div className="bg-white/10 backdrop-blur-sm text-white/80 px-4 py-2 rounded-full text-sm border border-white/20 shadow-lg">
      <Sparkles className="w-4 h-4 inline mr-2" />
      {message}
    </div>
  </div>
);

// Typing Indicator Component
const TypingIndicator = ({ platform }) => {
  const platformGradient =
    platformConfig[platform]?.gradient || "from-purple-400 to-pink-600";

  return (
    <div className="flex justify-start mb-4">
      <div className="flex items-end gap-3 max-w-[80%]">
        <div
          className={`p-2.5 rounded-full bg-linear-to-r ${platformGradient} shadow-lg`}
        >
          <Bot className="w-4 h-4 text-white" />
        </div>
        <div className="bg-white/20 backdrop-blur-sm border border-white/10 text-white p-4 rounded-2xl rounded-bl-md shadow-lg">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-white/70 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Chat Header Component
const ChatHeader = ({
  platform,
  useBackend,
  onToggleBackend,
  onClearChat,
  onPlatformChange,
}) => {
  const PlatformIcon = platformConfig[platform].icon;
  const platformGradient = platformConfig[platform].gradient;

  return (
    <div className="bg-white/10 backdrop-blur-lg border-b border-white/20 p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className={`p-3 rounded-xl bg-linear-to-r ${platformGradient} shadow-xl`}
          >
            <PlatformIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              Multi-Platform AI Assistant - With Fake Data, does not contain actual AI, only for Demo Purposes
            </h1>
            <p className="text-white/70 text-sm">Connected to {platform}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <StatusBadge useBackend={useBackend} onToggle={onToggleBackend} />
          <button
            onClick={onClearChat}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 text-red-300 border border-red-500/30 rounded-full text-xs font-medium hover:bg-red-500/30 transition-all duration-300 hover:scale-105 shadow-lg backdrop-blur-sm"
            title="Clear conversation"
          >
            <Trash2 className="w-3 h-3" />
            Clear
          </button>
        </div>
      </div>

      <PlatformSelector
        currentPlatform={platform}
        onPlatformChange={onPlatformChange}
      />
    </div>
  );
};

// Chat Input Component
const ChatInput = ({
  value,
  onChange,
  onSend,
  onKeyPress,
  platform,
  isTyping,
  useBackend,
}) => (
  <div className="border-t border-white/20 bg-white/5 backdrop-blur-lg p-6">
    <div className="flex gap-4 items-end">
      <div className="flex-1 relative">
        <input
          type="text"
          value={value}
          onChange={onChange}
          onKeyPress={onKeyPress}
          placeholder={`Type a message for ${platform} AI...`}
          className="w-full bg-white/10 border border-white/30 rounded-2xl px-6 py-4 text-white placeholder-white/60 focus:outline-none focus:border-white/60 focus:bg-white/20 transition-all duration-300 text-sm shadow-lg backdrop-blur-sm"
          disabled={isTyping}
        />
      </div>
      <button
        onClick={onSend}
        disabled={!value.trim() || isTyping}
        className={`p-4 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl ${
          !value.trim() || isTyping
            ? "bg-white/10 text-white/50 cursor-not-allowed"
            : "bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-purple-500/25"
        }`}
        title="Send message"
      >
        <Send className="w-5 h-5" />
      </button>
    </div>

    <div className="text-center mt-3">
      <p className="text-xs text-white/50">
        {useBackend
          ? "🟢 Connected to backend API - Enhanced responses available"
          : "🟡 Demo mode - Using built-in AI responses"}
      </p>
    </div>
  </div>
);

// Main App Component
function App() {
  const [platform, setPlatform] = useState("WhatsApp");
  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      type: "ai",
      platform: "WhatsApp",
      message: `Hi! 👋 Welcome to your WhatsApp AI assistant. I'm here to help with questions, recommendations, and friendly conversation. How can I assist you today?`,
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [useBackend, setUseBackend] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

    const newUserMessage = {
      type: "user",
      platform,
      message: userMessage.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    const currentMessage = userMessage.trim();
    setUserMessage("");
    setIsTyping(true);

    const thinkingTime = Math.random() * 2000 + 1000;

    try {
      if (useBackend) {
        // Simulate backend call
        setTimeout(() => {
          throw new Error("Backend simulation");
        }, 100);
      } else {
        throw new Error("Using fallback mode");
      }
    } catch (error) {
      setTimeout(() => {
        const aiResponse = getEnhancedAIResponse(
          platform,
          currentMessage,
          messages,
          error
        );
        const newAIMessage = {
          type: "ai",
          platform,
          message: aiResponse,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, newAIMessage]);
        setIsTyping(false);
      }, thinkingTime);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handlePlatformChange = (newPlatform) => {
    setPlatform(newPlatform);
    setMessages((prev) => [
      ...prev,
      {
        type: "system",
        platform: newPlatform,
        message: `Switched to ${newPlatform} AI assistant`,
        timestamp: new Date(),
      },
    ]);

    setTimeout(() => {
      const welcomeMessage = {
        type: "ai",
        platform: newPlatform,
        message: `Hi! 👋 I'm your ${newPlatform} AI assistant. I'm here to help with anything you need. What can I do for you today?`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, welcomeMessage]);
    }, 500);
  };

  const clearConversation = () => {
    const welcomeMessage = {
      type: "ai",
      platform,
      message: `Hi! 👋 Welcome to your ${platform} AI assistant. I'm here to help with questions, recommendations, and friendly conversation. How can I assist you today?`,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-5xl mx-auto bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
        <ChatHeader
          platform={platform}
          useBackend={useBackend}
          onToggleBackend={() => setUseBackend(!useBackend)}
          onClearChat={clearConversation}
          onPlatformChange={handlePlatformChange}
        />

        <div className="h-[500px] overflow-y-auto p-6 space-y-2 bg-linear-to-b from-transparent to-white/5">
          {messages.map((msg, index) => (
            <div key={index}>
              {msg.type === "system" ? (
                <SystemMessage message={msg.message} />
              ) : (
                <Message
                  message={msg.message}
                  isUser={msg.type === "user"}
                  platform={msg.platform}
                  timestamp={msg.timestamp}
                />
              )}
            </div>
          ))}

          {isTyping && <TypingIndicator platform={platform} />}
          <div ref={messagesEndRef} />
        </div>

        <ChatInput
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          onSend={handleSendMessage}
          onKeyPress={handleKeyPress}
          platform={platform}
          isTyping={isTyping}
          useBackend={useBackend}
        />
      </div>
    </div>
  );
}

export default App;
