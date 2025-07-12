import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, Bot, User, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { saveBotMessage, getBotHistory, getCurrentUser } from "@/lib/supabase";
import { toast } from "sonner";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const EcoBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hey there, eco-warrior! 🌱✨ I'm EcoBot, your super-friendly sustainable shopping buddy! I'm here to help you save the planet one purchase at a time! 🌍💚 Ask me anything about eco-friendly products, green alternatives, or how to be more sustainable! You can even use voice commands - just click the mic! Ready to make some green magic happen? 🪄🌿",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const recognitionRef = useRef<any>(null);
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Check for speech recognition support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setSpeechSupported(!!SpeechRecognition && 'speechSynthesis' in window);
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
        toast.success("🎙️ Voice captured: " + transcript);
      };
      
      recognitionRef.current.onerror = () => {
        setIsListening(false);
        toast.error("Voice recognition failed. Please try again.");
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
    
    speechSynthesisRef.current = window.speechSynthesis;
    
    // Load user and message history
    loadUserAndHistory();
  }, []);

  const loadUserAndHistory = async () => {
    try {
      const user = await getCurrentUser();
      setCurrentUser(user);
      
      if (user) {
        const { data: history } = await getBotHistory(user.id);
        if (history && history.length > 0) {
          const loadedMessages: Message[] = [];
          
          history.forEach((msg: any) => {
            loadedMessages.push({
              id: msg.id,
              text: msg.message,
              sender: 'user',
              timestamp: new Date(msg.created_at)
            });
            loadedMessages.push({
              id: msg.id + '_bot',
              text: msg.response,
              sender: 'bot',
              timestamp: new Date(msg.created_at)
            });
          });
          
          setMessages(prev => [...prev, ...loadedMessages]);
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const quickQuestions = [
    "🛍️ What are the best plastic-free alternatives?",
    "🌍 How can I shop more sustainably?", 
    "🥗 Show me local & organic food options",
    "📱 How do I scan products for eco-scores?",
    "🎯 What's my current eco-impact?",
    "♻️ Where can I recycle this item?",
  ];

  const botResponses: { [key: string]: string } = {
    "plastic": "Awesome question! 🛍️✨ Here are my fave plastic-free alternatives: stylish reusable canvas bags, trendy jute totes, cool bamboo fiber bags, and chic recycled material carriers! 🌱 Fun fact: Using just one reusable bag can save over 1,000 plastic bags per year! You're basically a planet superhero! 🦸‍♀️💚",
    "carbon": "Great thinking, eco-champion! 🌍💚 Here's how to slash your carbon footprint: choose local goodies (less transport = happy planet! 🚛➡️🌱), grab seasonal treats, pick minimal packaging, go organic when you can, and definitely use our EcoSwap magic for lower-carbon swaps! Every choice counts! 🎯✨",
    "organic": "Love this question! 🌱🤔 Organic products are grown without synthetic nasties - no harsh pesticides, fertilizers, or GMOs! They're like a spa treatment for the soil and amazing for biodiversity! 🦋 Conventional products work too and are budget-friendly. Our eco-score considers both planet impact AND your wallet! 💰🌍",
    "local": "Yes! Supporting local is SO cool! 🏪✨ Try farmer's markets (they're like food festivals! 🥕🎪), local co-ops, community-supported agriculture (CSA), and look for 'locally sourced' labels! Aim for under 100 miles - fresher food, lower emissions, AND you're supporting your neighbors! 🤝💚",
    "scan": "This is where the magic happens! 📱✨ Just point your camera at ANY barcode, wait for that satisfying green scan indicator, then BOOM! 💥 Instant eco-alternatives and impact data! Pro tip: try saying 'Hey EcoBot, scan this!' while scanning - I love voice commands! 🎙️🌟",
    "voice": "I LOVE talking with you! 🎙️💬 Try these fun commands: 'Compare products', 'Show alternatives', 'What's my eco score?', 'Find recycling options', or just chat naturally! Tap and hold the chat button to speak - it's like having a green bestie in your pocket! 💚📱",
    "hello": "Hello there, amazing human! 👋✨ I'm absolutely thrilled to help you make the world greener, one awesome choice at a time! What sustainable adventure shall we go on today? 🌱🚀",
    "help": "I'm your eco-superhero sidekick! 🦸‍♀️💚 I can help you discover amazing eco-friendly alternatives 🌿, understand those important eco-scores 📊, share the coolest sustainable shopping secrets 🛒✨, guide you through recycling like a pro ♻️, and help you maximize your planet-saving superpowers! 💪🌍",
    "recycle": "Recycling rockstar mode activated! ♻️🌟 I can help you find the perfect recycling spots for any item! Just tell me what you need to recycle, and I'll point you to the nearest facilities. Many items like electronics, batteries, and textiles need special recycling centers - but I've got you covered! 🎯💚",
    "score": "Your eco-score is looking fantastic! 🏆✨ It measures your environmental impact based on product choices, recycling habits, and sustainable swaps. The higher the score, the more you're helping our beautiful planet! Keep up the amazing work, eco-warrior! 🌱💪",
    "default": "Ooh, that's a fascinating question! 🤔✨ While I'm totally obsessed with eco-friendly shopping (it's my superpower! 💚), I'd love to point you toward our amazing product comparison tool or our collection of eco-certified goodies! Plus, you can earn awesome points by making planet-friendly swaps! 🏆 Is there anything specific about green products that's got you curious? 🌱🔍",
  };

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes("plastic") || message.includes("bag")) return botResponses.plastic;
    if (message.includes("carbon") || message.includes("footprint")) return botResponses.carbon;
    if (message.includes("organic") || message.includes("conventional")) return botResponses.organic;
    if (message.includes("local") || message.includes("sustainable food")) return botResponses.local;
    if (message.includes("scan") || message.includes("barcode") || message.includes("camera")) return botResponses.scan;
    if (message.includes("voice") || message.includes("speak") || message.includes("command")) return botResponses.voice;
    if (message.includes("hello") || message.includes("hi") || message.includes("hey")) return botResponses.hello;
    if (message.includes("help")) return botResponses.help;
    if (message.includes("recycle") || message.includes("recycling")) return botResponses.recycle;
    if (message.includes("score") || message.includes("eco score") || message.includes("impact")) return botResponses.score;
    
    return botResponses.default;
  };

  const startListening = () => {
    if (recognitionRef.current && speechSupported) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speakMessage = (text: string) => {
    if (speechSynthesisRef.current && speechSupported) {
      speechSynthesisRef.current.cancel(); // Stop any ongoing speech
      setIsSpeaking(true);
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      utterance.onerror = () => {
        setIsSpeaking(false);
      };
      
      speechSynthesisRef.current.speak(utterance);
    }
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      speechSynthesisRef.current?.cancel();
      setIsSpeaking(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    const isVoiceInput = isListening;
    setInputMessage("");
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(async () => {
      const botResponse = getBotResponse(currentInput);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
      
      // Save to Supabase if user is logged in
      if (currentUser) {
        try {
          await saveBotMessage(currentUser.id, currentInput, botResponse, isVoiceInput);
        } catch (error) {
          console.error('Error saving message:', error);
        }
      }
      
      // Speak the bot response automatically
      speakMessage(botResponse);
    }, 1500);
  };

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
    setTimeout(() => handleSendMessage(), 100);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 bg-emerald-600 hover:bg-emerald-700 shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
         <Badge className="absolute -top-2 -left-2 bg-emerald-500 text-white animate-pulse">
           🌱 EcoBot
         </Badge>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 h-96">
      <Card className="h-full flex flex-col shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Bot className="h-5 w-5 text-emerald-600" />
              EcoBot 🌱 Your Green Assistant
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              ×
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 px-4">
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.sender === "bot" && (
                    <Bot className="h-6 w-6 text-emerald-600 mt-1 flex-shrink-0" />
                  )}
                  <div
                    className={`max-w-[80%] p-3 rounded-lg text-sm ${
                      message.sender === "user"
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    {message.text}
                  </div>
                  {message.sender === "user" && (
                    <User className="h-6 w-6 text-gray-600 mt-1 flex-shrink-0" />
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-2 justify-start">
                  <Bot className="h-6 w-6 text-emerald-600 mt-1" />
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Quick Questions */}
          <div className="p-3 border-t">
            <div className="grid grid-cols-1 gap-2 mb-3">
              {quickQuestions.slice(0, 2).map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickQuestion(question)}
                  className="text-xs h-8 justify-start"
                >
                  {question.length > 40 ? `${question.substring(0, 40)}...` : question}
                </Button>
              ))}
            </div>
          </div>

          {/* Voice Controls */}
          {speechSupported && (
            <div className="px-3 pb-2 flex justify-center gap-2">
              <Button
                size="sm"
                variant={isListening ? "destructive" : "outline"}
                onClick={isListening ? stopListening : startListening}
                className="flex items-center gap-1"
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                {isListening ? "Stop" : "Speak"}
              </Button>
              <Button
                size="sm"
                variant={isSpeaking ? "destructive" : "outline"}
                onClick={toggleSpeech}
                className="flex items-center gap-1"
              >
                {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                {isSpeaking ? "Mute" : "Audio"}
              </Button>
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={isListening ? "🎙️ Listening..." : "Ask about eco products... 🌱"}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="text-sm"
                disabled={isListening}
              />
              <Button size="sm" onClick={handleSendMessage} className="bg-emerald-600 hover:bg-emerald-700">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EcoBot;