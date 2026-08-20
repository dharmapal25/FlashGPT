import React from 'react';
import '../style/DeletePopUp.css';

const DeletePopUp = ({ isOpen = true, onClose, onConfirm, itemName = 'this item' }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      {/* stopPropagation ensures clicking the card doesn't trigger onClose */}
      <div className="popup-card" onClick={(e) => e.stopPropagation()}>

        <h3 className="popup-title">Delete Confirmation</h3>
        <p className="popup-message">
          Are you sure you want to delete <strong>{itemName}</strong>? This action cannot be undone.
        </p>

        <div className="popup-actions">
          <button className="btn btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-delete" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePopUp;