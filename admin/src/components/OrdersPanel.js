import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './OrdersPanel.css';

const API_BASE = 'https://swadishta-server.onrender.com/api/orders'; // ✅ server endpoint

const OrdersPanel = () => {
  const [orders, setOrders] = useState([]);

  // ✅ Fetch orders from backend
  const fetchOrders = async () => {
    try {
      const res = await axios.get(API_BASE);
      setOrders(res.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      alert('⚠️ Failed to load orders. Check your server connection.');
    }
  };

  useEffect(() => {
    fetchOrders();

    // Optional: auto-refresh every 30s for live updates
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Mark order as complete
  const handleCompleteOrder = async (orderId) => {
    if (!window.confirm('Mark this order as completed?')) return;

    try {
      await axios.put(`${API_BASE}/${orderId}`, { status: 'completed' });
      alert('✅ Order marked as complete!');
      fetchOrders(); // refresh list
    } catch (err) {
      console.error('Error completing order:', err);
      alert('❌ Failed to mark order as complete.');
    }
  };

  const formatTime = (timestamp) => new Date(timestamp).toLocaleTimeString();

  const getOrderTotal = (items) =>
    items.reduce((total, item) => total + item.price * item.quantity, 0);

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
          {orders.map((order) => (
            <div
              key={order._id}
              className={`order-card ${
                order.status === 'completed' ? 'completed' : ''
              }`}
            >
              <div className="order-header">
                <span className="order-id">Order #{order._id}</span>
                <span className="order-time">{formatTime(order.timestamp)}</span>
              </div>

              <div className="order-customer">
                <p>
                  <strong>Name:</strong> {order.name || 'N/A'}
                </p>
                <p>
                  <strong>Phone:</strong> {order.phone || 'N/A'}
                </p>
                <p>
                  <strong>Table:</strong> {order.tableNo || 'N/A'}
                </p>
              </div>

              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <span className="item-name">{item.name}</span>
                    <span className="item-quantity">x{item.quantity}</span>
                    <span className="item-price">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <div className="order-total">
                  <strong>Total: ₹{getOrderTotal(order.items).toFixed(2)}</strong>
                </div>

                {order.status !== 'completed' ? (
                  <button
                    className="complete-btn"
                    onClick={() => handleCompleteOrder(order._id)}
                  >
                    Mark Complete
                  </button>
                ) : (
                  <span className="completed-label">✅ Completed</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPanel;
