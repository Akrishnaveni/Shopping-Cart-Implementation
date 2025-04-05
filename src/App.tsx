import React, { useState, useEffect } from 'react';
import { MinusCircle, PlusCircle } from 'lucide-react';

// Constants
const PRODUCTS = [
  { id: 1, name: "Laptop", price: 500 },
  { id: 2, name: "Smartphone", price: 300 },
  { id: 3, name: "Headphones", price: 100 },
  { id: 4, name: "Smartwatch", price: 150 },
];

const FREE_GIFT = { id: 99, name: "Wireless Mouse", price: 0 };
const THRESHOLD = 1000;

// Types
interface Product {
  id: number;
  name: string;
  price: number;
}

interface CartItem extends Product {
  quantity: number;
}

function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showGiftMessage, setShowGiftMessage] = useState(false);

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: number, change: number) => {
    setCart(prevCart => {
      const updatedCart = prevCart.map(item => {
        if (item.id === productId) {
          const newQuantity = Math.max(0, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(item => item.quantity > 0);
      return updatedCart;
    });
  };

  useEffect(() => {
    const subtotal = calculateSubtotal();
    const hasGift = cart.some(item => item.id === FREE_GIFT.id);

    if (subtotal >= THRESHOLD && !hasGift) {
      setCart(prev => [...prev, { ...FREE_GIFT, quantity: 1 }]);
      setShowGiftMessage(true);
    } else if (subtotal < THRESHOLD && hasGift) {
      setCart(prev => prev.filter(item => item.id !== FREE_GIFT.id));
      setShowGiftMessage(false);
    }
  }, [cart]);

  const subtotal = calculateSubtotal();
  const progress = Math.min((subtotal / THRESHOLD) * 100, 100);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Shopping Cart</h1>

        {/* Products Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {PRODUCTS.map(product => (
              <div key={product.id} className="p-4 border rounded-lg">
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-lg mb-2">₹{product.price}</p>
                <button
                  onClick={() => addToCart(product)}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Summary */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Cart Summary</h2>
          <div className="border rounded-lg p-4">
            <div className="flex justify-between mb-4">
              <span className="font-medium">Subtotal:</span>
              <span className="text-lg">₹{subtotal}</span>
            </div>

            {subtotal < THRESHOLD && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800 mb-2">
                  Add ₹{THRESHOLD - subtotal} more to get a FREE Wireless Mouse!
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 rounded-full h-2 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {showGiftMessage && (
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-800">
                  You get a free Wireless Mouse!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Cart Items */}
        {cart.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Cart Items</h2>
            <div className="space-y-4">
              {cart.map(item => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border rounded-lg p-4"
                >
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
                    </p>
                  </div>
                  {item.id === FREE_GIFT.id ? (
                    <span className="text-green-500 font-medium">FREE GIFT!</span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <MinusCircle size={20} />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 text-green-500 hover:bg-green-50 rounded"
                      >
                        <PlusCircle size={20} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {cart.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>Your cart is empty</p>
            <p className="text-sm">Add some products to see them here!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;