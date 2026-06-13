const DeleteModal = ({ onConfirm, onCancel }) => (
  <div className="modalOverlay" onClick={onCancel}>
    <div className="modal" onClick={e => e.stopPropagation()}>
      <h3>Delete this chat?</h3>
      <p>This is permanent and cannot be undone.</p>
      <div className="modalActions">
        <button className="cancelBtn"  onClick={onCancel}>Cancel</button>
        <button className="confirmBtn" onClick={onConfirm}>Delete</button>
      </div>
    </div>
  </div>
);

export default DeleteModal;