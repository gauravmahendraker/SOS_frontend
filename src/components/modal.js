import React from "react";
import "./modal.css";

const Modal = ({ message, onClose }) => {
    return (
        <div className="custom-modal-overlay">
            <div className="custom-modal-content">
                <p>{message}</p>
                <button className="custom-modal-close-btn" onClick={onClose}>
                    Got it
                </button>
            </div>
        </div>
    );
};

export default Modal;
