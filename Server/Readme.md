# Order Tracking System - Backend

A complete REST API for order tracking system with JWT authentication and role-based access control.

## Features

- JWT Authentication
- Role-based authorization (Admin/User)
- Full CRUD operations for orders
- User management
- Order statistics and reports
- Settings management
- Password hashing with bcrypt
- MongoDB database

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file and add your configuration:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/order_tracking
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

3. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user (Protected)

### Orders
- GET `/api/order` - Get all orders (Protected)
- GET `/api/order/:id` - Get single order (Protected)
- POST `/api/order` - Create order (Protected)
- PUT `/api/order/:id` - Update order (Protected)
- DELETE `/api/order/:id` - Delete order (Protected)
- GET `/api/order/stats/summary` - Get order statistics (Admin only)

### Users
- GET `/api/users` - Get all users (Admin only)
- GET `/api/users/:id` - Get single user (Admin only)
- PUT `/api/users/:id` - Update user (Admin only)
- DELETE `/api/users/:id` - Delete user (Admin only)

### Settings
- GET `/api/settings` - Get settings (Protected)
- PUT `/api/settings` - Update settings (Admin only)

## Default Admin Account

After first setup, register an admin account:
```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "admin123",
  "role": "admin"
}
```

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- CORS enabled