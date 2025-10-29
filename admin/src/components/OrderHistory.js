import React, { useState } from "react";
import logo from "../assets/Logo.jpg"; // ✅ your café logo
import "./OrderHistory.css";

const OrderHistory = ({ orders }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString(),
    };
  };

  const getOrderTotal = (items) =>
    items.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleGenerateReceipt = (order) => {
    const { date, time } = formatDateTime(order.timestamp);
    const total = getOrderTotal(order.items);
    const itemsHTML = order.items
      .map(
        (item) =>
          `<tr>
              <td>${item.name}</td>
              <td>${item.quantity}</td>
              <td>₹${(item.price * item.quantity).toFixed(2)}</td>
          </tr>`
      )
      .join("");

    const logoURL = window.location.origin + logo; // ✅ dynamically reference local image

    const receiptWindow = window.open("", "_blank");

    receiptWindow.document.write(`
      <html>
        <head>
          <title>Receipt - ${order.id}</title>
          <style>
            body {
              font-family: 'Poppins', sans-serif;
              background: #fdfdfd;
              margin: 0;
              padding: 20px;
              color: #333;
            }

            .receipt-container {
              max-width: 420px;
              margin: auto;
              border: 2px dashed #27ae60;
              border-radius: 12px;
              background: #fff;
              padding: 20px;
              box-shadow: 0 3px 8px rgba(0,0,0,0.1);
            }

            .header {
              text-align: center;
              border-bottom: 1px solid #ddd;
              padding-bottom: 10px;
              margin-bottom: 15px;
            }

            .header img {
              width: 70px;
              height: 70px;
              border-radius: 50%;
              object-fit: cover;
              margin-bottom: 8px;
            }

            h2 {
              color: #27ae60;
              margin: 5px 0;
            }

            .subtext {
              font-size: 0.85rem;
              color: #777;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 15px;
            }

            th, td {
              text-align: left;
              padding: 6px 4px;
              font-size: 0.9rem;
            }

            th {
              border-bottom: 1px solid #ddd;
              color: #444;
            }

            tr td:last-child {
              text-align: right;
            }

            .total {
              text-align: right;
              font-weight: bold;
              border-top: 1px solid #ddd;
              padding-top: 10px;
              margin-top: 10px;
              color: #2c3e50;
            }

            .qr {
              display: flex;
              justify-content: center;
              margin-top: 15px;
            }

            .thankyou {
              text-align: center;
              margin-top: 18px;
              font-style: italic;
              color: #666;
            }

            .footer-line {
              text-align: center;
              font-size: 0.8rem;
              margin-top: 10px;
              color: #aaa;
            }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            <div class="header">
              <img src="${logoURL}" alt="Cafe Logo" />
              <h2>Swadishta Café</h2>
              <div class="subtext">Where Taste Meets Tradition ☕</div>
            </div>

            <p><strong>Order ID:</strong> ${order.id}</p>
            <p><strong>Date:</strong> ${date} | <strong>Time:</strong> ${time}</p>
            <p><strong>Customer:</strong> ${order.name || "N/A"}</p>

            <table>
              <tr><th>Item</th><th>Qty</th><th>Price</th></tr>
              ${itemsHTML}
            </table>

            <div class="total">Total: ₹${total.toFixed(2)}</div>

            <div class="qr">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=Order-${order.id}" alt="QR Code" />
            </div>

            <div class="thankyou">Thank you for visiting Swadishta Café!</div>
            <div class="footer-line">Visit again soon 💚</div>
          </div>

          <script>window.print();</script>
        </body>
      </html>
    `);

    receiptWindow.document.close();
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      (order.name &&
        order.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.phone && order.phone.includes(searchTerm)) ||
      (order.table && order.table.toString().includes(searchTerm)) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      order.id.toString().includes(searchTerm);

    const matchesDate =
      !dateFilter ||
      new Date(order.timestamp).toLocaleDateString() ===
        new Date(dateFilter).toLocaleDateString();

    return matchesSearch && matchesDate;
  });

  const totalRevenue = filteredOrders.reduce(
    (total, order) => total + getOrderTotal(order.items),
    0
  );

  return (
    <div className="order-history-container">
      <h2>Order History</h2>
      <div className="order-history-stats">
        {filteredOrders.length} Total Orders<br />
        ₹{totalRevenue.toFixed(2)} Total Revenue
      </div>

      <div className="history-filters">
        <input
          type="text"
          placeholder="Search by name, table, or item..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="date-input"
        />
      </div>

      {filteredOrders.length === 0 ? (
        <div className="no-history">
          <p>No orders found</p>
          <small>Try adjusting your search or date filter</small>
        </div>
      ) : (
        <table className="order-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Phone</th>
              <th>Table</th>
              <th>Date</th>
              <th>Time</th>
              <th>Items</th>
              <th>Total</th>
              <th>Receipt</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => {
              const { date, time } = formatDateTime(order.timestamp);
              return (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.name || "N/A"}</td>
                  <td>{order.phone || "N/A"}</td>
                  <td>{order.table || "N/A"}</td>
                  <td>{date}</td>
                  <td>{time}</td>
                  <td data-label="Items">
                    {order.items.map((item, i) => (
                      <div key={i}>
                        {item.name} x{item.quantity}
                      </div>
                    ))}
                  </td>
                  <td data-label="Total">
                    ₹{getOrderTotal(order.items).toFixed(2)}
                  </td>
                  <td data-label="Receipt">
                    <button
                      className="receipt-btn"
                      onClick={() => handleGenerateReceipt(order)}
                    >
                      🧾 Generate
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderHistory;
