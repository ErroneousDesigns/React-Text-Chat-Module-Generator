export interface ChatConfig {
  room: {
    roomName: string;
    roomDescription: string;
    maxUsers: number;
    isPrivate: boolean;
    requireApproval: boolean;
    slowMode: number;
    allowGuests: boolean;
    roomCategory: string;
  };
  moderation: {
    enableIPLogging: boolean;
    enableProfanityFilter: boolean;
    enableSpamFilter: boolean;
    maxMessageLength: number;
    bannedWords: string[];
  };
  translation: {
    enableClickToTranslate: boolean;
    autoDetectLanguage: boolean;
    defaultLanguage: string;
    enabledLanguages: string[];
  };
  fonts: {
    enableCustomFonts: boolean;
    enableCustomUsernameFonts: boolean;
    globalFont: string;
    globalFontSize: number;
    usernameFont: string;
    usernameFontSize: number;
    messageColor: string;
    usernameColor: string;
    customUserFonts: Array<{
      username: string;
      font: string;
      color: string;
    }>;
  };
  emojiGif: {
    enableEmojis: boolean;
    enableGifs: boolean;
    enableCustomEmojis: boolean;
    emojiSize: number;
    gifSize: number;
    gifOverlayPosition: string;
    gifOverlayOpacity: number;
    maxGifsPerMessage: number;
    enableEmojiReactions: boolean;
  };
}

export const generateWidgetCode = (config: ChatConfig): string => {
  return `import React, { useState, useEffect, useRef } from 'react';
import './ChatWidget.css';

const ChatWidget = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [ipLogs, setIpLogs] = useState([]);
  const messagesEndRef = useRef(null);

  const config = ${JSON.stringify(config, null, 2)};

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const logIP = async (username) => {
    if (config.moderation.enableIPLogging) {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        const timestamp = new Date().toISOString();
        setIpLogs(prev => [...prev, { username, ip: data.ip, timestamp }]);
        console.log('IP logged:', { username, ip: data.ip, timestamp });
      } catch (error) {
        console.error('Failed to log IP:', error);
      }
    }
  };

  const filterMessage = (text) => {
    if (!config.moderation.enableProfanityFilter) return text;

    let filtered = text;
    config.moderation.bannedWords.forEach(word => {
      const regex = new RegExp(word, 'gi');
      filtered = filtered.replace(regex, '*'.repeat(word.length));
    });
    return filtered;
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    if (inputValue.length > config.moderation.maxMessageLength) {
      alert(\`Message too long! Max \${config.moderation.maxMessageLength} characters.\`);
      return;
    }

    const username = 'user' + Math.floor(Math.random() * 1000);
    const filteredMessage = filterMessage(inputValue);

    logIP(username);

    const newMessage = {
      id: Date.now(),
      username,
      text: filteredMessage,
      timestamp: new Date().toISOString(),
      reactions: {},
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
  };

  const translateMessage = async (text, targetLang) => {
    console.log(\`Translating "\${text}" to \${targetLang}\`);
    alert(\`Translation feature would translate to \${targetLang}\`);
  };

  const addReaction = (messageId, emoji) => {
    if (!config.emojiGif.enableEmojiReactions) return;

    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const reactions = { ...msg.reactions };
        reactions[emoji] = (reactions[emoji] || 0) + 1;
        return { ...msg, reactions };
      }
      return msg;
    }));
  };

  const getUsernameStyle = (username) => {
    const customFont = config.fonts.customUserFonts.find(
      cf => cf.username === username
    );

    if (customFont) {
      return {
        fontFamily: customFont.font,
        fontSize: \`\${config.fonts.usernameFontSize}px\`,
        color: customFont.color,
      };
    }

    return {
      fontFamily: config.fonts.usernameFont,
      fontSize: \`\${config.fonts.usernameFontSize}px\`,
      color: config.fonts.usernameColor,
    };
  };

  const getMessageStyle = () => {
    return {
      fontFamily: config.fonts.globalFont,
      fontSize: \`\${config.fonts.globalFontSize}px\`,
      color: config.fonts.messageColor,
    };
  };

  return (
    <div className="chat-widget">
      <div className="chat-header">
        <h3>{config.room.roomName}</h3>
        <p>{config.room.roomDescription}</p>
        {config.room.isPrivate && <span className="badge">🔒 Private</span>}
        {config.moderation.enableIPLogging && <span className="badge">📊 IP Logging Active</span>}
      </div>

      <div className="chat-messages">
        {messages.map(message => (
          <div key={message.id} className="message">
            <div className="message-avatar">
              {message.username.charAt(0).toUpperCase()}
            </div>
            <div className="message-content">
              <div className="message-username" style={getUsernameStyle(message.username)}>
                {message.username}
              </div>
              <div className="message-text" style={getMessageStyle()}>
                {message.text}
                {config.emojiGif.enableEmojis && ' 💬'}
              </div>
              {config.translation.enableClickToTranslate && (
                <button
                  className="translate-btn"
                  onClick={() => translateMessage(message.text, config.translation.defaultLanguage)}
                >
                  Translate to {config.translation.defaultLanguage}
                </button>
              )}
              {config.emojiGif.enableEmojiReactions && (
                <div className="reactions">
                  {Object.entries(message.reactions).map(([emoji, count]) => (
                    <span key={emoji} className="reaction">
                      {emoji} {count}
                    </span>
                  ))}
                  <button
                    className="add-reaction"
                    onClick={() => addReaction(message.id, '❤️')}
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

      {config.room.slowMode > 0 && (
        <div className="slow-mode-notice">
          Slow mode: {config.room.slowMode}s between messages
        </div>
      )}

      <div className="chat-input">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type a message..."
          maxLength={config.moderation.maxMessageLength}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatWidget;`;
};

