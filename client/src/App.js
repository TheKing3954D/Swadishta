import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import MenuCard from "./components/MenuCard";
import Cart from "./components/Cart";
import ReceiptModal from "./components/ReceiptModal"; 
import logo from "./assets/Logo.jpg";

const API_BASE = "http://localhost:3001/api";

function App() {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch menu from backend
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(`${API_BASE}/menu`);
        setMenuItems(response.data);
      } catch (error) {
        console.error("Error fetching menu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenuItems();
  }, []);

  // ✅ Add item to cart
  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  // ✅ Update quantity or remove item
  const updateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === id ? { ...item, quantity: newQty } : item
        )
      );
    }
  };

  // ✅ Total price
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // ✅ Place order and show receipt
  const placeOrder = async (customerInfo) => {
    try {
      const orderData = {
        ...customerInfo,
        items: cart,
        total: getTotalPrice(),
        timestamp: new Date().toISOString(),
        id: Date.now(),
      };

      await axios.post(`${API_BASE}/orders`, orderData);

      setLastOrder(orderData);
      setShowReceipt(true);
      setCart([]);
      setShowCart(false);
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  // ✅ Loading screen
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading menu...</p>
      </div>
    );
  }

  // ✅ UI Layout
  return (
    <div className="App">
      {/* ===== HEADER ===== */}
      <header className="header">
        <div className="container mobile-optimized header-flex">
          <div className="logo-section">
            <img src={logo} alt="Restaurant Logo" className="header-logo" />
            <h1 className="brand-title">Swadishta</h1>
          </div>

          <button className="cart-button" onClick={() => setShowCart(true)}>
            🛒 Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
          </button>
        </div>
      </header>

      {/* ===== MENU GRID ===== */}
      <main className="main">
        <div className="container mobile-optimized">
          <h2 className="section-title">Menu</h2>
          <div className="menu-grid">
            {menuItems.length > 0 ? (
              menuItems.map((item) => (
                <MenuCard 
                 key={item.id} 
                 item={item} 
                 cart={cart} 
                 onAddToCart={addToCart} 
                 onUpdateQuantity={updateQuantity} 
                />
              ))
            ) : (
              <p className="no-items">No menu items available</p>
            )}
          </div>
        </div>
      </main>

      {/* ===== CART MODAL ===== */}
      {showCart && (
        <Cart
          cart={cart}
          onClose={() => setShowCart(false)}
          onUpdateQuantity={updateQuantity}
          onPlaceOrder={placeOrder}
          total={getTotalPrice()}
        />
      )}

      {/* ===== RECEIPT MODAL ===== */}
      {showReceipt && (
        <ReceiptModal
          order={lastOrder}
          onClose={() => setShowReceipt(false)}
        />
      )}
    </div>
  );
}

export default App;
