import React, { useState } from 'react';
import './MenuManager.css';

const MenuManager = ({ menuItems, onAddItem, onUpdateItem, onDeleteItem }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const item = {
      ...formData,
      price: parseFloat(formData.price)
    };

    if (editingItem) {
      onUpdateItem(editingItem.id, item);
      setEditingItem(null);
    } else {
      onAddItem(item);
    }

    setFormData({ name: '', description: '', price: '', image: '' });
    setShowAddForm(false);
  };

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

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingItem(null);
    setFormData({ name: '', description: '', price: '', image: '' });
  };

  return (
    <div className="menu-manager">
      <div className="menu-header">
        <h2>Menu Management</h2>
        <button 
          className="add-item-btn"
          onClick={() => setShowAddForm(true)}
        >
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
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Price (₹)</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Image URL (optional)</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
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
        {menuItems.map(item => (
          <div key={item.id} className="menu-item-card">
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
              <button 
                className="edit-btn"
                onClick={() => handleEdit(item)}
              >
                Edit
              </button>
              <button 
                className="delete-btn"
                onClick={() => onDeleteItem(item.id)}
              >
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