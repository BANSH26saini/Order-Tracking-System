import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Package, TrendingUp, Users, Clock, ArrowRight, DollarSign } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await api.get('/order');
        const orders = data.data || [];

        const totalRevenue = orders.reduce((acc, order) => acc + (order.amount || 0), 0);
        const pendingOrders = orders.filter(o => o.status === 'pending').length;
        const recentOrders = orders.slice(0, 5);

        setStats({
          totalOrders: orders.length,
          totalRevenue,
          pendingOrders,
          recentOrders
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusVariant = (status) => {
    const variants = {
      pending: 'warning',
      processing: 'default',
      shipped: 'secondary',
      delivered: 'success',
      cancelled: 'destructive'
    };
    return variants[status] || 'default';
  };

  const StatCard = ({ title, value, icon: Icon, description }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">
          {description}
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gradient-primary">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back, {user?.name || 'User'}! Here's an overview of your store.
          </p>
        </div>
        <Button asChild>
          <Link to="/orders">Create New Order</Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          description="+20.1% from last month"
        />
        <StatCard
          title="Orders"
          value={stats.totalOrders}
          icon={Package}
          description="+180 from last month"
        />
        <StatCard
          title="Pending"
          value={stats.pendingOrders}
          icon={Clock}
          description="Orders awaiting processing"
        />
        <StatCard
          title="Active Users"
          value="573"
          icon={Users}
          description="+201 since last hour"
        />
      </div>

      {/* Recent Orders & Charts Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">

        {/* Recent Orders */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-4">Loading...</div>
            ) : (
              <div className="space-y-6">
                {stats.recentOrders.map((order) => (
                  <div key={order._id} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none text-white">
                        {order.customerName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.product}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={getStatusVariant(order.status)}>
                        {order.status}
                      </Badge>
                      <div className="font-medium">
                        ${order.amount.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
                {stats.recentOrders.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">No recent orders.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Activity / Placeholder Chart */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] flex items-center justify-center text-muted-foreground border border-dashed border-white/10 rounded-md">
              <TrendingUp className="mr-2 h-4 w-4" />
              Chart Placeholder
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;