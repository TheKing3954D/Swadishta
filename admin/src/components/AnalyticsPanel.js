import React, { useMemo } from "react";
import "./AnalyticsPanel.css";

// ✅ AnalyticsPanel Component
// Use as: <AnalyticsPanel orders={orderHistory} currency="₹" />
// orders = [{ id, date, items: [{ name, price, quantity }], total }, ...]

export default function AnalyticsPanel({ orders = [], currency = "₹" }) {
  // Helper to format date for same-day comparison
  const toYMD = (iso) => {
    const d = new Date(iso);
    return (
      d.getFullYear() +
      "-" +
      (d.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      d.getDate().toString().padStart(2, "0")
    );
  };

  const todayYMD = toYMD(new Date().toISOString());

  // 🧮 Compute analytics using useMemo
  const analytics = useMemo(() => {
    const totals = {
      totalRevenue: 0,
      totalSalesToday: 0,
      orderCount: 0,
      itemSales: {}, // itemName -> quantity
    };

    for (const order of orders) {
      const orderDate = toYMD(order.date || order.createdAt || new Date());
      const orderTotal =
        Number(order.total) ||
        order.items?.reduce(
          (sum, it) =>
            sum + (Number(it.price) || 0) * (Number(it.quantity) || 0),
          0
        ) ||
        0;

      totals.totalRevenue += orderTotal;
      totals.orderCount += 1;
      if (orderDate === todayYMD) totals.totalSalesToday += orderTotal;

      // Item-wise quantity counting
      if (Array.isArray(order.items)) {
        for (const it of order.items) {
          const key = it.name || it.id || "Unknown Item";
          totals.itemSales[key] =
            (totals.itemSales[key] || 0) + (Number(it.quantity) || 0);
        }
      }
    }

    // Sort best-selling items
    const bestSelling = Object.entries(totals.itemSales)
      .map(([name, qty]) => ({ name, quantity: qty }))
      .sort((a, b) => b.quantity - a.quantity);

    return {
      ...totals,
      bestSelling,
    };
  }, [orders, todayYMD]);

  const { totalRevenue, totalSalesToday, orderCount, bestSelling } = analytics;

  return (
    <div className="analytics-container">
      {/* ===== Summary Cards ===== */}
      <div className="analytics-cards">
        <div className="analytics-card">
          <h3>Total Revenue (All Time)</h3>
          <div className="value">
            {currency}
            {totalRevenue.toFixed(2)}
          </div>
          <p>Orders: {orderCount}</p>
        </div>

        <div className="analytics-card">
          <h3>Sales Today</h3>
          <div className="value">
            {currency}
            {totalSalesToday.toFixed(2)}
          </div>
          <p>Date: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="analytics-card">
          <h3>Top Item</h3>
          {bestSelling.length > 0 ? (
            <div className="value">{bestSelling[0].name}</div>
          ) : (
            <p>No data yet</p>
          )}
          <p>
            Sold:{" "}
            {bestSelling.length > 0 ? bestSelling[0].quantity : "0"}
          </p>
        </div>
      </div>

      {/* ===== Best Sellers Table ===== */}
      <div className="best-sellers">
        <h2>Best Selling Items</h2>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity Sold</th>
            </tr>
          </thead>
          <tbody>
            {bestSelling.length === 0 ? (
              <tr>
                <td colSpan="2">No data available</td>
              </tr>
            ) : (
              bestSelling.slice(0, 10).map((item, idx) => (
                <tr key={idx}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
