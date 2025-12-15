import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Admin from './pages/Admin';
import { CartProvider } from './context/CartContext';
import { Product, Order, Category } from './types';
import { initPixel } from './services/pixelService';

// Initial Mock Data
const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'آيفون 15 برو ماكس',
    price: 15000,
    category: Category.ELECTRONICS,
    image: 'https://picsum.photos/seed/iphone/400/400',
    description: 'أحدث هاتف ذكي من آبل بمعالج قوي وكاميرا احترافية.',
  },
  {
    id: '2',
    name: 'مكنسة كهربائية ذكية',
    price: 3500,
    category: Category.HOME,
    image: 'https://picsum.photos/seed/vacuum/400/400',
    description: 'تنظيف تلقائي للمنزل مع خرائط ذكية وتحكم عبر التطبيق.',
  },
  {
    id: '3',
    name: 'شاحن سيارة سريع',
    price: 250,
    category: Category.CARS,
    image: 'https://picsum.photos/seed/charger/400/400',
    description: 'شاحن USB-C سريع جداً يدعم جميع أنواع السيارات.',
  },
  {
    id: '4',
    name: 'سماعات بلوتوث عازلة',
    price: 1200,
    category: Category.ELECTRONICS,
    image: 'https://picsum.photos/seed/headphone/400/400',
    description: 'صوت نقي مع خاصية عزل الضوضاء النشط وبطارية طويلة.',
  },
  {
      id: '5',
      name: 'طقم أواني طهي جرانيت',
      price: 1800,
      category: Category.HOME,
      image: 'https://picsum.photos/seed/cookware/400/400',
      description: 'طقم أواني صحي غير قابل للالتصاق، مكون من 10 قطع.',
  }
];

// Helper for safe parsing
const safeJSONParse = <T,>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.error(`Error parsing ${key} from localStorage:`, error);
    return fallback;
  }
};

const App: React.FC = () => {
  // Simple Router State (Hash based routing logic for SPA without server)
  const [currentPath, setCurrentPath] = useState(window.location.hash.slice(1) || '/');
  
  // App Data State with Safe Parsing
  const [products, setProducts] = useState<Product[]>(() => 
    safeJSONParse('products', INITIAL_PRODUCTS)
  );
  
  const [orders, setOrders] = useState<Order[]>(() => 
    safeJSONParse('orders', [])
  );

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  // Pixel Init (Placeholder ID)
  useEffect(() => {
      // Replace 'YOUR_PIXEL_ID' with actual ID when provided
      const pixelId = ''; 
      if(pixelId) initPixel(pixelId);
  }, []);

  // Router Listener
  useEffect(() => {
    const onHashChange = () => {
      setCurrentPath(window.location.hash.slice(1) || '/');
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
  };

  // Route Rendering
  const renderRoute = () => {
    if (currentPath === '/' || currentPath === '') {
      return <Home products={products} navigate={navigate} setProducts={setProducts} />;
    }
    if (currentPath.startsWith('/product/')) {
      const id = currentPath.split('/product/')[1];
      const product = products.find((p) => p.id === id);
      return <ProductDetails product={product} navigate={navigate} />;
    }
    if (currentPath === '/cart') {
      return <Cart navigate={navigate} />;
    }
    if (currentPath === '/checkout') {
      return <Checkout navigate={navigate} setOrders={setOrders} />;
    }
    if (currentPath === '/admin') {
      return <Admin products={products} setProducts={setProducts} orders={orders} />;
    }
    return <Home products={products} navigate={navigate} setProducts={setProducts} />;
  };

  return (
    <CartProvider>
      <div className="min-h-screen font-sans text-right" dir="rtl">
        <Navbar navigate={navigate} />
        <main>
          {renderRoute()}
        </main>
        <footer className="bg-secondary text-white py-8 mt-12">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <p>&copy; 2023 سوق المغرب. جميع الحقوق محفوظة.</p>
                <div className="mt-4 text-gray-400 text-sm">
                    توصيل لجميع المدن: الدار البيضاء، الرباط، مراكش، طنجة...
                </div>
            </div>
        </footer>
      </div>
    </CartProvider>
  );
};

export default App;