import React from 'react'

const ModalUserInfo = ({ children, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
    <div className="modal" onClick={e => e.stopPropagation()}>
      <button className="close-button" onClick={onClose}>
        &times;
      </button>
      {children}
    </div>
  </div>
  )
}

export default ModalUserInfo