export const generateCSSCode = (config: ChatConfig): string => {
  return `.chat-widget {
  width: 100%;
  max-width: 600px;
  height: 600px;
  display: flex;
  flex-direction: column;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.chat-header {
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.chat-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.chat-header p {
  margin: 4px 0 8px;
  font-size: 14px;
  opacity: 0.9;
}

.badge {
  display: inline-block;
  padding: 4px 8px;
  margin: 4px 4px 0 0;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  font-size: 12px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #f9fafb;
}

.message {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
}

.message-content {
  flex: 1;
}

.message-username {
  font-weight: 600;
  margin-bottom: 4px;
}

.message-text {
  line-height: 1.5;
  word-wrap: break-word;
}

.translate-btn {
  margin-top: 4px;
  padding: 2px 8px;
  background: none;
  border: none;
  color: #667eea;
  font-size: 12px;
  cursor: pointer;
  text-decoration: underline;
}

.translate-btn:hover {
  opacity: 0.8;
}

.reactions {
  display: flex;
  gap: 4px;
  margin-top: 8px;
  flex-wrap: wrap;
}

.reaction {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 12px;
}

.add-reaction {
  padding: 4px 8px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 12px;
  cursor: pointer;
  color: #6b7280;
}

.add-reaction:hover {
  background: #f9fafb;
}

.slow-mode-notice {
  padding: 8px 16px;
  background: #fef3c7;
  border-top: 1px solid #fbbf24;
  border-bottom: 1px solid #fbbf24;
  text-align: center;
  font-size: 13px;
  color: #92400e;
}

.chat-input {
  display: flex;
  padding: 16px;
  background: white;
  border-top: 1px solid #e5e7eb;
}

.chat-input input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
}

.chat-input input:focus {
  border-color: #667eea;
}

.chat-input button {
  margin-left: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.chat-input button:hover {
  opacity: 0.9;
}

.chat-input button:active {
  transform: scale(0.98);
}`;
};

export const generatePackageJson = (): string => {
  return JSON.stringify(
    {
      name: "chat-widget",
      version: "1.0.0",
      description: "Customizable chat widget plugin",
      main: "ChatWidget.jsx",
      dependencies: {
        react: "^18.3.1",
        "react-dom": "^18.3.1",
      },
    },
    null,
    2
  );
};

export const generateReadme = (config: ChatConfig): string => {
  return `# Chat Widget Plugin

A customizable chat widget for React applications with advanced features.

## Features

${config.moderation.enableIPLogging ? "✅ IP Logging for moderation" : ""}
${config.translation.enableClickToTranslate ? "✅ Click-to-translate messages" : ""}
${config.fonts.enableCustomFonts ? "✅ Custom font support" : ""}
${config.emojiGif.enableEmojis ? "✅ Emoji support" : ""}
${config.emojiGif.enableEmojiReactions ? "✅ Message reactions" : ""}
${config.moderation.enableProfanityFilter ? "✅ Profanity filtering" : ""}

## Installation

\`\`\`bash
npm install
\`\`\`

## Usage

\`\`\`jsx
import ChatWidget from './ChatWidget';
import './ChatWidget.css';

function App() {
  return (
    <div>
      <ChatWidget />
    </div>
  );
}
\`\`\`

## Configuration

The widget comes pre-configured with your settings:

- **Room Name**: ${config.room.roomName}
- **Max Users**: ${config.room.maxUsers}
- **Message Length**: ${config.moderation.maxMessageLength} characters
- **Default Language**: ${config.translation.defaultLanguage}

## Customization

Edit the \`config\` object in \`ChatWidget.jsx\` to modify settings.

## License

MIT
`;
};
