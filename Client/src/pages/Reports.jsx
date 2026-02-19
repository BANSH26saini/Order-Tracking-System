import { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
  BarChart3,
  TrendingUp,
  Package,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

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

  const StatCard = ({ title, value, icon: Icon, description, trend, trendUp }) => (
    <Card className="hover:border-primary/50 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="flex items-center text-xs mt-1">
          {trend && (
            <span className={`flex items-center ${trendUp ? 'text-green-500' : 'text-red-500'} mr-2`}>
              {trendUp ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingUp className="h-3 w-3 mr-1 rotate-180" />}
              {trend}
            </span>
          )}
          <span className="text-muted-foreground">{description}</span>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient-primary flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-primary" />
            Reports & Analytics
          </h1>
          <p className="text-muted-foreground">Detailed insights into your store's performance</p>
        </div>
        <Badge variant="outline" className="text-sm py-1 px-3 border-primary/20 bg-primary/10">
          Last Update: {new Date().toLocaleTimeString()}
        </Badge>
      </div>

      {/* Main Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={`$${stats?.totalRevenue?.toFixed(2) || '0.00'}`}
          icon={DollarSign}
          description="All time revenue"
          trend="+12.5%"
          trendUp={true}
        />
        <StatCard
          title="Total Orders"
          value={stats?.totalOrders || 0}
          icon={Package}
          description="Total orders processed"
          trend="+8.2%"
          trendUp={true}
        />
        <StatCard
          title="Last 30 Days"
          value={`$${getRecentRevenue().toFixed(2)}`}
          icon={TrendingUp}
          description="Revenue in last month"
          trend="+4.3%"
          trendUp={true}
        />
        <StatCard
          title="Avg Order Value"
          value={`$${stats?.totalOrders > 0 ? (stats.totalRevenue / stats.totalOrders).toFixed(2) : '0.00'}`}
          icon={BarChart3}
          description="Per order average"
          trend="-2.1%"
          trendUp={false}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Breakdown */}
        <Card className="border-white/5 bg-white/5">
          <CardHeader>
            <CardTitle>Order Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { label: 'Pending', count: stats?.pendingOrders, icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500' },
              { label: 'Processing', count: stats?.processingOrders, icon: Package, color: 'text-blue-500', bg: 'bg-blue-500' },
              { label: 'Shipped', count: stats?.shippedOrders, icon: Package, color: 'text-purple-500', bg: 'bg-purple-500' },
              { label: 'Delivered', count: stats?.deliveredOrders, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500' },
              { label: 'Cancelled', count: stats?.cancelledOrders, icon: XCircle, color: 'text-red-500', bg: 'bg-red-500' },
            ].map((item) => {
              const percentage = calculateStatusPercentage(item.label.toLowerCase());
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <item.icon className={`h-4 w-4 ${item.color}`} />
                      <span className="text-sm font-medium text-gray-200">{item.label}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {item.count || 0} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${item.bg} transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="border-white/5 bg-white/5">
          <CardHeader>
            <CardTitle>Top Performing Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getTopProducts().length === 0 ? (
                <div className="text-center py-8 text-muted-foreground flex flex-col items-center">
                  <AlertCircle className="h-8 w-8 mb-2 opacity-50" />
                  No product data available
                </div>
              ) : (
                getTopProducts().map(([product, quantity], index) => (
                  <div key={product} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${index === 0 ? 'bg-yellow-500/20 text-yellow-500' :
                          index === 1 ? 'bg-gray-400/20 text-gray-400' :
                            index === 2 ? 'bg-orange-500/20 text-orange-500' : 'bg-primary/20 text-primary'
                        }`}>
                        {index + 1}
                      </div>
                      <span className="font-medium text-white">{product}</span>
                    </div>
                    <Badge variant="secondary">{quantity} sold</Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20">
          <CardContent className="p-6">
            <p className="text-primary-foreground/80 text-sm font-medium mb-1">Success Rate</p>
            <div className="text-3xl font-bold text-white">
              {stats?.totalOrders > 0
                ? (((stats.deliveredOrders / stats.totalOrders) * 100).toFixed(1))
                : '0'}%
            </div>
            <p className="text-xs text-primary-foreground/60 mt-2">Orders delivered successfully</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/20 to-purple-900/5 border-purple-500/20">
          <CardContent className="p-6">
            <p className="text-purple-200/80 text-sm font-medium mb-1">Unique Customers</p>
            <div className="text-3xl font-bold text-white">
              {new Set(orders.map((o) => o.customerEmail)).size}
            </div>
            <p className="text-xs text-purple-200/60 mt-2">Total distinct buyers</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/5 border-blue-500/20">
          <CardContent className="p-6">
            <p className="text-blue-200/80 text-sm font-medium mb-1">Active Pipeline</p>
            <div className="text-3xl font-bold text-white">
              {(stats?.pendingOrders || 0) + (stats?.processingOrders || 0) + (stats?.shippedOrders || 0)}
            </div>
            <p className="text-xs text-blue-200/60 mt-2">Orders currently in progress</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;