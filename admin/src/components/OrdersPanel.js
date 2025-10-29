import React from 'react';
import './OrdersPanel.css';

const OrdersPanel = ({ orders, onCompleteOrder }) => {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getOrderTotal = (items) => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <div className="orders-panel">
      <h2>Live Orders</h2>
      
      {orders.length === 0 ? (
        <div className="no-orders">
          <div className="no-orders-icon">📋</div>
          <p>No pending orders</p>
          <small>New orders will appear here automatically</small>
        </div>
      ) : (
        <div className="orders-grid">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <span className="order-id">Order #{order.id}</span>
                <span className="order-time">{formatTime(order.timestamp)}</span>
              </div>

              {/* 👇 Added: Customer Info Section */}
              <div className="order-customer">
                <p><strong>Name:</strong> {order.name || 'N/A'}</p>
                <p><strong>Phone:</strong> {order.phone || 'N/A'}</p>
                <p><strong>Table:</strong> {order.tableNo || 'N/A'}</p>
              </div>
              
              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <span className="item-name">{item.name}</span>
                    <span className="item-quantity">x{item.quantity}</span>
                    <span className="item-price">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="order-footer">
                <div className="order-total">
                  <strong>Total: ${getOrderTotal(order.items).toFixed(2)}</strong>
                </div>
                <button 
                  className="complete-btn"
                  onClick={() => onCompleteOrder(order.id)}
                >
                  Mark Complete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPanel;
