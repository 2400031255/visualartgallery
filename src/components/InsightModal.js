import React, { useState } from 'react';

const InsightModal = ({ artwork, existing, onSave, onCancel }) => {
  const [value, setValue] = useState(existing || '');

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="confirm-modal" onClick={e => e.stopPropagation()}>
        <p className="confirm-message" style={{ marginBottom: '0.25rem' }}>Curatorial Insight</p>
        <p style={{ fontSize: '0.78rem', color: 'var(--gold)', letterSpacing: '0.08em', marginBottom: '1.25rem' }}>
          {artwork.title} — {artwork.artist}
        </p>
        <textarea
          className="insight-textarea"
          rows={4}
          placeholder="Share your curatorial perspective..."
          value={value}
          onChange={e => setValue(e.target.value)}
          autoFocus
        />
        <div className="confirm-actions">
          <button className="btn-ghost" onClick={onCancel}>Cancel</button>
          <button className="btn" onClick={() => value.trim() && onSave(value.trim())} disabled={!value.trim()}>
            Save Insight
          </button>
        </div>
      </div>
    </div>
  );
};

export default InsightModal;
