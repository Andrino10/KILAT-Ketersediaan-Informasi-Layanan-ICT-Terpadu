import React from 'react';

export default function EngineerButton({ onClick }) {
  return (
    <div className="engineer-btn-wrapper">
      <button
        className="engineer-btn"
        onClick={onClick}
        aria-label="Hubungi Engineer melalui WhatsApp"
        id="engineer-btn"
      >
        <span className="engineer-btn-icon">📲</span>
        Hubungi Engineer
      </button>
    </div>
  );
}
