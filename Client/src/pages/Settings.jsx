import { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Settings as SettingsIcon, Save, Building2, Receipt, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    companyEmail: '',
    companyPhone: '',
    currency: 'USD',
    taxRate: 0,
    orderPrefix: 'ORD',
    enableNotifications: true
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/settings');
      setFormData({
        companyName: data.data.companyName || '',
        companyEmail: data.data.companyEmail || '',
        companyPhone: data.data.companyPhone || '',
        currency: data.data.currency || 'USD',
        taxRate: data.data.taxRate || 0,
        orderPrefix: data.data.orderPrefix || 'ORD',
        enableNotifications: data.data.enableNotifications ?? true
      });
    } catch (error) {
      toast.error('Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.put('/settings', formData);
      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient-primary flex items-center gap-2">
            <SettingsIcon className="h-8 w-8 text-primary" />
            System Settings
          </h1>
          <p className="text-muted-foreground">Configure your order tracking system preferences</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Information */}
        <Card className="border-white/5 bg-white/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <CardTitle>Company Information</CardTitle>
            </div>
            <CardDescription>Enter your business details that will appear on invoices.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium text-gray-200">Company Name</label>
                <Input name="companyName" value={formData.companyName} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">Company Email</label>
                <Input type="email" name="companyEmail" value={formData.companyEmail} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">Company Phone</label>
                <Input type="tel" name="companyPhone" value={formData.companyPhone} onChange={handleInputChange} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Configuration */}
        <Card className="border-white/5 bg-white/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-purple-500" />
              <CardTitle>Order Configuration</CardTitle>
            </div>
            <CardDescription>Customize how orders are processed and displayed.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">Order Prefix</label>
                <Input name="orderPrefix" value={formData.orderPrefix} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">Currency</label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="w-full h-10 px-3 rounded-md border border-white/10 bg-black/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-white"
                >
                  <option value="USD" className="bg-surface">USD ($)</option>
                  <option value="EUR" className="bg-surface">EUR (€)</option>
                  <option value="GBP" className="bg-surface">GBP (£)</option>
                  <option value="INR" className="bg-surface">INR (₹)</option>
                  <option value="JPY" className="bg-surface">JPY (¥)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">Tax Rate (%)</label>
                <Input type="number" name="taxRate" min="0" max="100" step="0.01" value={formData.taxRate} onChange={handleInputChange} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-white/5 bg-white/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-yellow-500" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>Manage your email alert preferences.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3 p-4 border border-white/5 rounded-lg bg-black/20">
              <input
                type="checkbox"
                name="enableNotifications"
                checked={formData.enableNotifications}
                onChange={handleInputChange}
                className="w-5 h-5 text-primary rounded focus:ring-primary/50 bg-black/20 border-white/10"
              />
              <label className="text-sm font-medium text-gray-200">
                Enable email notifications for order updates
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={saving} size="lg" className="w-full md:w-auto">
            {saving ? 'Saving...' : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Settings;