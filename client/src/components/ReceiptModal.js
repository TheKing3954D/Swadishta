import React from "react";
import "./ReceiptModal.css";
import logo from "../assets/Logo.jpg";

const ReceiptModal = ({ order, onClose }) => {
  if (!order) return null;

  const total = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const formattedDate = new Date(order.timestamp).toLocaleDateString();
  const formattedTime = new Date(order.timestamp).toLocaleTimeString();

  return (
    <div className="receipt-overlay">
      <div className="receipt-modal">
        <div className="receipt-header">
          <img src={logo} alt="Cafe Logo" className="receipt-logo" />
          <h2>Swadishta Café</h2>
          <p className="tagline">Savor the Moment 🍴</p>
        </div>

        <div className="receipt-info">
          <p><strong>Order ID:</strong> #{order.id}</p>
          <p><strong>Date:</strong> {formattedDate}</p>
          <p><strong>Time:</strong> {formattedTime}</p>
        </div>

        <table className="receipt-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>₹{(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="receipt-total">Total: ₹{total.toFixed(2)}</div>

        <div className="qr-section">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=Order-${order.id}`}
            alt="QR Code"
          />
        </div>

        <div className="thank-you">
          Thank you for ordering from <strong>Swadishta</strong>! ❤️
        </div>

        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ReceiptModal;
