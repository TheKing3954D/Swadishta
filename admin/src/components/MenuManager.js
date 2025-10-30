import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MenuManager.css';

const API_BASE = 'https://swadishta-server.onrender.com/api/menu'; // ✅ Your Render server base

const MenuManager = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: ''
  });

  // ✅ Fetch menu items on load
  const fetchMenu = async () => {
    try {
      const res = await axios.get(API_BASE);
      setMenuItems(res.data);
    } catch (err) {
      console.error('Error fetching menu:', err);
      alert('⚠️ Failed to load menu. Check server connection.');
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // ✅ Add / Update item
  const handleSubmit = async (e) => {
    e.preventDefault();
    const item = {
      ...formData,
      price: parseFloat(formData.price)
    };

    try {
      if (editingItem) {
        await axios.put(`${API_BASE}/${editingItem._id}`, item);
        alert('✅ Item updated successfully!');
      } else {
        await axios.post(API_BASE, item);
        alert('✅ Item added successfully!');
      }

      setShowAddForm(false);
      setEditingItem(null);
      setFormData({ name: '', description: '', price: '', image: '' });
      fetchMenu(); // Refresh list
    } catch (err) {
      console.error('Error saving item:', err);
      alert('❌ Failed to save item. Please check console.');
    }
  };

  // ✅ Edit
  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      image: item.image || ''
    });
    setShowAddForm(true);
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      await axios.delete(`${API_BASE}/${id}`);
      alert('🗑️ Item deleted');
      fetchMenu();
    } catch (err) {
      console.error('Error deleting item:', err);
      alert('❌ Failed to delete item.');
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingItem(null);
    setFormData({ name: '', description: '', price: '', image: '' });
  };

  return (
    <div className="menu-manager">
      <div className="menu-header">
        <h2>Menu Management</h2>
        <button className="add-item-btn" onClick={() => setShowAddForm(true)}>
          + Add New Item
        </button>
      </div>

      {showAddForm && (
        <div className="form-overlay">
          <form className="menu-form" onSubmit={handleSubmit}>
            <h3>{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h3>

            <div className="form-group">
              <label>Item Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Price (₹)</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Image URL (optional)</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="form-actions">
              <button type="button" onClick={handleCancel} className="cancel-btn">
                Cancel
              </button>
              <button type="submit" className="save-btn">
                {editingItem ? 'Update Item' : 'Add Item'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="menu-items-grid">
        {menuItems.map((item) => (
          <div key={item._id} className="menu-item-card">
            <div className="menu-item-image">
              {item.image ? (
                <img src={item.image} alt={item.name} />
              ) : (
                <div className="placeholder-image">🍽️</div>
              )}
            </div>

            <div className="menu-item-content">
              <h4>{item.name}</h4>
              <p>{item.description}</p>
              <div className="menu-item-price">₹{item.price.toFixed(2)}</div>
            </div>

            <div className="menu-item-actions">
              <button className="edit-btn" onClick={() => handleEdit(item)}>
                Edit
              </button>
              <button className="delete-btn" onClick={() => handleDelete(item._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuManager;
