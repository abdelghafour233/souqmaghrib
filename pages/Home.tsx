import React, { useState } from 'react';
import { Product, Category } from '../types';
import { useCart } from '../context/CartContext';
import { Plus, Search, Filter } from 'lucide-react';

interface HomeProps {
  products: Product[];
  navigate: (path: string) => void;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const Home: React.FC<HomeProps> = ({ products, navigate }) => {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-primary overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-primary sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-right">
                <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">أفضل المنتجات</span>{' '}
                  <span className="block text-accent xl:inline">بأفضل الأسعار</span>
                </h1>
                <p className="mt-3 text-base text-gray-100 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  تسوق الآن واحصل على أحدث الإلكترونيات، مستلزمات المنزل، والسيارات الفاخرة. توصيل سريع لجميع مدن المغرب.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <a href="#products" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-gray-100 md:py-4 md:text-lg md:px-10">
                      تسوق الآن
                    </a>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:left-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://picsum.photos/seed/morocco/1920/1080"
            alt="Moroccan shopping"
          />
        </div>
      </div>

      {/* Filter & Search */}
      <div id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex space-x-2 space-x-reverse overflow-x-auto pb-2 w-full md:w-auto">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                selectedCategory === 'all' ? 'bg-secondary text-white' : 'bg-white text-gray-700 border'
              }`}
            >
              الكل
            </button>
            {Object.values(Category).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full whitespace-nowrap ${
                  selectedCategory === cat ? 'bg-secondary text-white' : 'bg-white text-gray-700 border'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="ابحث عن منتج..."
              className="w-full pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute ml-3 top-2.5 right-0 text-gray-400 h-5 w-5" />
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition duration-300 border border-gray-100 flex flex-col">
              <div 
                className="h-48 w-full bg-gray-200 rounded-t-xl overflow-hidden cursor-pointer relative group"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity" />
              </div>
              
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start">
                    <h3 
                        onClick={() => navigate(`/product/${product.id}`)}
                        className="text-lg font-bold text-gray-900 cursor-pointer hover:text-primary mb-1">
                        {product.name}
                    </h3>
                </div>
                <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-1">{product.description}</p>
                
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xl font-bold text-primary">{product.price.toLocaleString()} د.م.</span>
                  <button
                    onClick={() => addToCart(product)}
                    className="p-2 rounded-full bg-secondary text-white hover:bg-primary transition shadow-md flex items-center gap-2 px-4"
                  >
                    <Plus className="h-5 w-5" />
                    <span>إضافة</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">لا توجد منتجات مطابقة للبحث.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;