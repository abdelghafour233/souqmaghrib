import React, { useState } from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { ArrowRight, ShoppingCart, Sparkles, Send } from 'lucide-react';
import { askAiAssistant } from '../services/geminiService';

interface ProductDetailsProps {
  product?: Product;
  navigate: (path: string) => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, navigate }) => {
  const { addToCart } = useCart();
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">المنتج غير موجود</h2>
        <button onClick={() => navigate('/')} className="mt-4 text-primary underline">
          العودة للرئيسية
        </button>
      </div>
    );
  }

  const handleAskAi = async () => {
      if(!aiQuestion.trim()) return;
      setLoadingAi(true);
      const context = `المنتج: ${product.name}, السعر: ${product.price} درهم, الوصف: ${product.description}`;
      const answer = await askAiAssistant(aiQuestion, context);
      setAiAnswer(answer);
      setLoadingAi(false);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        onClick={() => navigate('/')}
        className="flex items-center text-gray-500 hover:text-primary mb-6 transition"
      >
        <ArrowRight className="h-5 w-5 ml-2" />
        العودة للتسوق
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-2xl shadow-lg overflow-hidden p-6 md:p-8">
        <div className="h-96 md:h-[500px] bg-gray-100 rounded-xl overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition duration-500"
          />
        </div>

        <div className="flex flex-col">
          <span className="text-sm font-semibold text-primary uppercase tracking-wide bg-green-50 w-fit px-3 py-1 rounded-full mb-4">
            {product.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {product.name}
          </h1>
          <p className="text-3xl font-bold text-secondary mb-6">
            {product.price.toLocaleString()} <span className="text-lg font-normal text-gray-500">د.م.</span>
          </p>
          
          <div className="prose prose-sm text-gray-600 mb-8 leading-relaxed">
            {product.description}
          </div>

          <div className="mt-auto">
            <button
              onClick={() => addToCart(product)}
              className="w-full flex items-center justify-center bg-primary text-white py-4 px-8 rounded-xl hover:bg-green-700 transition duration-300 text-lg font-bold shadow-lg shadow-green-200"
            >
              <ShoppingCart className="ml-2 h-6 w-6" />
              إضافة إلى السلة
            </button>
          </div>

          {/* AI Section */}
          <div className="mt-8 pt-8 border-t border-gray-100">
             <div className="bg-indigo-50 p-4 rounded-xl">
                <h3 className="flex items-center font-bold text-indigo-900 mb-2">
                    <Sparkles className="h-5 w-5 ml-2 text-indigo-600"/>
                    لديك سؤال عن هذا المنتج؟
                </h3>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={aiQuestion}
                        onChange={(e) => setAiQuestion(e.target.value)}
                        placeholder="اسأل المساعد الذكي..."
                        className="flex-1 border border-indigo-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                        onKeyDown={(e) => e.key === 'Enter' && handleAskAi()}
                    />
                    <button 
                        onClick={handleAskAi}
                        disabled={loadingAi}
                        className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                        <Send className="h-4 w-4" />
                    </button>
                </div>
                {loadingAi && <p className="text-xs text-indigo-500 mt-2 animate-pulse">جاري التفكير...</p>}
                {aiAnswer && (
                    <div className="mt-3 p-3 bg-white rounded-lg border border-indigo-100 text-sm text-gray-700">
                        <strong>المساعد: </strong> {aiAnswer}
                    </div>
                )}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetails;