const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// File paths for data persistence
const DATA_DIR = path.join(__dirname, 'data');
const MENU_FILE = path.join(DATA_DIR, 'menu.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const HISTORY_FILE = path.join(DATA_DIR, 'orderhistory.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Utility: Read JSON safely
const readJSON = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) return [];
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
  } catch (err) {
    console.error(`❌ Error reading ${filePath}:`, err);
    return [];
  }
};

// Utility: Write JSON safely
const writeJSON = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`❌ Error writing ${filePath}:`, err);
  }
};

// Load initial data
let menuItems = readJSON(MENU_FILE);
let orders = readJSON(ORDERS_FILE);
let orderHistory = readJSON(HISTORY_FILE);

// Normalize data to ensure price is numeric
const normalizeMenu = (items) =>
  items.map((item) => ({
    ...item,
    price: parseFloat(item.price) || 0,
  }));

menuItems = normalizeMenu(menuItems);

// Fallback default menu if empty
if (menuItems.length === 0) {
  menuItems = [
    {
      id: '1',
      name: 'Classic Burger',
      description:
        'Juicy beef patty with lettuce, tomato, and our special sauce',
      price: 129.99,
      image:
        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    },
    {
      id: '2',
      name: 'Margherita Pizza',
      description: 'Fresh mozzarella, tomatoes, and basil on crispy crust',
      price: 149.99,
      image:
        'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400',
    },
  ];
  writeJSON(MENU_FILE, menuItems);
}

// ---------- ROUTES ----------

// Get all menu items
app.get('/api/menu', (req, res) => {
  res.json(normalizeMenu(menuItems));
});

// Add new menu item
app.post('/api/menu', (req, res) => {
  const newItem = {
    id: uuidv4(),
    name: req.body.name || 'Untitled Item',
    description: req.body.description || '',
    price: parseFloat(req.body.price) || 0,
    image: req.body.image || '',
  };
  menuItems.push(newItem);
  writeJSON(MENU_FILE, menuItems);
  res.status(201).json(newItem);
});

// Update menu item
app.put('/api/menu/:id', (req, res) => {
  const { id } = req.params;
  const index = menuItems.findIndex((item) => item.id === id);
  if (index === -1)
    return res.status(404).json({ error: 'Menu item not found' });

  menuItems[index] = {
    ...menuItems[index],
    ...req.body,
    price:
      req.body.price !== undefined
        ? parseFloat(req.body.price) || 0
        : menuItems[index].price,
  };

  writeJSON(MENU_FILE, menuItems);
  res.json(menuItems[index]);
});

// Delete menu item
app.delete('/api/menu/:id', (req, res) => {
  const { id } = req.params;
  menuItems = menuItems.filter((item) => item.id !== id);
  writeJSON(MENU_FILE, menuItems);
  res.status(204).send();
});

// Get all pending orders
app.get('/api/orders', (req, res) => {
  res.json(orders);
});

// Create new order
app.post('/api/orders', (req, res) => {
  const { name, phone, tableNo, items, total } = req.body;

  // Validate phone number (must be 10 digits)
  const phonePattern = /^\d{10}$/;
  if (!phonePattern.test(phone)) {
    return res.status(400).json({ error: 'Invalid phone number. Must be 10 digits.' });
  }

  // Validate name
  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'Name is required.' });
  }

  // Validate table number
  if (!tableNo || tableNo.trim() === '') {
    return res.status(400).json({ error: 'Table number is required.' });
  }

  // Create new order object
  const newOrder = {
    id: uuidv4(),
    name: name.trim(),
    phone: phone.trim(),
    tableNo: tableNo.trim(),
    items: Array.isArray(items) ? items : [],
    total: parseFloat(total) || 0,
    status: 'pending',
    timestamp: new Date().toISOString(),
  };

  orders.push(newOrder);
  writeJSON(ORDERS_FILE, orders);
  res.status(201).json(newOrder);
});

// Complete order
app.patch('/api/orders/:id/complete', (req, res) => {
  const { id } = req.params;
  const orderIndex = orders.findIndex((order) => order.id === id);
  if (orderIndex === -1)
    return res.status(404).json({ error: 'Order not found' });

  const completedOrder = {
    ...orders[orderIndex],
    status: 'completed',
    completedAt: new Date().toISOString(),
  };

  orderHistory.push(completedOrder);
  orders.splice(orderIndex, 1);

  writeJSON(ORDERS_FILE, orders);
  writeJSON(HISTORY_FILE, orderHistory);

  res.json(completedOrder);
});

// Get order history
app.get('/api/orders/history', (req, res) => {
  const sortedHistory = orderHistory.sort(
    (a, b) => new Date(b.completedAt) - new Date(a.completedAt)
  );
  res.json(sortedHistory);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Customer app: http://localhost:3000`);
  console.log(`⚙️  Admin panel: http://localhost:3002`);
});
