'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, X, Send, Phone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: t('chatbot.greeting')
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const quickReplies = [
    t('chatbot.letter_guide'),
    t('chatbot.social_aid_info'),
    t('chatbot.service_schedule'),
    t('chatbot.village_contact')
  ];

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    setMessages([...messages, { type: 'user', content: inputMessage }]);
    
    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: 'bot',
        content: t('chatbot.response')
      }]);
    }, 1000);

    setInputMessage('');
  };

  const handleQuickReply = (reply: string) => {
    setInputMessage(reply);
    handleSendMessage();
  };

  return (
    <>
      {/* Chat Widget Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <Image
             src="https://uwlwfjsdteygsvswsbsd.supabase.co/storage/v1/object/sign/material/Chatbot%20Desa%20Cilame%20-%20JD.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wOTU3OGQ5MS1jOTNkLTQyYTItYmFjMy1kMjM1ZTUyY2VhNmMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYXRlcmlhbC9DaGF0Ym90IERlc2EgQ2lsYW1lIC0gSkQucG5nIiwiaWF0IjoxNzU1MDQ5MDQ0LCJleHAiOjE3ODY1ODUwNDR9.I4-iSS4QFqn7CxBpieRcIUTy1KrhoDXxV332hquHZeY"
             alt="Chatbot Desa Cilame"
             width={100}
             height={100}
             className="object-contain cursor-pointer hover:scale-105 transition-transform"
             onClick={() => setIsOpen(true)}
           />
        )}
        
        {/* Chat Window */}
        {isOpen && (
          <Card className="w-80 md:w-96 shadow-xl">
            <CardHeader className="bg-green-600 text-white rounded-t-lg">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div>
                    <CardTitle className="text-lg">{t('chatbot.title')}</CardTitle>
                    <p className="text-green-100 text-sm">{t('chatbot.status')}</p>
                  </div>
                  <Image
                     src="https://uwlwfjsdteygsvswsbsd.supabase.co/storage/v1/object/sign/material/Chatbot%20Desa%20Cilame%20-%20JD.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wOTU3OGQ5MS1jOTNkLTQyYTItYmFjMy1kMjM1ZTUyY2VhNmMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYXRlcmlhbC9DaGF0Ym90IERlc2EgQ2lsYW1lIC0gSkQucG5nIiwiaWF0IjoxNzU1MDQ5ODEzLCJleHAiOjE3ODY1ODU4MTN9.TBTyKo3pqGdPewrgerR-gmv4uuec-iXgKQ4Uxp4UCG4"
                     alt="Chatbot Desa Cilame"
                     width={63}
                     height={63}
                     className="object-contain"
                   />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-green-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              {/* Messages */}
              <div className="h-80 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                        message.type === 'user'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Quick Replies */}
              <div className="p-4 border-t bg-gray-50">
                <p className="text-sm text-gray-600 mb-2">{t('chatbot.quick_questions')}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {quickReplies.map((reply, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickReply(reply)}
                      className="text-xs"
                    >
                      {reply}
                    </Button>
                  ))}
                </div>
                
                {/* WhatsApp Button */}
                <Button
                  className="w-full bg-green-500 hover:bg-green-600 text-white mb-3"
                  onClick={() => window.open('https://wa.me/6281234567890', '_blank')}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  {t('chatbot.whatsapp')}
                </Button>
                
                {/* Message Input */}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={t('chatbot.type_message')}
                    className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <Button size="sm" onClick={handleSendMessage} className="bg-green-600 hover:bg-green-700">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}