import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import LoadingSkeleton from '@/components/organisms/LoadingSkeleton';
import CheckoutForm from '@/components/organisms/CheckoutForm';
import OrderSummaryCard from '@/components/molecules/OrderSummaryCard';
import { cartService, mangaService, orderService } from '@/services';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cartDetails, setCartDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    billingFirstName: '', billingLastName: '', billingEmail: '', billingPhone: '',
    billingAddress: '', billingCity: '', billingState: '', billingZip: '', billingCountry: 'US',
    sameAsShipping: true,
    shippingFirstName: '', shippingLastName: '', shippingAddress: '',
    shippingCity: '', shippingState: '', shippingZip: '', shippingCountry: 'US',
    cardNumber: '', expiryDate: '', cvv: '', cardName: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    setLoading(true);
    try {
      const items = await cartService.getAll();
      
      if (items.length === 0) {
        toast.info('Your cart is empty, redirecting to cart.');
        navigate('/cart');
        return;
      }

      const details = await Promise.all(
        items.map(async (item) => {
          const manga = await mangaService.getById(item.mangaId);
          if (!manga) {
            console.warn(`Manga with ID ${item.mangaId} not found.`);
            return { ...item, manga: { title: 'Unknown Manga', coverImage: '', volume: 'N/A', author: 'N/A', price: item.price } };
          }
          return { ...item, manga };
        })
      );
      setCartDetails(details);
    } catch (error) {
      toast.error('Failed to load cart items');
      console.error('Failed to load cart items for checkout:', error);
      navigate('/cart');
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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.billingFirstName.trim()) newErrors.billingFirstName = 'First name is required';
    if (!formData.billingLastName.trim()) newErrors.billingLastName = 'Last name is required';
    if (!formData.billingEmail.trim()) newErrors.billingEmail = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.billingEmail)) newErrors.billingEmail = 'Email is invalid';
    if (!formData.billingAddress.trim()) newErrors.billingAddress = 'Address is required';
    if (!formData.billingCity.trim()) newErrors.billingCity = 'City is required';
    if (!formData.billingState.trim()) newErrors.billingState = 'State is required';
    if (!formData.billingZip.trim()) newErrors.billingZip = 'ZIP code is required';

    if (!formData.sameAsShipping) {
      if (!formData.shippingFirstName.trim()) newErrors.shippingFirstName = 'First name is required';
      if (!formData.shippingLastName.trim()) newErrors.shippingLastName = 'Last name is required';
      if (!formData.shippingAddress.trim()) newErrors.shippingAddress = 'Address is required';
      if (!formData.shippingCity.trim()) newErrors.shippingCity = 'City is required';
      if (!formData.shippingState.trim()) newErrors.shippingState = 'State is required';
      if (!formData.shippingZip.trim()) newErrors.shippingZip = 'ZIP code is required';
    }

    if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
    else if (formData.cardNumber.replace(/\s/g, '').length < 16) newErrors.cardNumber = 'Card number is invalid';
    if (!formData.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required';
    else if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(formData.expiryDate)) newErrors.expiryDate = 'Expiry date must be MM/YY';
    if (!formData.cvv.trim()) newErrors.cvv = 'CVV is required';
    else if (formData.cvv.length < 3) newErrors.cvv = 'CVV is invalid';
    if (!formData.cardName.trim()) newErrors.cardName = 'Cardholder name is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please correct the errors in the form');
      return;
    }

    setSubmitting(true);
    try {
      const orderData = {
        items: cartDetails.map(item => ({
          mangaId: item.mangaId,
          quantity: item.quantity,
          price: item.price
        })),
        total: calculateTotal(),
        billing: {
          firstName: formData.billingFirstName,
          lastName: formData.billingLastName,
          email: formData.billingEmail,
          phone: formData.billingPhone,
          address: formData.billingAddress,
          city: formData.billingCity,
          state: formData.billingState,
          zip: formData.billingZip,
          country: formData.billingCountry
        },
        shipping: formData.sameAsShipping ? {
          firstName: formData.billingFirstName,
          lastName: formData.billingLastName,
          address: formData.billingAddress,
          city: formData.billingCity,
          state: formData.billingState,
          zip: formData.billingZip,
          country: formData.billingCountry
        } : {
          firstName: formData.shippingFirstName,
          lastName: formData.shippingLastName,
          address: formData.shippingAddress,
          city: formData.shippingCity,
          state: formData.shippingState,
          zip: formData.shippingZip,
          country: formData.shippingCountry
        },
        status: 'confirmed'
      };

      const order = await orderService.create(orderData);

      await Promise.all(cartDetails.map(item => cartService.delete(item.id)));

      navigate('/order-success', { state: { orderId: order.id } });
      
    } catch (error) {
      toast.error('Failed to process order. Please try again.');
      console.error('Checkout error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSkeleton type="checkout" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <Text as="h1" variant="h2">
            Checkout
          </Text>
          <div className="flex items-center space-x-2 text-sm text-gray-500 mt-2">
            <Button onClick={() => navigate('/cart')} variant="ghost" size="sm" className="hover:text-primary p-0">
              Cart
            </Button>
            <ApperIcon name="ChevronRight" size={16} />
            <Text variant="small" className="text-gray-900">Checkout</Text>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CheckoutForm 
            formData={formData}
            handleInputChange={handleInputChange}
            errors={errors}
            sameAsShipping={formData.sameAsShipping}
          />

          <OrderSummaryCard
            items={cartDetails}
            calculateSubtotal={calculateSubtotal}
            calculateTax={calculateTax}
            calculateShipping={calculateShipping}
            calculateTotal={calculateTotal}
            className="lg:sticky lg:top-8 h-fit"
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

            <Button
              type="submit"
              disabled={submitting}
              variant="primary"
              size="lg"
              className="w-full space-x-2"
            >
              {submitting ? (
                <>
                  <LoadingSpinner size={20} />
                  <span>Processing Order...</span>
                </>
              ) : (
                <>
                  <ApperIcon name="CreditCard" size={20} />
                  <span>Complete Order</span>
                </>
              )}
            </Button>

            <Text variant="caption" className="text-gray-500 text-center mt-4">
              Your payment information is secure and encrypted
            </Text>
          </OrderSummaryCard>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;