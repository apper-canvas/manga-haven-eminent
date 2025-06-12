import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import LoadingSkeleton from '@/components/organisms/LoadingSkeleton';
import ErrorMessage from '@/components/atoms/ErrorMessage';
import CartItemsList from '@/components/organisms/CartItemsList';
import OrderSummaryCard from '@/components/molecules/OrderSummaryCard';
import { cartService, mangaService } from '@/services';

const CartPage = () => {
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

      const details = await Promise.all(
        items.map(async (item) => {
          const manga = await mangaService.getById(item.mangaId);
          if (!manga) {
            // Handle case where manga details might not be found (e.g., deleted product)
            console.warn(`Manga with ID ${item.mangaId} not found.`);
            return { ...item, manga: { title: 'Unknown Manga', coverImage: '', volume: 'N/A', author: 'N/A', price: item.price } };
          }
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
      const cartItem = cartItems.find(item => item.mangaId === mangaId);
      if (!cartItem) {
        toast.error('Cart item not found.');
        return;
      };

      await cartService.update(cartItem.id, { ...cartItem, quantity: newQuantity });
      
      await loadCart(); // Reload cart to ensure consistency
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
      const cartItem = cartItems.find(item => item.mangaId === mangaId);
      if (!cartItem) {
        toast.error('Cart item not found for removal.');
        return;
      };

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
    return <LoadingSkeleton type="cart" />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ErrorMessage message={error}>
          <Button
            onClick={loadCart}
            variant="primary"
            size="md"
            className="mt-4"
          >
            Try Again
          </Button>
        </ErrorMessage>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between mb-8"
        >
          <Text as="h1" variant="h2">
            Shopping Cart
          </Text>
          {cartDetails.length > 0 && (
            <Button
              onClick={clearCart}
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-primary transition-colors"
            >
              Clear Cart
            </Button>
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
            <Text as="h3" variant="h4" className="mt-4">Your cart is empty</Text>
            <Text variant="body" className="mt-2 text-gray-500">
              Discover amazing manga and add them to your cart
            </Text>
            <Button
              onClick={() => navigate('/browse')}
              variant="primary"
              size="lg"
              className="mt-6"
            >
              Start Shopping
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <CartItemsList 
              cartDetails={cartDetails} 
              updateQuantity={updateQuantity} 
              removeItem={removeItem} 
              updating={updating} 
            />

            <OrderSummaryCard
              items={cartDetails}
              calculateSubtotal={calculateSubtotal}
              calculateTax={calculateTax}
              calculateShipping={calculateShipping}
              calculateTotal={calculateTotal}
              showCheckoutButton
              showContinueShoppingButton
              onProceedToCheckout={() => navigate('/checkout')}
              onContinueShopping={() => navigate('/browse')}
            >
                <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                    {cartDetails.map((item) => (
                        <div key={item.mangaId} className="flex gap-3">
                            <div className="w-12 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                <img
                                src={item.manga.coverImage}
                                alt={item.manga.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = `https://via.placeholder.com/48x64/f0f0f0/666?text=${encodeURIComponent(item.manga.title)}`;
                                }}
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <Text as="h4" variant="body" className="font-medium text-sm break-words">{item.manga.title}</Text>
                                <Text variant="caption">Vol. {item.manga.volume}</Text>
                                <div className="flex justify-between items-center mt-1">
                                    <Text variant="caption">Qty: {item.quantity}</Text>
                                    <Text variant="body" className="font-medium text-sm">${(item.price * item.quantity).toFixed(2)}</Text>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </OrderSummaryCard>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;