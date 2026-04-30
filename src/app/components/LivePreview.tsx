import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Eye, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import type { ChatConfig } from './CodeGenerator';

interface LivePreviewProps {
  config: ChatConfig;
}

interface Message {
  id: number;
  username: string;
  text: string;
  timestamp: string;
  reactions: Record<string, number>;
}

export const LivePreview = ({ config }: LivePreviewProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      username: 'alice_wonder',
      text: 'Hey everyone! Welcome to the chat! 👋',
      timestamp: new Date().toISOString(),
      reactions: { '❤️': 3, '🔥': 1 },
    },
    {
      id: 2,
      username: 'admin',
      text: 'Thanks for joining! Feel free to chat and test the features.',
      timestamp: new Date().toISOString(),
      reactions: {},
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const filterMessage = (text: string): string => {
    if (!config.moderation.enableProfanityFilter) return text;

    let filtered = text;
    config.moderation.bannedWords.forEach((word) => {
      const regex = new RegExp(word, 'gi');
      filtered = filtered.replace(regex, '*'.repeat(word.length));
    });
    return filtered;
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    if (inputValue.length > config.moderation.maxMessageLength) {
      alert(`Message too long! Max ${config.moderation.maxMessageLength} characters.`);
      return;
    }

    const username = 'user' + Math.floor(Math.random() * 1000);
    const filteredMessage = filterMessage(inputValue);

    const newMessage: Message = {
      id: Date.now(),
      username,
      text: filteredMessage,
      timestamp: new Date().toISOString(),
      reactions: {},
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');
  };

  const addReaction = (messageId: number, emoji: string) => {
    if (!config.emojiGif.enableEmojiReactions) return;

    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const reactions = { ...msg.reactions };
          reactions[emoji] = (reactions[emoji] || 0) + 1;
          return { ...msg, reactions };
        }
        return msg;
      })
    );
  };

  const getUsernameStyle = (username: string) => {
    const customFont = config.fonts.customUserFonts.find((cf) => cf.username === username);

    if (customFont) {
      return {
        fontFamily: customFont.font,
        fontSize: `${config.fonts.usernameFontSize}px`,
        color: customFont.color,
      };
    }

    return {
      fontFamily: config.fonts.usernameFont,
      fontSize: `${config.fonts.usernameFontSize}px`,
      color: config.fonts.usernameColor,
    };
  };

  const getMessageStyle = () => {
    return {
      fontFamily: config.fonts.globalFont,
      fontSize: `${config.fonts.globalFontSize}px`,
      color: config.fonts.messageColor,
    };
  };

  const resetDemo = () => {
    setMessages([
      {
        id: 1,
        username: 'alice_wonder',
        text: 'Hey everyone! Welcome to the chat! 👋',
        timestamp: new Date().toISOString(),
        reactions: { '❤️': 3, '🔥': 1 },
      },
      {
        id: 2,
        username: 'admin',
        text: 'Thanks for joining! Feel free to chat and test the features.',
        timestamp: new Date().toISOString(),
        reactions: {},
      },
    ]);
    setInputValue('');
  };

  return (
    <Card className="size-auto flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="size-5 text-primary" />
            <div>
              <CardTitle>Live Preview</CardTitle>
              <CardDescription className="text-xs mt-1">
                Interactive module preview with your settings
              </CardDescription>
            </div>
          </div>
          <Button size="sm" variant="outline" onClick={resetDemo}>
            <RefreshCw className="size-4 mr-2" />
            Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent className="size-auto flex-1 flex flex-col">
        <div className="chat-widget-preview h-full max-w-full flex flex-col border rounded-xl overflow-hidden shadow-lg bg-white">
          {/* Header */}
          <div className="chat-header p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <h3 className="text-lg font-semibold m-0">{config.room.roomName}</h3>
            <p className="text-sm opacity-90 mt-1 mb-2">{config.room.roomDescription}</p>
            <div className="flex gap-2 flex-wrap">
              {config.room.isPrivate && (
                <span className="text-xs bg-white/20 px-2 py-1 rounded">🔒 Private</span>
              )}
              {config.moderation.enableIPLogging && (
                <span className="text-xs bg-white/20 px-2 py-1 rounded">📊 IP Logging Active</span>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50" style={{ minHeight: 0 }}>
            {messages.map((message) => (
              <div key={message.id} className="flex gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                  {message.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div style={getUsernameStyle(message.username)} className="font-semibold mb-1">
                    {message.username}
                  </div>
                  <div style={getMessageStyle()} className="break-words">
                    {message.text}
                    {config.emojiGif.enableEmojis && ' 💬'}
                  </div>
                  {config.translation.enableClickToTranslate && (
                    <button className="text-xs text-purple-600 hover:underline mt-1">
                      Translate to {config.translation.defaultLanguage}
                    </button>
                  )}
                  {config.emojiGif.enableEmojiReactions && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {Object.entries(message.reactions).map(([emoji, count]) => (
                        <span
                          key={emoji}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-gray-200 rounded-full text-xs"
                        >
                          {emoji} {count}
                        </span>
                      ))}
                      <button
                        onClick={() => addReaction(message.id, '❤️')}
                        className="px-2 py-1 bg-white border border-gray-200 rounded-full text-xs hover:bg-gray-50 text-gray-600"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Slow Mode Notice */}
          {config.room.slowMode > 0 && (
            <div className="py-2 px-4 bg-yellow-50 border-t border-b border-yellow-200 text-center text-xs text-yellow-800">
              Slow mode: {config.room.slowMode}s between messages
            </div>
          )}

          {/* Input */}
          <div className="p-4 bg-white border-t flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              maxLength={config.moderation.maxMessageLength}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              onClick={handleSendMessage}
              className="px-5 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm font-medium hover:opacity-90 active:scale-95 transition-all"
            >
              Send
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
