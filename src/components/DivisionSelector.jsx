import React from 'react';

export default function DivisionSelector({ divisions, onSelect, onClose }) {
  return (
    <div className="division-overlay" onClick={onClose} id="division-overlay">
      <div
        className="division-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Pilih Divisi Layanan"
      >
        <h2 className="division-modal-title">Pilih Divisi Layanan</h2>
        <p className="division-modal-subtitle">
          Pilih salah satu divisi ICT untuk memulai percakapan
        </p>

        <div className="division-grid" id="division-grid">
          {divisions.map((div) => (
            <button
              key={div.id}
              className="division-card"
              onClick={() => onSelect(div)}
              aria-label={`Pilih divisi ${div.name}`}
              id={`division-${div.id}`}
            >
              <span className="division-icon">{div.icon}</span>
              <div>
                <div className="division-name">{div.name}</div>
                <div className="division-desc">{div.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
