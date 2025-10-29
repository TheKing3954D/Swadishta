import React from 'react';
import './MenuCard.css';

const MenuCard = ({ item = {}, cart = [], onAddToCart, onUpdateQuantity }) => {
  // Safely find item in cart (handle cases when cart is empty or item missing)
  const cartItem = cart.find((cartItem) => cartItem.id === item.id);
  const quantity = cartItem ? cartItem.quantity : 0;

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
            <button
              className="add-to-cart-btn"
              onClick={() => onAddToCart && onAddToCart(item)}
            >
              Add to Cart
            </button>
          ) : (
            <div className="quantity-controls">
              <button
                className="qty-btn"
                onClick={() =>
                  onUpdateQuantity && onUpdateQuantity(item.id, quantity - 1)
                }
              >
                −
              </button>
              <span className="qty-display">{quantity}</span>
              <button
                className="qty-btn"
                onClick={() =>
                  onUpdateQuantity && onUpdateQuantity(item.id, quantity + 1)
                }
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
