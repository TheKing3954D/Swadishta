import React from 'react';
import './OrderSummary.css';

const OrderSummary = ({ onClose }) => {
  return (
    <div className="order-summary-overlay">
      <div className="order-summary-modal">
        <div className="success-icon">
          <div className="checkmark">✓</div>
        </div>
        
        <h2>Order Sent Successfully!</h2>
        <p>Your order has been sent to the kitchen. Please wait for confirmation from the staff.</p>
        
        <div className="order-info">
          <p>🕐 Estimated preparation time: 15-20 minutes</p>
          <p>📍 Please stay nearby for order updates</p>
        </div>
        
        <button className="close-summary-btn" onClick={onClose}>
          Continue Browsing
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;