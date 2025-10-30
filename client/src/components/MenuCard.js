import React from 'react';
import './MenuCard.css';

const MenuCard = ({ item = {}, cart = [], onAddToCart, onUpdateQuantity }) => {
  // ✅ MongoDB items have `_id`, so support both
  const itemId = item._id || item.id;

  // ✅ Find item safely in cart
  const cartItem = cart.find((cartItem) => cartItem._id === itemId || cartItem.id === itemId);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAdd = () => {
    if (onAddToCart) onAddToCart({ ...item, _id: itemId });
  };

  const handleUpdate = (newQty) => {
    if (onUpdateQuantity) onUpdateQuantity(itemId, newQty);
  };

  return (
    <div className="menu-card">
      <div className="menu-card-image">
        {item.image ? (
          <img src={item.image} alt={item.name || 'Menu Item'} />
        ) : (
          <div className="placeholder-image">
            <span>🍽️</span>
          </div>
        )}
      </div>

      <div className="menu-card-content">
        <h3 className="menu-card-title">{item.name || 'Untitled Item'}</h3>
        <p className="menu-card-description">
          {item.description || 'No description available.'}
        </p>

        <div className="menu-card-footer">
          <span className="menu-card-price">
            ₹{item?.price ? item.price.toFixed(2) : 'N/A'}
          </span>

          {quantity === 0 ? (
            <button className="add-to-cart-btn" onClick={handleAdd}>
              Add to Cart
            </button>
          ) : (
            <div className="quantity-controls">
              <button
                className="qty-btn"
                onClick={() => handleUpdate(quantity - 1)}
                disabled={quantity <= 0}
              >
                −
              </button>
              <span className="qty-display">{quantity}</span>
              <button
                className="qty-btn"
                onClick={() => handleUpdate(quantity + 1)}
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
