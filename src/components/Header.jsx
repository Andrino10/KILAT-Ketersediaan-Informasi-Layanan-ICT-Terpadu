import React from 'react';

export default function Header({ division, onNewChat }) {
  return (
    <header className="header" id="app-header">
      <div className="header-logo-container" id="logo-container" aria-label="Pertamina EP Logo">
        <img src="/logo-pertamina-ep.svg" alt="Pertamina EP Logo" className="pertamina-logo-img" />
      </div>

      <div className="header-info">
        <h1 className="header-title">
          AI Helpdesk ICT
          {division && (
            <span className="division-badge">
              {division.icon} {division.name}
            </span>
          )}
        </h1>
        <p className="header-subtitle">Pertamina EP Asset 1 Regional 1 Field Lirik</p>
      </div>

      <div className="header-status" id="status-indicator">
        <span className="status-dot" />
        Online
      </div>

      <button
        className="header-new-chat"
        onClick={onNewChat}
        title="Percakapan Baru"
        aria-label="Mulai percakapan baru"
        id="new-chat-btn"
      >
        ✚
      </button>
    </header>
  );
}
