# Order Tracking System - Frontend

A modern React + Vite frontend for the Order Tracking System with JWT authentication and role-based access control.

## Features

- 🔐 JWT Authentication (Login/Register)
- 👥 Role-based access control (Admin/User)
- 📦 Complete Order Management (CRUD)
- 📊 Real-time Dashboard with Statistics
- 👤 User Management (Admin Only)
- 📈 Reports & Analytics (Admin Only)
- ⚙️ System Settings (Admin Only)
- 🎨 Modern UI with Tailwind CSS
- 📱 Fully Responsive Design
- 🔔 Toast Notifications
- 🔍 Search & Filter Functionality

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running on http://localhost:5001

## Installation

1. Install dependencies:
```bash
npm install
```

2. Make sure your backend is running on port 5001

3. Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:3000`

## Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` folder.

## Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Navbar.jsx
│   └── ProtectedRoute.jsx
├── context/            # React Context (Auth)
│   └── AuthContext.jsx
├── pages/              # Page components
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── Orders.jsx
│   ├── Users.jsx
│   ├── Reports.jsx
│   └── Settings.jsx
├── utils/              # Utility functions
│   └── api.js
├── App.jsx             # Main app component with routing
├── main.jsx            # Entry point
└── index.css           # Global styles with Tailwind

```

## Default Login Credentials

### Admin Account
- Email: `admin@example.com`
- Password: `admin123`

### User Account
- Email: `user@example.com`
- Password: `user123`

## Technologies Used

- **React 18** - UI Library
- **Vite** - Build Tool
- **React Router v6** - Routing
- **Axios** - HTTP Client
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Hot Toast** - Notifications

## Available Routes

### Public Routes
- `/login` - Login page
- `/register` - Registration page

### Protected Routes (Requires Authentication)
- `/dashboard` - Main dashboard
- `/orders` - Orders management

### Admin Only Routes
- `/users` - User management
- `/reports` - Reports & analytics
- `/settings` - System settings

## API Configuration

The API base URL is configured in `src/utils/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:5001/api';
```

If your backend runs on a different port, update this URL.

## Features by Role

### User Features
- View dashboard
- Create, view, edit, and delete their own orders
- View order statistics

### Admin Features
- All user features
- Manage all users
- View comprehensive reports
- Configure system settings
- Manage all orders from all users

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License.