import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { cartService, mangaService } from '../services';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [cartDetails, setCartDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState({});

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await cartService.getAll();
      setCartItems(items);

      // Get manga details for each cart item
      const details = await Promise.all(
        items.map(async (item) => {
          const manga = await mangaService.getById(item.mangaId);
          return { ...item, manga };
        })
      );
      setCartDetails(details);
    } catch (err) {
      setError(err.message || 'Failed to load cart');
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (mangaId, newQuantity) => {
    if (newQuantity < 1) return;

    setUpdating(prev => ({ ...prev, [mangaId]: true }));
    try {
      // Find the cart item
      const cartItem = cartItems.find(item => item.mangaId === mangaId);
      if (!cartItem) return;

      // Update the quantity
      await cartService.update(cartItem.id, { ...cartItem, quantity: newQuantity });
      
      // Reload cart
      await loadCart();
      toast.success('Cart updated');
    } catch (error) {
      toast.error('Failed to update cart');
      console.error('Update cart error:', error);
    } finally {
      setUpdating(prev => ({ ...prev, [mangaId]: false }));
    }
  };

  const removeItem = async (mangaId) => {
    setUpdating(prev => ({ ...prev, [mangaId]: true }));
    try {
      // Find the cart item
      const cartItem = cartItems.find(item => item.mangaId === mangaId);
      if (!cartItem) return;

      await cartService.delete(cartItem.id);
      await loadCart();
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
      console.error('Remove item error:', error);
    } finally {
      setUpdating(prev => ({ ...prev, [mangaId]: false }));
    }
  };

  const clearCart = async () => {
    if (!window.confirm('Are you sure you want to clear your cart?')) return;

    setLoading(true);
    try {
      // Delete all cart items
      await Promise.all(cartItems.map(item => cartService.delete(item.id)));
      setCartItems([]);
      setCartDetails([]);
      toast.success('Cart cleared');
    } catch (error) {
      toast.error('Failed to clear cart');
      console.error('Clear cart error:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSubtotal = () => {
    return cartDetails.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateTax = (subtotal) => {
    return subtotal * 0.08; // 8% tax
  };

  const calculateShipping = (subtotal) => {
    return subtotal > 50 ? 0 : 5.99; // Free shipping over $50
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    const shipping = calculateShipping(subtotal);
    return subtotal + tax + shipping;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="shimmer h-8 w-32 mb-8 rounded"></div>
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex gap-4">
                  <div className="shimmer w-16 h-20 rounded"></div>
                  <div className="flex-1 space-y-3">
                    <div className="shimmer h-4 w-3/4 rounded"></div>
                    <div className="shimmer h-4 w-1/2 rounded"></div>
                    <div className="shimmer h-8 w-32 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="AlertCircle" size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to Load Cart</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadCart}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Try Again
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between mb-8"
        >
          <h1 className="font-display text-2xl md:text-3xl font-bold text-secondary">
            Shopping Cart
          </h1>
          {cartDetails.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearCart}
              className="text-gray-500 hover:text-primary transition-colors text-sm"
            >
              Clear Cart
            </motion.button>
          )}
        </motion.div>

        {cartDetails.length === 0 ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-16"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <ApperIcon name="ShoppingCart" size={64} className="text-gray-300 mx-auto" />
            </motion.div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Your cart is empty</h3>
            <p className="mt-2 text-gray-500">
              Discover amazing manga and add them to your cart
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/browse')}
              className="mt-6 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
            >
              Start Shopping
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {cartDetails.map((item) => (
                  <motion.div
                    key={item.mangaId}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex gap-4">
                      {/* Manga Cover */}
                      <div 
                        className="w-16 h-20 bg-gray-100 rounded cursor-pointer overflow-hidden flex-shrink-0"
                        onClick={() => navigate(`/manga/${item.manga.id}`)}
                      >
                        <img
                          src={item.manga.coverImage}
                          alt={item.manga.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                          onError={(e) => {
                            e.target.src = `https://via.placeholder.com/64x80/f0f0f0/666?text=${encodeURIComponent(item.manga.title)}`;
                          }}
                        />
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 
                              className="font-semibold text-secondary hover:text-primary cursor-pointer break-words"
                              onClick={() => navigate(`/manga/${item.manga.id}`)}
                            >
                              {item.manga.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Vol. {item.manga.volume} • {item.manga.author}
                            </p>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeItem(item.mangaId)}
                            disabled={updating[item.mangaId]}
                            className="text-gray-400 hover:text-primary transition-colors p-1"
                          >
                            {updating[item.mangaId] ? (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              >
                                <ApperIcon name="Loader2" size={16} />
                              </motion.div>
                            ) : (
                              <ApperIcon name="Trash2" size={16} />
                            )}
                          </motion.button>
                        </div>

                        <div className="flex items-center justify-between">
                          {/* Quantity Controls */}
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.mangaId, item.quantity - 1)}
                              disabled={item.quantity <= 1 || updating[item.mangaId]}
                              className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <ApperIcon name="Minus" size={14} />
                            </button>
                            <span className="px-3 py-2 min-w-[3rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.mangaId, item.quantity + 1)}
                              disabled={item.quantity >= 10 || updating[item.mangaId]}
                              className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <ApperIcon name="Plus" size={14} />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <div className="font-semibold text-primary">
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-500">
                              ${item.price.toFixed(2)} each
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-white rounded-lg shadow-sm p-6 h-fit sticky top-8"
            >
              <h3 className="font-display text-xl font-bold text-secondary mb-6">
                Order Summary
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({cartDetails.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {calculateShipping(calculateSubtotal()) === 0 ? (
                      <span className="text-success">FREE</span>
                    ) : (
                      `$${calculateShipping(calculateSubtotal()).toFixed(2)}`
                    )}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${calculateTax(calculateSubtotal()).toFixed(2)}</span>
                </div>
                
                <hr className="my-4" />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">${calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              {calculateShipping(calculateSubtotal()) > 0 && (
                <div className="bg-accent/10 text-accent text-sm p-3 rounded-lg mb-4">
                  <ApperIcon name="Truck" size={16} className="inline mr-2" />
                  Add ${(50 - calculateSubtotal()).toFixed(2)} more for free shipping!
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/checkout')}
                className="w-full bg-primary text-white py-4 rounded-lg font-semibold text-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
              >
                <ApperIcon name="CreditCard" size={20} />
                <span>Proceed to Checkout</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/browse')}
                className="w-full mt-3 border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:border-primary hover:text-primary transition-colors"
              >
                Continue Shopping
              </motion.button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;