# NexusAdmin - Order Tracking System

NexusAdmin is a premium order tracking system built with the MERN stack (MongoDB, Express, React, Node.js). It provides a sleek, modern interface for managing and tracking customer orders with role-based access control.

![Project Banner](https://placehold.co/1200x400/121214/white?text=NexusAdmin+Order+Tracking+System)

## 🚀 Features

- **JWT Authentication**: Secure login and registration.
- **Role-Based Access Control**:
  - **Admin**: Full access to dashboard, orders, and user management.
  - **User**: Access to view and manage their own orders.
- **Dashboard Overview**: Real-time statistics including total orders, revenue, and order status summaries.
- **Order Management**: Complete CRUD functionality for orders with status tracking (Pending, Processing, Shipped, Delivered, Cancelled).
- **Search & Filter**: Efficiently find orders by number, customer, or product, and filter by status.
- **Premium UI**: Dark-themed, responsive design built with Tailwind CSS, Framer Motion, and Lucide React.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Notifications**: React Hot Toast
- **API Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Bcryptjs (password hashing)
- **Validation**: Express-Validator

## 📦 Project Structure

```text
/
├── Client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # UI and Layout components
│   │   ├── pages/          # Application pages (Dashboard, Orders, etc.)
│   │   ├── context/        # Auth and Data context providers
│   │   └── utils/          # API utilities and constants
├── Server/                 # Backend Node.js API
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API endpoints
│   ├── controllers/        # Request handling logic
│   ├── middleware/         # Auth and error handling
│   └── scripts/            # Utility scripts (seeders, resetters)
```

## ⚙️ Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB (Local or Atlas)

### Backend Setup
1. Navigate to the `Server` directory:
   ```bash
   cd Server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `Server` root:
   ```env
   PORT=5001
   MONGO_URI=mongodb://localhost:27017/order_tracking
   JWT_SECRET=your_secret_key
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the `Client` directory:
   ```bash
   cd Client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

## 🔐 Default Admin Credentials

If you need to access the administrative dashboard, use the following credentials (ensuring the database is seeded or user is created):

- **Email**: `admin.verify@test.com`
- **Password**: `admin123`

*Note: You can use the `Server/scripts/resetAdmin.js` script to reset or create this user in your local database.*

## 📜 License

This project is licensed under the ISC License.

---
Built with ❤️ by [Your Name/Company]