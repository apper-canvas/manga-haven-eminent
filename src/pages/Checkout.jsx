import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { cartService, mangaService, orderService } from '../services';

const Checkout = () => {
  const navigate = useNavigate();
  const [cartDetails, setCartDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Billing Information
    billingFirstName: '',
    billingLastName: '',
    billingEmail: '',
    billingPhone: '',
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZip: '',
    billingCountry: 'US',
    
    // Shipping Information
    sameAsShipping: true,
    shippingFirstName: '',
    shippingLastName: '',
    shippingAddress: '',
    shippingCity: '',
    shippingState: '',
    shippingZip: '',
    shippingCountry: 'US',
    
    // Payment Information
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
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
        navigate('/cart');
        return;
      }

      // Get manga details for each cart item
      const details = await Promise.all(
        items.map(async (item) => {
          const manga = await mangaService.getById(item.mangaId);
          return { ...item, manga };
        })
      );
      setCartDetails(details);
    } catch (error) {
      toast.error('Failed to load cart items');
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
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Billing validation
    if (!formData.billingFirstName.trim()) newErrors.billingFirstName = 'First name is required';
    if (!formData.billingLastName.trim()) newErrors.billingLastName = 'Last name is required';
    if (!formData.billingEmail.trim()) newErrors.billingEmail = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.billingEmail)) newErrors.billingEmail = 'Email is invalid';
    if (!formData.billingAddress.trim()) newErrors.billingAddress = 'Address is required';
    if (!formData.billingCity.trim()) newErrors.billingCity = 'City is required';
    if (!formData.billingState.trim()) newErrors.billingState = 'State is required';
    if (!formData.billingZip.trim()) newErrors.billingZip = 'ZIP code is required';

    // Shipping validation (if different from billing)
    if (!formData.sameAsShipping) {
      if (!formData.shippingFirstName.trim()) newErrors.shippingFirstName = 'First name is required';
      if (!formData.shippingLastName.trim()) newErrors.shippingLastName = 'Last name is required';
      if (!formData.shippingAddress.trim()) newErrors.shippingAddress = 'Address is required';
      if (!formData.shippingCity.trim()) newErrors.shippingCity = 'City is required';
      if (!formData.shippingState.trim()) newErrors.shippingState = 'State is required';
      if (!formData.shippingZip.trim()) newErrors.shippingZip = 'ZIP code is required';
    }

    // Payment validation
    if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
    else if (formData.cardNumber.replace(/\s/g, '').length < 16) newErrors.cardNumber = 'Card number is invalid';
    if (!formData.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required';
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
      // Create order
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

      // Clear cart
      await Promise.all(cartDetails.map(item => cartService.delete(item.id)));

      // Redirect to success page
      navigate('/order-success', { state: { orderId: order.id } });
      
    } catch (error) {
      toast.error('Failed to process order. Please try again.');
      console.error('Checkout error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="shimmer h-8 w-32 mb-8 rounded"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="shimmer h-64 rounded-lg"></div>
              <div className="shimmer h-64 rounded-lg"></div>
            </div>
            <div className="shimmer h-96 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <h1 className="font-display text-2xl md:text-3xl font-bold text-secondary">
            Checkout
          </h1>
          <div className="flex items-center space-x-2 text-sm text-gray-500 mt-2">
            <button onClick={() => navigate('/cart')} className="hover:text-primary">
              Cart
            </button>
            <ApperIcon name="ChevronRight" size={16} />
            <span className="text-gray-900">Checkout</span>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-8">
            {/* Billing Information */}
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <h2 className="font-display text-xl font-bold text-secondary mb-6">
                Billing Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.billingFirstName}
                    onChange={(e) => handleInputChange('billingFirstName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.billingFirstName ? 'border-error' : 'border-gray-300'
                    }`}
                    placeholder="John"
                  />
                  {errors.billingFirstName && (
                    <p className="text-error text-sm mt-1">{errors.billingFirstName}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.billingLastName}
                    onChange={(e) => handleInputChange('billingLastName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.billingLastName ? 'border-error' : 'border-gray-300'
                    }`}
                    placeholder="Doe"
                  />
                  {errors.billingLastName && (
                    <p className="text-error text-sm mt-1">{errors.billingLastName}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.billingEmail}
                    onChange={(e) => handleInputChange('billingEmail', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.billingEmail ? 'border-error' : 'border-gray-300'
                    }`}
                    placeholder="john@example.com"
                  />
                  {errors.billingEmail && (
                    <p className="text-error text-sm mt-1">{errors.billingEmail}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.billingPhone}
                    onChange={(e) => handleInputChange('billingPhone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  value={formData.billingAddress}
                  onChange={(e) => handleInputChange('billingAddress', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.billingAddress ? 'border-error' : 'border-gray-300'
                  }`}
                  placeholder="123 Main Street"
                />
                {errors.billingAddress && (
                  <p className="text-error text-sm mt-1">{errors.billingAddress}</p>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={formData.billingCity}
                    onChange={(e) => handleInputChange('billingCity', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.billingCity ? 'border-error' : 'border-gray-300'
                    }`}
                    placeholder="New York"
                  />
                  {errors.billingCity && (
                    <p className="text-error text-sm mt-1">{errors.billingCity}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    value={formData.billingState}
                    onChange={(e) => handleInputChange('billingState', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.billingState ? 'border-error' : 'border-gray-300'
                    }`}
                    placeholder="NY"
                  />
                  {errors.billingState && (
                    <p className="text-error text-sm mt-1">{errors.billingState}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    value={formData.billingZip}
                    onChange={(e) => handleInputChange('billingZip', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.billingZip ? 'border-error' : 'border-gray-300'
                    }`}
                    placeholder="10001"
                  />
                  {errors.billingZip && (
                    <p className="text-error text-sm mt-1">{errors.billingZip}</p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Shipping Information */}
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <h2 className="font-display text-xl font-bold text-secondary mb-6">
                Shipping Information
              </h2>
              
              <div className="mb-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.sameAsShipping}
                    onChange={(e) => handleInputChange('sameAsShipping', e.target.checked)}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm font-medium">Same as billing address</span>
                </label>
              </div>

              {!formData.sameAsShipping && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={formData.shippingFirstName}
                        onChange={(e) => handleInputChange('shippingFirstName', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                          errors.shippingFirstName ? 'border-error' : 'border-gray-300'
                        }`}
                      />
                      {errors.shippingFirstName && (
                        <p className="text-error text-sm mt-1">{errors.shippingFirstName}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={formData.shippingLastName}
                        onChange={(e) => handleInputChange('shippingLastName', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                          errors.shippingLastName ? 'border-error' : 'border-gray-300'
                        }`}
                      />
                      {errors.shippingLastName && (
                        <p className="text-error text-sm mt-1">{errors.shippingLastName}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      value={formData.shippingAddress}
                      onChange={(e) => handleInputChange('shippingAddress', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.shippingAddress ? 'border-error' : 'border-gray-300'
                      }`}
                    />
                    {errors.shippingAddress && (
                      <p className="text-error text-sm mt-1">{errors.shippingAddress}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={formData.shippingCity}
                        onChange={(e) => handleInputChange('shippingCity', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                          errors.shippingCity ? 'border-error' : 'border-gray-300'
                        }`}
                      />
                      {errors.shippingCity && (
                        <p className="text-error text-sm mt-1">{errors.shippingCity}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        value={formData.shippingState}
                        onChange={(e) => handleInputChange('shippingState', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                          errors.shippingState ? 'border-error' : 'border-gray-300'
                        }`}
                      />
                      {errors.shippingState && (
                        <p className="text-error text-sm mt-1">{errors.shippingState}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        value={formData.shippingZip}
                        onChange={(e) => handleInputChange('shippingZip', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                          errors.shippingZip ? 'border-error' : 'border-gray-300'
                        }`}
                      />
                      {errors.shippingZip && (
                        <p className="text-error text-sm mt-1">{errors.shippingZip}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Payment Information */}
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <h2 className="font-display text-xl font-bold text-secondary mb-6">
                Payment Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number *
                  </label>
                  <input
                    type="text"
                    value={formData.cardNumber}
                    onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.cardNumber ? 'border-error' : 'border-gray-300'
                    }`}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                  />
                  {errors.cardNumber && (
                    <p className="text-error text-sm mt-1">{errors.cardNumber}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date *
                    </label>
                    <input
                      type="text"
                      value={formData.expiryDate}
                      onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.expiryDate ? 'border-error' : 'border-gray-300'
                      }`}
                      placeholder="MM/YY"
                      maxLength="5"
                    />
                    {errors.expiryDate && (
                      <p className="text-error text-sm mt-1">{errors.expiryDate}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV *
                    </label>
                    <input
                      type="text"
                      value={formData.cvv}
                      onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.cvv ? 'border-error' : 'border-gray-300'
                      }`}
                      placeholder="123"
                      maxLength="4"
                    />
                    {errors.cvv && (
                      <p className="text-error text-sm mt-1">{errors.cvv}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cardholder Name *
                  </label>
                  <input
                    type="text"
                    value={formData.cardName}
                    onChange={(e) => handleInputChange('cardName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.cardName ? 'border-error' : 'border-gray-300'
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.cardName && (
                    <p className="text-error text-sm mt-1">{errors.cardName}</p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="lg:sticky lg:top-8 h-fit"
          >
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="font-display text-xl font-bold text-secondary mb-6">
                Order Summary
              </h2>

              {/* Cart Items */}
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
                      <h4 className="font-medium text-sm break-words">{item.manga.title}</h4>
                      <p className="text-xs text-gray-600">Vol. {item.manga.volume}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-600">Qty: {item.quantity}</span>
                        <span className="font-medium text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Totals */}
              <div className="space-y-3 mb-6 border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
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
                
                <hr />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">${calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={submitting}
                className="w-full bg-primary text-white py-4 rounded-lg font-semibold text-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {submitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <ApperIcon name="Loader2" size={20} />
                    </motion.div>
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <ApperIcon name="CreditCard" size={20} />
                    <span>Complete Order</span>
                  </>
                )}
              </motion.button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Your payment information is secure and encrypted
              </p>
            </div>
          </motion.div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;