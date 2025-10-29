# Restaurant Ordering System

A modern two-panel restaurant ordering application with customer-facing menu and admin management panel.

## Features

### Customer Panel (Port 3000)
- 📱 Mobile-optimized responsive design
- 🍽️ Interactive menu with photos and descriptions
- 🛒 Shopping cart functionality
- ✅ Order placement (sends to admin panel)
- 🔗 Accessible via direct link (QR code ready)

### Admin Panel (Port 3002)
- 📊 Live order management
- 🍕 Menu item management (add, edit, delete)
- 📈 Order history with search and filtering
- 💰 Revenue tracking
- ⚡ Real-time order notifications

### Backend API (Port 3001)
- 🚀 Express.js REST API
- 📦 In-memory storage (easily replaceable with database)
- 🔄 Real-time order synchronization
- 📝 Complete CRUD operations

## Quick Start

1. **Install dependencies for all components:**
   ```bash
   npm run install-all
   ```

2. **Start all services:**
   ```bash
   npm run dev
   ```

This will start:
- Customer app: http://localhost:3000
- Admin panel: http://localhost:3002
- Backend API: http://localhost:3001

## Individual Service Commands

### Customer App
```bash
cd client
npm start
```

### Admin Panel
```bash
cd admin
npm start
```

### Backend Server
```bash
cd server
npm run dev
```

## Project Structure

```
restaurant-ordering-app/
├── client/          # Customer-facing React app
├── admin/           # Admin panel React app
├── server/          # Express.js backend API
└── package.json     # Root package with scripts
```

## Mobile Optimization

The customer app is fully optimized for mobile devices:
- Responsive grid layout
- Touch-friendly buttons
- Mobile-first design approach
- Fast loading and smooth animations

## QR Code Integration

To generate a QR code for the customer app:
1. Use any QR code generator
2. Input: `http://your-domain:3000` (or your deployed URL)
3. Print and place at tables for easy customer access

## Deployment Notes

For production deployment:
1. Replace in-memory storage with a proper database (MongoDB, PostgreSQL, etc.)
2. Add authentication for admin panel
3. Configure environment variables
4. Set up proper CORS policies
5. Add HTTPS support

## Customization

- **Logo**: Replace the emoji logo in headers with your restaurant logo
- **Colors**: Modify CSS variables in the respective style files
- **Menu Items**: Use the admin panel to manage your menu
- **Styling**: Each component has its own CSS file for easy customization

## API Endpoints

- `GET /api/menu` - Get all menu items
- `POST /api/menu` - Add new menu item
- `PUT /api/menu/:id` - Update menu item
- `DELETE /api/menu/:id` - Delete menu item
- `GET /api/orders` - Get pending orders
- `POST /api/orders` - Create new order
- `PATCH /api/orders/:id/complete` - Mark order as complete
- `GET /api/orders/history` - Get order history

## Technologies Used

- **Frontend**: React, CSS3, Axios
- **Backend**: Node.js, Express.js
- **Storage**: In-memory (production-ready for database integration)
- **Styling**: Modern CSS with gradients and animations
- **Icons**: Unicode emojis for universal compatibility"# Swadishta" 
