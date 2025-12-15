import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { trackEvent } from '../services/pixelService';
import { CustomerDetails, Order } from '../types';
import { CheckCircle } from 'lucide-react';

interface CheckoutProps {
  navigate: (path: string) => void;
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}

const Checkout: React.FC<CheckoutProps> = ({ navigate, setOrders }) => {
  const { cart, total, clearCart } = useCart();
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [formData, setFormData] = useState<CustomerDetails>({
    fullName: '',
    city: '',
    phone: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.city || !formData.phone) {
      alert('الرجاء ملء جميع الحقول');
      return;
    }

    // Create Order
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      customer: formData,
      items: [...cart],
      total: total,
      date: new Date().toISOString(),
      status: 'pending',
    };

    // Update Global Order State
    setOrders((prev) => [newOrder, ...prev]);

    // Pixel Tracking
    trackEvent('Purchase', {
      value: total,
      currency: 'MAD',
      content_ids: cart.map((i) => i.id),
      num_items: cart.length,
    });

    // Clear Cart and Show Success
    clearCart();
    setStep('success');
  };

  if (cart.length === 0 && step === 'form') {
    navigate('/');
    return null;
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">شكراً لطلبك!</h2>
          <p className="text-gray-600 mb-6">
            تم استلام طلبك بنجاح. سنتصل بك قريباً على الرقم <strong>{formData.phone}</strong> لتأكيد الطلب.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-green-700 transition"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">إتمام الطلب</h1>
        
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="p-6 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  الاسم الكامل
                </label>
                <input
                  type="text"
                  name="fullName"
                  id="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary p-3 border"
                  placeholder="مثال: أحمد العلوي"
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  المدينة
                </label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary p-3 border"
                  placeholder="مثال: الدار البيضاء"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary p-3 border text-left"
                  dir="ltr"
                  placeholder="06 XX XX XX XX"
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mt-6">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">عدد المنتجات:</span>
                    <span className="font-bold">{cart.length}</span>
                </div>
                <div className="flex justify-between items-center text-lg">
                    <span className="font-bold text-gray-800">المبلغ الإجمالي للدفع:</span>
                    <span className="font-bold text-primary text-xl">{total.toLocaleString()} د.م.</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-primary hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition"
              >
                تأكيد الطلب
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;