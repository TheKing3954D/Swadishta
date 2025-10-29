import React, { useState } from 'react';
import './Cart.css';

const Cart = ({ cart, onClose, onUpdateQuantity, onPlaceOrder, total }) => {
  const [name, setName] = useState('');
  const [tableNo, setTableNo] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const validateForm = () => {
    if (!name.trim() || !tableNo.trim() || !phone.trim()) {
      setError('⚠ Please fill in all fields before placing your order.');
      return false;
    }

    // ✅ Validate Table Number (must be numeric)
    if (!/^[0-9]+$/.test(tableNo)) {
      setError('⚠ Table number must be a numeric value.');
      return false;
    }

    // ✅ Validate Phone Number (10 digits only)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      setError('⚠ Please enter a valid 10-digit phone number.');
      return false;
    }

    setError('');
    return true;
  };

  const handlePlaceOrder = () => {
    if (!validateForm()) return;

    const customerInfo = {
      name,
      tableNo: Number(tableNo), // store tableNo as number for clarity
      phone,
    };

    onPlaceOrder(customerInfo);
  };

  return (
    <div className="cart-overlay">
      <div className="cart-modal">
        <div className="cart-header">
          <h2>Your Order</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="cart-content">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty</p>
              <span>🛒</span>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-info">
                      <h4>{item.name}</h4>
                      <p>₹{item.price.toFixed(2)} each</p>
                    </div>

                    <div className="cart-item-controls">
                      <button 
                        className="quantity-btn"
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button 
                        className="quantity-btn"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>

                    <div className="cart-item-total">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="customer-info">
                <h4>Customer Details</h4>
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Table Number"
                  value={tableNo}
                  onChange={(e) => setTableNo(e.target.value)}
                  maxLength={3}
                />
                <input
                  type="tel"
                  placeholder="Phone Number (10 digits)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={10}
                />
                {error && <p className="error-msg">{error}</p>}
              </div>

              <div className="cart-footer">
                <div className="cart-total">
                  <strong>Total: ₹{total.toFixed(2)}</strong>
                </div>
                <button 
                  className="place-order-btn"
                  onClick={handlePlaceOrder}
                >
                  Send Order to Kitchen
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
