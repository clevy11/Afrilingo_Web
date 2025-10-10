
import { useState } from 'react';
import { MessageCircle, Send, X, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Muraho! Amakuru? Welcome to Afrilingo! I\'m here to help you learn Kinyarwanda and answer any questions about our platform. What would you like to know today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const predefinedResponses = {
    'hello': 'Muraho! That means "hello" in Kinyarwanda. Would you like to learn more greetings like "Amakuru?" (how are you?)',
    "hi": "Muraho! That means 'hello' in Kinyarwanda. Would you like to learn more greetings like 'Amakuru?' (how are you?)",
    'help': 'I can help you with pronunciation, translations, cultural context, and practice conversations in Kinyarwanda. What interests you most?',
    'kinyarwanda': 'Kinyarwanda is the official language of Rwanda spoken by over 12 million people. Let\'s start with basics: Muraho (Hello), Murakoze (Thank you), Murakaza neza (Welcome).',
    'swahili': 'Swahili is a beautiful language spoken by over 100 million people. Here are some basics: Jambo (Hello), Asante (Thank you), Karibu (Welcome).',
    'yoruba': 'Yoruba is spoken by over 20 million people. Here are some basics: Bawo (Hello), E se (Thank you), E ku aaro (Good morning).',
    'translate': 'I can help translate phrases between Kinyarwanda and English! but for this feature you need to download the app for that to use that feature.',
    'default': 'Ni byiza! That\'s interesting! Let me help you explore Kinyarwanda. Would you like to learn greetings, practice pronunciation, or learn about Rwandan culture?',
    "what is your name": "I am Afrilingo Assistant, here to help you learn Kinyarwanda and explore our platform!",
    "okay": "Great! How can I assist you further with Kinyarwanda or our platform?",
    "thanks": "Murakoze! You're welcome! Feel free to ask me anything about Kinyarwanda or Afrilingo.",
    "thank you": "Murakoze! You're welcome! Feel free to ask me anything about Kinyarwanda or Afrilingo.",
    "bye": "Murabeho! Goodbye! It was great chatting with you. Come back anytime to learn more Kinyarwanda!",
    "goodbye": "Murabeho! Goodbye! It was great chatting with you. Come back anytime to learn more Kinyarwanda!",
    "country": "Rwanda is a beautiful country in East Africa known as the 'Land of a Thousand Hills'. It has a rich culture and history, and Kinyarwanda is spoken by nearly everyone there.",
    "kinyarwanda culture": "Rwandan culture is vibrant and community-oriented. Traditional music, dance, and storytelling are important aspects. Learning Kinyarwanda helps you connect deeply with the culture.",
    "learn kinyarwanda": "To learn Kinyarwanda, start with basic greetings and common phrases. Practice pronunciation and try to use the language in daily conversations. I can help you with lessons and practice!",
    "what u can do": "I can assist you with learning Kinyarwanda, provide translations, help with pronunciation, and answer questions about Rwandan culture and our Afrilingo platform. How can I assist you today?",
    "download app": "You can download the Afrilingo app this website on clicking download button on the top right corner of the page.",
    "how to use app": "Once you download the Afrilingo app, you can create an account or log in if you already have one. Explore our interactive lessons, vocabulary, and practice conversations to start learning Kinyarwanda!",
    "pricing": "Afrilingo for now is completely free to use. We believe in making language learning accessible to everyone. Enjoy learning Kinyarwanda with us!",
    "features": "Afrilingo offers interactive Kinyarwanda lessons, vocabulary building, pronunciation practice, and cultural insights to help you learn effectively and ai assistancy. Explore our platform to see all the features we offer!",
    "objectives": "Our main objectives at Afrilingo are to make Kinyarwanda accessible to foreigners in Rwanda, promote cultural integration, and provide an engaging and effective language learning experience.",
    "mission": "Our mission at Afrilingo is to empower foreigners in Rwanda to learn Kinyarwanda and integrate seamlessly into Rwandan culture through accessible and engaging language learning resources.",
    "vision": "Our vision at Afrilingo is to be the leading platform for learning Kinyarwanda, fostering cross-cultural understanding and helping foreigners in Rwanda connect deeply with the local community.",
    "team": "Our team at Afrilingo is passionate about language learning and cultural exchange. We are dedicated to providing the best resources and support to help you learn Kinyarwanda effectively.",
    "support": "If you need support with Afrilingo, feel free to reach out to our support team via the contact form on our website. We're here to help you with any questions or issues you may have!",
    "partnership": "We are open to partnerships that align with our mission of making Kinyarwanda accessible to foreigners in Rwanda. Please contact us via the partnership form on our website to discuss potential collaborations.",
    "based": "Afrilingo is based in Rwanda, East Africa. We are dedicated to helping foreigners in Rwanda learn Kinyarwanda and integrate into the local culture.",
    "languages": "Afrilingo currently focuses on teaching Kinyarwanda, the official language of Rwanda. We aim to make Kinyarwanda accessible to foreigners living in Rwanda through our interactive platform and we are trying to add more languages like Swahili and Yoruba in future.",
    "motivation": "Our motivation at Afrilingo is to bridge the language gap for foreigners in Rwanda, helping them learn Kinyarwanda and connect deeply with the local culture. We believe language is key to meaningful integration and community building.",
  };

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate bot response
    setTimeout(() => {
      const lowerInput = inputMessage.toLowerCase();
      let response = predefinedResponses.default;
      
      for (const [key, value] of Object.entries(predefinedResponses)) {
        if (lowerInput.includes(key)) {
          response = value;
          break;
        }
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    }, 1000);

    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-amber-800 hover:bg-amber-900 shadow-lg z-50"
        size="icon"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-80 h-96 shadow-2xl z-40 border-2 border-border bg-card">
          <CardHeader className="bg-primary text-primary-foreground rounded-t-lg p-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bot className="h-5 w-5" />
              Afrilingo Assistant
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-0 flex flex-col h-full">
            <ScrollArea className="flex-1 p-4 max-h-64">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.sender === 'bot' && (
                      <div className="w-8 h-8 bg-card/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-amber-800" />
                      </div>
                    )}
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-card/80 text-foreground'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                    </div>
                    {message.sender === 'user' && (
                      <div className="w-8 h-8 bg-amber-300 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-amber-800" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="p-4 border-t border-border bg-card rounded-b-lg">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about Kinyarwanda..."
                  className="flex-1 border-amber-300 focus:border-amber-500"
                />
                <Button
                  onClick={sendMessage}
                  size="icon"
                  className="bg-amber-800 hover:bg-amber-900 flex-shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ChatBot;
