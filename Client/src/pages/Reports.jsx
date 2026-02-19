import { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import {
  BarChart3,
  TrendingUp,
  Package,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

const Reports = () => {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const [statsRes, ordersRes] = await Promise.all([
        api.get('/order/stats/summary'),
        api.get('/order')
      ]);

      setStats(statsRes.data.data);
      setOrders(ordersRes.data.data);
    } catch (error) {
      toast.error('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const calculateStatusPercentage = (status) => {
    if (!stats || stats.totalOrders === 0) return 0;
    return ((stats[`${status}Orders`] / stats.totalOrders) * 100).toFixed(1);
  };

  const getRecentRevenue = () => {
    const last30Days = orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return orderDate >= thirtyDaysAgo && order.status !== 'cancelled';
    });

    return last30Days.reduce((sum, order) => sum + order.amount, 0);
  };

  const getTopProducts = () => {
    const productCount = {};
    orders.forEach((order) => {
      if (order.status !== 'cancelled') {
        productCount[order.product] = (productCount[order.product] || 0) + order.quantity;
      }
    });

    return Object.entries(productCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="spinner"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center space-x-2">
              <BarChart3 className="h-8 w-8" />
              <span>Reports & Analytics</span>
            </h1>
            <p className="text-gray-600 mt-2">
              Overview of your order tracking system performance
            </p>
          </div>

          {/* Main Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Orders</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">
                    {stats?.totalOrders || 0}
                  </p>
                  <p className="text-sm text-green-600 mt-2 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    All time
                  </p>
                </div>
                <Package className="h-12 w-12 text-primary-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">
                    ${stats?.totalRevenue?.toFixed(2) || '0.00'}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">All time</p>
                </div>
                <DollarSign className="h-12 w-12 text-green-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Last 30 Days</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">
                    ${getRecentRevenue().toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">Revenue</p>
                </div>
                <TrendingUp className="h-12 w-12 text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Avg Order Value</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">
                    $
                    {stats?.totalOrders > 0
                      ? (stats.totalRevenue / stats.totalOrders).toFixed(2)
                      : '0.00'}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">Per order</p>
                </div>
                <BarChart3 className="h-12 w-12 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Order Status Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Status Breakdown</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-yellow-600" />
                      Pending
                    </span>
                    <span className="text-sm font-semibold">
                      {stats?.pendingOrders || 0} ({calculateStatusPercentage('pending')}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-600 h-2 rounded-full"
                      style={{ width: `${calculateStatusPercentage('pending')}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 flex items-center">
                      <Package className="h-4 w-4 mr-2 text-blue-600" />
                      Processing
                    </span>
                    <span className="text-sm font-semibold">
                      {stats?.processingOrders || 0} ({calculateStatusPercentage('processing')}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${calculateStatusPercentage('processing')}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 flex items-center">
                      <Package className="h-4 w-4 mr-2 text-purple-600" />
                      Shipped
                    </span>
                    <span className="text-sm font-semibold">
                      {stats?.shippedOrders || 0} ({calculateStatusPercentage('shipped')}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${calculateStatusPercentage('shipped')}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                      Delivered
                    </span>
                    <span className="text-sm font-semibold">
                      {stats?.deliveredOrders || 0} ({calculateStatusPercentage('delivered')}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${calculateStatusPercentage('delivered')}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 flex items-center">
                      <XCircle className="h-4 w-4 mr-2 text-red-600" />
                      Cancelled
                    </span>
                    <span className="text-sm font-semibold">
                      {stats?.cancelledOrders || 0} ({calculateStatusPercentage('cancelled')}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-600 h-2 rounded-full"
                      style={{ width: `${calculateStatusPercentage('cancelled')}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Top 5 Products</h2>
              <div className="space-y-4">
                {getTopProducts().length === 0 ? (
                  <p className="text-gray-600 text-center py-4">No product data available</p>
                ) : (
                  getTopProducts().map(([product, quantity], index) => (
                    <div key={product} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-primary-100 text-primary-600 rounded-full font-semibold text-sm">
                          {index + 1}
                        </div>
                        <span className="text-gray-800 font-medium">{product}</span>
                      </div>
                      <span className="text-gray-600 font-semibold">{quantity} units</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg shadow p-6 text-white">
            <h3 className="text-xl font-bold mb-2">System Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <p className="text-primary-100 text-sm">Success Rate</p>
                <p className="text-2xl font-bold">
                  {stats?.totalOrders > 0
                    ? (
                        ((stats.deliveredOrders / stats.totalOrders) * 100).toFixed(1)
                      )
                    : '0'}
                  %
                </p>
              </div>
              <div>
                <p className="text-primary-100 text-sm">Total Customers</p>
                <p className="text-2xl font-bold">
                  {new Set(orders.map((o) => o.customerEmail)).size}
                </p>
              </div>
              <div>
                <p className="text-primary-100 text-sm">Active Orders</p>
                <p className="text-2xl font-bold">
                  {(stats?.pendingOrders || 0) + (stats?.processingOrders || 0) + (stats?.shippedOrders || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Reports;