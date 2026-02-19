import { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  X,
  Package,
  Filter
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // create, edit, view
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    product: '',
    quantity: 1,
    amount: 0,
    status: 'pending',
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    notes: ''
  });

  useEffect(() => {
    fetchOrders();
  }, [searchTerm, statusFilter]);

  const fetchOrders = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter) params.append('status', statusFilter);

      const { data } = await api.get(`/order?${params.toString()}`);
      setOrders(data.data);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const resetForm = () => {
    setFormData({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      product: '',
      quantity: 1,
      amount: 0,
      status: 'pending',
      shippingAddress: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      },
      notes: ''
    });
    setSelectedOrder(null);
  };

  const openModal = (mode, order = null) => {
    setModalMode(mode);
    if (order) {
      setSelectedOrder(order);
      if (mode === 'edit') {
        setFormData({
          ...order,
          shippingAddress: order.shippingAddress || { street: '', city: '', state: '', zipCode: '', country: '' },
          notes: order.notes || ''
        });
      }
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'create') {
        await api.post('/order', formData);
        toast.success('Order created successfully');
      } else if (modalMode === 'edit') {
        await api.put(`/order/${selectedOrder._id}`, formData);
        toast.success('Order updated successfully');
      }
      fetchOrders();
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await api.delete(`/order/${orderId}`);
        toast.success('Order deleted successfully');
        fetchOrders();
      } catch (error) {
        toast.error('Failed to delete order');
      }
    }
  };

  const getStatusVariant = (status) => {
    const variants = {
      pending: 'warning',
      processing: 'default', // blue
      shipped: 'secondary', // purple
      delivered: 'success', // green
      cancelled: 'destructive' // red
    };
    return variants[status] || 'outline';
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient-primary">Orders Management</h1>
          <p className="text-muted-foreground">Manage and track your customer orders</p>
        </div>
        <Button onClick={() => openModal('create')} className="shadow-lg shadow-primary/20">
          <Plus className="mr-2 h-4 w-4" />
          Create Order
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-white/5 bg-white/5">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-black/20 border-white/10"
              />
            </div>
            <div className="relative w-full md:w-[200px]">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-10 pl-9 pr-4 rounded-md border border-white/10 bg-black/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-white appearance-none cursor-pointer"
              >
                <option value="" className="bg-surface text-white">All Status</option>
                <option value="pending" className="bg-surface text-white">Pending</option>
                <option value="processing" className="bg-surface text-white">Processing</option>
                <option value="shipped" className="bg-surface text-white">Shipped</option>
                <option value="delivered" className="bg-surface text-white">Delivered</option>
                <option value="cancelled" className="bg-surface text-white">Cancelled</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="overflow-hidden border-white/5 bg-white/5">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No orders found</p>
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-white/5 text-muted-foreground font-medium border-b border-white/5">
                <tr>
                  <th className="px-6 py-4">Order #</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{order.orderNumber}</td>
                    <td className="px-6 py-4">
                      <div className="text-white">{order.customerName}</div>
                      <div className="text-muted-foreground text-xs">{order.customerEmail}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{order.product}</td>
                    <td className="px-6 py-4 font-medium text-white">${order.amount.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <Badge variant={getStatusVariant(order.status)}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => openModal('view', order)}>
                          <Eye className="h-4 w-4 text-blue-400" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openModal('edit', order)}>
                          <Edit2 className="h-4 w-4 text-green-400" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(order._id)}>
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          {/* Modal Content */}
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto border-white/10 bg-[#121214] shadow-2xl animate-in zoom-in-95 duration-200">
            <CardHeader className="flex flex-row items-center justify-between border-b border-white/10 sticky top-0 bg-[#121214] z-10">
              <CardTitle>
                {modalMode === 'create' && 'Create New Order'}
                {modalMode === 'edit' && 'Edit Order'}
                {modalMode === 'view' && 'Order Details'}
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={closeModal}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>

            <CardContent className="p-6">
              {modalMode === 'view' ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div><p className="text-muted-foreground text-sm">Order Number</p><p className="font-semibold text-white">{selectedOrder?.orderNumber}</p></div>
                    <div><p className="text-muted-foreground text-sm">Status</p><Badge variant={getStatusVariant(selectedOrder?.status)}>{selectedOrder?.status}</Badge></div>
                    <div><p className="text-muted-foreground text-sm">Customer</p><p className="font-semibold text-white">{selectedOrder?.customerName}</p></div>
                    <div><p className="text-muted-foreground text-sm">Email</p><p className="text-white">{selectedOrder?.customerEmail}</p></div>
                    <div><p className="text-muted-foreground text-sm">Phone</p><p className="text-white">{selectedOrder?.customerPhone}</p></div>
                    <div><p className="text-muted-foreground text-sm">Product</p><p className="text-white">{selectedOrder?.product}</p></div>
                    <div><p className="text-muted-foreground text-sm">Quantity</p><p className="text-white">{selectedOrder?.quantity}</p></div>
                    <div><p className="text-muted-foreground text-sm">Amount</p><p className="text-white font-semibold">${selectedOrder?.amount.toFixed(2)}</p></div>
                  </div>
                  <div className="border-t border-white/10 pt-4">
                    <h4 className="font-semibold text-white mb-2">Shipping Address</h4>
                    <p className="text-gray-400 text-sm">
                      {selectedOrder?.shippingAddress?.street}, {selectedOrder?.shippingAddress?.city}, {selectedOrder?.shippingAddress?.state} {selectedOrder?.shippingAddress?.zipCode}, {selectedOrder?.shippingAddress?.country}
                    </p>
                  </div>
                  {selectedOrder?.notes && (
                    <div className="border-t border-white/10 pt-4">
                      <h4 className="font-semibold text-white mb-2">Notes</h4>
                      <p className="text-gray-400 text-sm">{selectedOrder.notes}</p>
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Customer Name</label>
                      <Input name="customerName" value={formData.customerName} onChange={handleInputChange} required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <Input type="email" name="customerEmail" value={formData.customerEmail} onChange={handleInputChange} required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone</label>
                      <Input type="tel" name="customerPhone" value={formData.customerPhone} onChange={handleInputChange} required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Product</label>
                      <Input name="product" value={formData.product} onChange={handleInputChange} required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Quantity</label>
                      <Input type="number" name="quantity" min="1" value={formData.quantity} onChange={handleInputChange} required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Amount</label>
                      <Input type="number" name="amount" min="0" step="0.01" value={formData.amount} onChange={handleInputChange} required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Status</label>
                      <select name="status" value={formData.status} onChange={handleInputChange} className="w-full h-10 px-3 rounded-md border border-white/10 bg-black/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-white">
                        <option value="pending" className="bg-surface">Pending</option>
                        <option value="processing" className="bg-surface">Processing</option>
                        <option value="shipped" className="bg-surface">Shipped</option>
                        <option value="delivered" className="bg-surface">Delivered</option>
                        <option value="cancelled" className="bg-surface">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-4 space-y-4">
                    <h4 className="font-semibold text-white">Shipping Address</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input name="shippingAddress.street" placeholder="Street" value={formData.shippingAddress.street} onChange={handleInputChange} className="md:col-span-2" />
                      <Input name="shippingAddress.city" placeholder="City" value={formData.shippingAddress.city} onChange={handleInputChange} />
                      <Input name="shippingAddress.state" placeholder="State" value={formData.shippingAddress.state} onChange={handleInputChange} />
                      <Input name="shippingAddress.zipCode" placeholder="Zip Code" value={formData.shippingAddress.zipCode} onChange={handleInputChange} />
                      <Input name="shippingAddress.country" placeholder="Country" value={formData.shippingAddress.country} onChange={handleInputChange} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Notes</label>
                    <textarea name="notes" rows="3" value={formData.notes} onChange={handleInputChange} className="w-full px-3 py-2 rounded-md border border-white/10 bg-black/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-white placeholder:text-muted-foreground"></textarea>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
                    <Button type="button" variant="ghost" onClick={closeModal}>Cancel</Button>
                    <Button type="submit">{modalMode === 'create' ? 'Create Order' : 'Update Order'}</Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Orders;