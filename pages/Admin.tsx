import React, { useState } from 'react';
import { Product, Order, Category } from '../types';
import { generateProductDescription } from '../services/geminiService';
import { Plus, Trash2, Edit, Save, Wand2 } from 'lucide-react';

interface AdminProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  orders: Order[];
}

const Admin: React.FC<AdminProps> = ({ products, setProducts, orders }) => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [isEditing, setIsEditing] = useState<string | null>(null);
  
  // New Product State
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    category: Category.ELECTRONICS,
    image: 'https://picsum.photos/300/300',
    description: '',
  });

  const [aiLoading, setAiLoading] = useState(false);

  const handleGenerateDescription = async () => {
    if (!newProduct.name) return alert("أدخل اسم المنتج أولاً");
    setAiLoading(true);
    const desc = await generateProductDescription(newProduct.name, newProduct.category);
    setNewProduct(prev => ({ ...prev, description: desc }));
    setAiLoading(false);
  };

  const handleAddProduct = () => {
    const product: Product = {
      ...newProduct,
      id: Math.random().toString(36).substr(2, 9),
    };
    setProducts([...products, product]);
    setNewProduct({
      name: '',
      price: 0,
      category: Category.ELECTRONICS,
      image: 'https://picsum.photos/300/300',
      description: '',
    });
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">لوحة التحكم</h1>

      <div className="flex space-x-4 space-x-reverse mb-8 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-4 px-4 font-medium ${
            activeTab === 'products'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          المنتجات
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-4 px-4 font-medium ${
            activeTab === 'orders'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          الطلبات ({orders.length})
        </button>
      </div>

      {activeTab === 'products' ? (
        <div className="space-y-8">
          {/* Add Product Form */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold mb-4">إضافة منتج جديد</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="اسم المنتج"
                className="border p-2 rounded"
                value={newProduct.name}
                onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
              />
              <input
                type="number"
                placeholder="السعر (د.م.)"
                className="border p-2 rounded"
                value={newProduct.price || ''}
                onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
              />
              <select
                className="border p-2 rounded"
                value={newProduct.category}
                onChange={e => setNewProduct({ ...newProduct, category: e.target.value as Category })}
              >
                {Object.values(Category).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="رابط الصورة"
                className="border p-2 rounded text-left"
                dir="ltr"
                value={newProduct.image}
                onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
              />
            </div>
            <div className="mt-4">
              <textarea
                placeholder="وصف المنتج"
                className="w-full border p-2 rounded h-24"
                value={newProduct.description}
                onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
              />
              <button 
                onClick={handleGenerateDescription}
                disabled={aiLoading}
                className="mt-2 text-sm text-indigo-600 flex items-center hover:text-indigo-800"
              >
                <Wand2 className="h-4 w-4 ml-1" />
                {aiLoading ? "جاري التوليد..." : "توليد وصف تلقائي باستخدام الذكاء الاصطناعي"}
              </button>
            </div>
            <button
              onClick={handleAddProduct}
              className="mt-4 bg-primary text-white px-4 py-2 rounded flex items-center hover:bg-green-700"
            >
              <Plus className="ml-2 h-4 w-4" />
              إضافة المنتج
            </button>
          </div>

          {/* Product List */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {products.map(product => (
                <li key={product.id} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <img className="h-10 w-10 rounded-full object-cover ml-4" src={product.image} alt="" />
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-gray-500 text-sm">{product.price} د.م. - {product.category}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2 space-x-reverse">
                    <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:text-red-800">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {orders.length === 0 ? (
            <div className="p-6 text-center text-gray-500">لا توجد طلبات حتى الآن.</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {orders.map(order => (
                <li key={order.id} className="p-6">
                  <div className="flex flex-col md:flex-row justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">طلب #{order.id}</h3>
                      <p className="text-sm text-gray-500">{new Date(order.date).toLocaleString('ar-MA')}</p>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                        {order.status === 'pending' ? 'قيد الانتظار' : order.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 bg-gray-50 p-4 rounded">
                    <div>
                      <p className="text-xs text-gray-500">الزبون</p>
                      <p className="font-medium">{order.customer.fullName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">الهاتف</p>
                      <p className="font-medium" dir="ltr">{order.customer.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">المدينة</p>
                      <p className="font-medium">{order.customer.city}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">المجموع</p>
                      <p className="font-bold text-primary">{order.total.toLocaleString()} د.م.</p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">المنتجات:</h4>
                    <ul className="space-y-2">
                        {order.items.map((item, idx) => (
                            <li key={idx} className="flex justify-between text-sm text-gray-600">
                                <span>{item.quantity}x {item.name}</span>
                                <span>{(item.price * item.quantity).toLocaleString()} د.م.</span>
                            </li>
                        ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Admin;