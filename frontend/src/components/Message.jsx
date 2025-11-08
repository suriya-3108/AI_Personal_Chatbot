import React, { useState } from 'react';
import { User, Bot } from 'lucide-react';

const Message = ({ message, isUser, userName, chatbotName }) => {
  return (
    <div
      className="message-animation mb-3" // Added margin-bottom for spacing between messages
      style={{ display: 'flex', width: '100%', justifyContent: isUser ? 'flex-end' : 'flex-start' }}
    >
      <div
        className="gap-2"
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          flexDirection: isUser ? 'row-reverse' : 'row',
          maxWidth: '75%',
        }}
      >
{/* Avatar */}
<div
  className={`w-9 h-9 min-w-[2.25rem] min-h-[2.25rem] rounded-full flex items-center justify-center
    ${isUser
      ? 'bg-black text-white dark:bg-white dark:text-black'
      : 'bg-gray-300 text-black dark:bg-white dark:text-black'
    }`}
  style={{ flex: 'none' }}
>
  {isUser
    ? <User size={18} />
    : <Bot size={18} color="black" className="dark:text-black" />
  }
</div>

        {/* Bubble */}
        <div
          className={`relative px-4 py-3 rounded-2xl border ${
            isUser
              ? 'message-user text-white border-transparent'
              : 'message-assistant text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700'
          }`}
          style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}
        >
          <div className="leading-relaxed">{message.content}</div>
        </div>
      </div>
    </div>
  );
};

export default Message;