
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
    'help': 'I can help you with pronunciation, translations, cultural context, and practice conversations in Kinyarwanda. What interests you most?',
    'kinyarwanda': 'Kinyarwanda is the official language of Rwanda spoken by over 12 million people. Let\'s start with basics: Muraho (Hello), Murakoze (Thank you), Murakaza neza (Welcome).',
    'swahili': 'Swahili is a beautiful language spoken by over 100 million people. Here are some basics: Jambo (Hello), Asante (Thank you), Karibu (Welcome).',
    'yoruba': 'Yoruba is spoken by over 20 million people. Here are some basics: Bawo (Hello), E se (Thank you), E ku aaro (Good morning).',
    'translate': 'I can help translate phrases between Kinyarwanda and English! Just tell me what you\'d like to translate.',
    'default': 'Ni byiza! That\'s interesting! Let me help you explore Kinyarwanda. Would you like to learn greetings, practice pronunciation, or learn about Rwandan culture?'
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
        <Card className="fixed bottom-24 right-6 w-80 h-96 shadow-2xl z-40 border-2 border-amber-200">
          <CardHeader className="bg-amber-800 text-amber-50 rounded-t-lg p-4">
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
                      <div className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-amber-800" />
                      </div>
                    )}
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-amber-800 text-amber-50'
                          : 'bg-amber-100 text-amber-900'
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
            
            <div className="p-4 border-t border-amber-200 bg-white rounded-b-lg">
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
