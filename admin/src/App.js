import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import MenuManager from "./components/MenuManager";
import OrdersPanel from "./components/OrdersPanel";
import OrderHistory from "./components/OrderHistory";
import AnalyticsPanel from "./components/AnalyticsPanel"; // new import
import logo from "./assets/Logo.jpg";

const API_BASE = "http://localhost:3001/api";

function App() {
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);

  useEffect(() => {
    fetchOrders();
    fetchMenuItems();
    fetchOrderHistory();

    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_BASE}/orders`);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get(`${API_BASE}/menu`);
      const cleanedMenu = response.data.map((item) => ({
        ...item,
        price: Number(item.price),
      }));
      setMenuItems(cleanedMenu);
    } catch (error) {
      console.error("Error fetching menu:", error);
    }
  };

  const fetchOrderHistory = async () => {
    try {
      const response = await axios.get(`${API_BASE}/orders/history`);
      setOrderHistory(response.data);
    } catch (error) {
      console.error("Error fetching order history:", error);
    }
  };

  const completeOrder = async (orderId) => {
    try {
      await axios.patch(`${API_BASE}/orders/${orderId}/complete`);
      fetchOrders();
      fetchOrderHistory();
    } catch (error) {
      console.error("Error completing order:", error);
    }
  };

  const addMenuItem = async (item) => {
    try {
      const formattedItem = { ...item, price: Number(item.price) };
      await axios.post(`${API_BASE}/menu`, formattedItem);
      fetchMenuItems();
    } catch (error) {
      console.error("Error adding menu item:", error);
    }
  };

  const updateMenuItem = async (id, item) => {
    try {
      const formattedItem = { ...item, price: Number(item.price) };
      await axios.put(`${API_BASE}/menu/${id}`, formattedItem);
      fetchMenuItems();
    } catch (error) {
      console.error("Error updating menu item:", error);
    }
  };

  const deleteMenuItem = async (id) => {
    try {
      await axios.delete(`${API_BASE}/menu/${id}`);
      fetchMenuItems();
    } catch (error) {
      console.error("Error deleting menu item:", error);
    }
  };

  // 🧾 Generate a printable receipt in a new window
  const generateReceipt = (order) => {
    const newWindow = window.open("", "_blank");
    const receiptHTML = `
      <html>
        <head>
          <title>Receipt - ${order.orderId}</title>
          <style>
            body { font-family: 'Poppins', sans-serif; padding: 20px; background: #fdfdfd; color: #333; }
            .receipt-container { max-width: 400px; margin: auto; border: 2px solid #ccc; border-radius: 12px; padding: 20px; background: white; }
            .logo { display: block; margin: auto; width: 80px; border-radius: 50%; }
            h2 { text-align: center; margin-top: 10px; color: #222; }
            .order-id { text-align: center; font-size: 14px; margin-bottom: 15px; color: #777; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { text-align: left; padding: 6px; font-size: 14px; }
            th { background: #f2f2f2; }
            tfoot td { font-weight: bold; border-top: 1px solid #aaa; }
            .footer { text-align: center; margin-top: 20px; font-size: 13px; color: #555; }
            .thankyou { text-align: center; margin-top: 10px; font-size: 16px; color: #008c45; }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            <img src="${logo}" alt="Logo" class="logo" />
            <h2>Swadishta Café</h2>
            <div class="order-id">Order ID: ${order._id || order.id}</div>
            <div>Date: ${new Date(order.timestamp).toLocaleString()}</div>

            <table>
              <thead>
                <tr><th>Item</th><th>Qty</th><th>Price</th></tr>
              </thead>
              <tbody>
                ${order.items.map(
                  (item) =>
                    `<tr><td>${item.name}</td><td>${item.quantity}</td><td>₹${item.price * item.quantity}</td></tr>`
                ).join("")}
              </tbody>
              <tfoot>
                <tr><td colspan="2">Total</td><td>₹${order.total}</td></tr>
              </tfoot>
            </table>

            <div class="thankyou">Thank you for dining with us! ☕</div>
            <div class="footer">Scan this QR at counter for queries.</div>
          </div>
          <script>
            window.onload = () => window.print();
          </script>
        </body>
      </html>
    `;
    newWindow.document.write(receiptHTML);
    newWindow.document.close();
  };

  return (
    <div className="App">
      <header className="admin-header">
        <div className="header-content">
          <div className="logo-container">
            <img src={logo} alt="Swadishta Logo" className="logo" />
            <h1 className="brand-name">Swadishta Admin</h1>
          </div>

          <div className="tab-navigation">
            <button
              className={`tab-btn ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              Live Orders ({orders.length})
            </button>
            <button
              className={`tab-btn ${activeTab === "menu" ? "active" : ""}`}
              onClick={() => setActiveTab("menu")}
            >
              Menu Management
            </button>
            <button
              className={`tab-btn ${activeTab === "history" ? "active" : ""}`}
              onClick={() => setActiveTab("history")}
            >
              Order History
            </button>
            <button
              className={`tab-btn ${activeTab === "analytics" ? "active" : ""}`}
              onClick={() => setActiveTab("analytics")}
            >
              Analyse
            </button>
          </div>
        </div>
      </header>

      <main className="admin-main">
        <div className="container">
          {activeTab === "orders" && (
            <OrdersPanel orders={orders} onCompleteOrder={completeOrder} />
          )}

          {activeTab === "menu" && (
            <MenuManager
              menuItems={menuItems}
              onAddItem={addMenuItem}
              onUpdateItem={updateMenuItem}
              onDeleteItem={deleteMenuItem}
            />
          )}

          {activeTab === "history" && (
            <OrderHistory orders={orderHistory} onGenerateReceipt={generateReceipt} />
          )}

          {activeTab === "analytics" && <AnalyticsPanel orders={orderHistory} />}
        </div>
      </main>
    </div>
  );
}

export default App;
