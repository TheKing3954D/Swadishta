// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const dotenv = require('dotenv');
dotenv.config();

const MenuItem = require('./models/MenuItem');
const Order = require('./models/Order');
const OrderHistory = require('./models/OrderHistory');

const app = express();
const PORT = process.env.PORT || 3001;

// -------------------- MIDDLEWARE --------------------
app.use(cors({
  origin: ['http://localhost:5173', 'https://swadishta-client.vercel.app', 'https://swadishta-admin.vercel.app'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(helmet());

// -------------------- MONGODB CONNECTION --------------------
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// -------------------- MENU ROUTES --------------------

// Get all menu items
app.get('/api/menu', async (req, res) => {
  try {
    const menu = await MenuItem.find();
    res.json(menu);
  } catch (err) {
    console.error('Menu fetch error:', err);
    res.status(500).json({ error: 'Server error fetching menu' });
  }
});

// Add menu item
app.post('/api/menu', async (req, res) => {
  try {
    const item = new MenuItem(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    console.error('Add menu error:', err);
    res.status(400).json({ error: 'Invalid menu data' });
  }
});

// Update menu item
app.put('/api/menu/:id', async (req, res) => {
  try {
    const updated = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Item not found' });
    res.json(updated);
  } catch (err) {
    console.error('Update error:', err);
    res.status(400).json({ error: 'Error updating item' });
  }
});

// Delete menu item
app.delete('/api/menu/:id', async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    console.error('Delete error:', err);
    res.status(400).json({ error: 'Error deleting item' });
  }
});

// -------------------- ORDER ROUTES --------------------

// Get all pending orders
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find({ status: 'pending' });
    res.json(orders);
  } catch (err) {
    console.error('Fetch orders error:', err);
    res.status(500).json({ error: 'Error fetching orders' });
  }
});

// Create new order
app.post('/api/orders', async (req, res) => {
  try {
    const { name, phone, tableNo, items, total } = req.body;

    const phonePattern = /^\d{10}$/;
    if (!phonePattern.test(phone)) return res.status(400).json({ error: 'Invalid phone number' });
    if (!name || !tableNo) return res.status(400).json({ error: 'Missing required fields' });

    const newOrder = new Order({
      name,
      phone,
      tableNo,
      items,
      total,
      status: 'pending',
      timestamp: new Date(),
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    console.error('Create order error:', err);
    res.status(400).json({ error: 'Failed to create order' });
  }
});

// Mark order complete
app.patch('/api/orders/:id/complete', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    order.status = 'completed';
    order.completedAt = new Date();

    const completedOrder = new OrderHistory(order.toObject());
    await completedOrder.save();
    await order.deleteOne();

    res.json(completedOrder);
  } catch (err) {
    console.error('Complete order error:', err);
    res.status(500).json({ error: 'Error completing order' });
  }
});

// -------------------- ORDER HISTORY ROUTES --------------------
app.get('/api/orders/history', async (req, res) => {
  try {
    const history = await OrderHistory.find().sort({ completedAt: -1 });
    res.json(history);
  } catch (err) {
    console.error('Order history error:', err);
    res.status(500).json({ error: 'Error fetching order history' });
  }
});

// -------------------- HEALTH CHECK --------------------
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', time: new Date().toISOString() });
});

// -------------------- START SERVER --------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
