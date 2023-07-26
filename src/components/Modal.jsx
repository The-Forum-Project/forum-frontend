import React from 'react';
import PropTypes from 'prop-types';

const modalStyle = {
  position: 'fixed',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: 1000,
};

const modalContentStyle = {
  backgroundColor: '#fff',
  borderRadius: '5px',
  maxWidth: '500px',
  minHeight: '300px',
  padding: '30px',
  position: 'relative',
};

const Modal = ({ onClose, children }) => {
  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node,
};

export default Modal;
