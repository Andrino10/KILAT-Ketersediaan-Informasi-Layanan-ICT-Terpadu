import React, { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage.jsx';
import EngineerButton from './EngineerButton.jsx';

export default function ChatWindow({ messages, isLoading, showEngineerBtn, onEngineerContact }) {
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  return (
    <div className="chat-area" id="chat-window">
      {messages.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🤖</div>
          <h2 className="empty-state-title">Selamat Datang</h2>
          <p className="empty-state-desc">
            AI Helpdesk ICT siap membantu Anda menyelesaikan permasalahan ICT.
          </p>
        </div>
      ) : (
        <>
          {messages.map((msg, index) => (
            <ChatMessage
              key={index}
              role={msg.role}
              content={msg.content}
              time={msg.time}
            />
          ))}

          {isLoading && (
            <div className="typing-indicator">
              <div className="message-avatar ai">AI</div>
              <div className="typing-bubble">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          )}

          {showEngineerBtn && (
            <EngineerButton onClick={onEngineerContact} />
          )}
        </>
      )}

      <div ref={chatEndRef} />
    </div>
  );
}
