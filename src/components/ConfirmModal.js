import React from 'react';

const ConfirmModal = ({ message, onConfirm, onCancel }) => (
  <div className="modal-backdrop" onClick={onCancel}>
    <div className="confirm-modal" onClick={e => e.stopPropagation()}>
      <p className="confirm-message">{message}</p>
      <div className="confirm-actions">
        <button className="btn-ghost" onClick={onCancel}>Cancel</button>
        <button className="btn btn-danger-solid" onClick={onConfirm}>Confirm</button>
      </div>
    </div>
  </div>
);

export default ConfirmModal;
