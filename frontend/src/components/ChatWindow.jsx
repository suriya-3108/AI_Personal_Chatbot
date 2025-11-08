// ChatWindow.jsx - Enhanced chat experience
import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, User } from 'lucide-react';
import Message from './Message';
import VoiceButton from './VoiceButton';

const ChatWindow = ({ messages, onSendMessage, userName, chatbotName, theme, isLoading }) => {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [inputMessage]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      onSendMessage(inputMessage.trim());
      setInputMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className={`flex flex-col h-full min-h-0 transition-all duration-300 ${theme === 'dark' ? 'bg-[var(--chat-bg-dark)]' : 'bg-[var(--chat-bg-light)]'}`}>
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 pb-28 space-y-6 chat-container">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-80 space-y-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-800 dark:to-gray-600 flex items-center justify-center shadow-lg">
              <Bot className="h-12 w-12 text-gray-600 dark:text-gray-400" />
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Hello {userName || 'there'}! 👋
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-lg max-w-sm">
                I'm {chatbotName}, your AI assistant. How can I help you today?
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const role = (msg.role || msg.sender || msg.author || '').toString().toLowerCase();
            const isUserEffective = role === 'user' || role === 'you' || role === 'human' || role === 'customer' || role === 'client';
            return (
              <Message 
                key={idx} 
                message={msg} 
                isUser={isUserEffective} 
                userName={userName} 
                chatbotName={chatbotName} 
                theme={theme}
              />
            );
          })
        )}
        
        {/* Typing Indicator */}
        {isLoading && (
          <div className="flex items-center space-x-2 message-animation">
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <Bot className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </div>
            <div className="bg-[var(--bubble-ai-light)] dark:bg-[var(--bubble-ai-dark)] rounded-2xl px-4 py-3 shadow-sm">
              <div className="flex space-x-1">
                <div className="typing-dot w-2 h-2 bg-gray-400 rounded-full"></div>
                <div className="typing-dot w-2 h-2 bg-gray-400 rounded-full"></div>
                <div className="typing-dot w-2 h-2 bg-gray-400 rounded-full"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="chat-footer-fixed border-t border-gray-200 dark:border-gray-700 px-3 sm:px-6 py-3 pb-[env(safe-area-inset-bottom)] bg-white/70 dark:bg-black/40 backdrop-blur supports-[backdrop-filter]:backdrop-blur-md">
        <div className="chat-container">
        <form onSubmit={handleSubmit} className="chat-form w-full items-center" style={{alignItems:'center'}}>
          {/* Voice to the left */}
          <VoiceButton 
            onTranscript={setInputMessage} 
            disabled={isLoading}
            theme={theme}
            className="h-12 w-12 p-0 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 border border-black dark:border-gray-800 transition-colors shrink-0 flex items-center justify-center"
          />

          {/* Full width input */}
<div className="chat-input-wrap relative rounded-xl overflow-hidden bg-white dark:bg-gray-900">
<textarea
  ref={textareaRef}
  value={inputMessage}
  onChange={(e) => setInputMessage(e.target.value)}
  onKeyDown={handleKeyPress}
  placeholder={`Message ${chatbotName || 'AI Assistant'}...`}
  className="chat-input resize-none rounded-xl box-border h-12 px-4 py-2 border-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 transition-all duration-200 max-h-36"
  rows={1}
  style={{ margin: 0 }}
/>
</div>

          {/* Send to the right */}
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="h-12 w-12 p-0 rounded-xl bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 border border-black dark:border-gray-800 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm hover:shadow-md shrink-0 flex items-center justify-center"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </form>

        {/* Helper Text */}
        <div className="text-center mt-2">
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;