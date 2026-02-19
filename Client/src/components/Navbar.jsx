import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Package, LogOut, User, Settings, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <Package className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-800">
              Order Tracker
            </span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link
              to="/dashboard"
              className="text-gray-700 hover:text-primary-600 transition"
            >
              Dashboard
            </Link>
            <Link
              to="/orders"
              className="text-gray-700 hover:text-primary-600 transition"
            >
              Orders
            </Link>
            
            {isAdmin() && (
              <>
                <Link
                  to="/users"
                  className="text-gray-700 hover:text-primary-600 transition flex items-center space-x-1"
                >
                  <User className="h-4 w-4" />
                  <span>Users</span>
                </Link>
                <Link
                  to="/reports"
                  className="text-gray-700 hover:text-primary-600 transition flex items-center space-x-1"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Reports</span>
                </Link>
                <Link
                  to="/settings"
                  className="text-gray-700 hover:text-primary-600 transition flex items-center space-x-1"
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </>
            )}

            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;