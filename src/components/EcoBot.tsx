import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, Bot, User } from "lucide-react";

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
      text: "Hi! I'm EcoBot, your sustainable shopping assistant! 🌱 Ask me about eco-friendly products, green alternatives, or sustainability tips!",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const quickQuestions = [
    "What are eco-friendly alternatives to plastic bags?",
    "How can I reduce my carbon footprint while shopping?",
    "What's the difference between organic and conventional products?",
    "Show me local and sustainable food options",
    "How do I scan products with EcoSwap?",
    "What voice commands can I use?",
  ];

  const botResponses: { [key: string]: string } = {
    "plastic": "Great question! 🛍️ Here are eco-friendly alternatives to plastic bags: reusable canvas bags, jute bags, bamboo fiber bags, and recycled material totes. These can reduce plastic waste by up to 1000 bags per year per person!",
    "carbon": "🌍 To reduce your carbon footprint: choose local products (reduces transport emissions), buy seasonal produce, opt for minimal packaging, choose organic when possible, and use our EcoSwap suggestions for lower-carbon alternatives!",
    "organic": "🌱 Organic products are grown without synthetic pesticides, fertilizers, or GMOs. They're better for soil health and biodiversity. Conventional products may have residues but are more affordable. Our eco-score considers both environmental impact and accessibility!",
    "local": "🏪 Local and sustainable options: farmer's markets, local co-ops, community-supported agriculture (CSA), and products with 'locally sourced' labels. Look for items with less than 100 miles of transport - they're fresher and have lower emissions!",
    "scan": "📱 To scan products: 1) Point your camera at any barcode, 2) Wait for the green scan indicator, 3) View instant eco-alternatives and impact data. You can also use voice commands like 'Hey EcoBot, scan this product' while scanning!",
    "voice": "🎙️ Voice commands you can use: 'Compare products', 'Show alternatives', 'What's my eco score?', 'Find recycling options', or just ask me anything about sustainable shopping. Just tap and hold the chat button to speak!",
    "hello": "Hello! 👋 I'm here to help you make eco-friendly shopping choices. What would you like to know about sustainable products?",
    "help": "I can help you with: 🌿 Finding eco-friendly alternatives, 📊 Understanding product eco-scores, 🛒 Sustainable shopping tips, ♻️ Recycling guidance, and 💚 Maximizing your environmental impact!",
    "default": "That's an interesting question! 🤔 While I focus on eco-friendly shopping, I'd recommend checking our product comparison tool or browsing eco-certified products. You can also earn points by making sustainable swaps! Is there anything specific about green products you'd like to know?",
  };

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes("plastic") || message.includes("bag")) return botResponses.plastic;
    if (message.includes("carbon") || message.includes("footprint")) return botResponses.carbon;
    if (message.includes("organic") || message.includes("conventional")) return botResponses.organic;
    if (message.includes("local") || message.includes("sustainable food")) return botResponses.local;
    if (message.includes("scan") || message.includes("barcode") || message.includes("camera")) return botResponses.scan;
    if (message.includes("voice") || message.includes("speak") || message.includes("command")) return botResponses.voice;
    if (message.includes("hello") || message.includes("hi")) return botResponses.hello;
    if (message.includes("help")) return botResponses.help;
    
    return botResponses.default;
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
    setInputMessage("");
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputMessage),
        sender: "bot",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
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
        <Badge className="absolute -top-2 -left-2 bg-red-500 text-white">
          EcoBot
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
              EcoBot Assistant
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

          {/* Input */}
          <div className="p-3 border-t">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about eco products..."
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="text-sm"
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