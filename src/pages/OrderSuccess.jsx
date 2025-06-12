import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '../components/ApperIcon';
import { orderService } from '../services';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const orderId = location.state?.orderId;

  useEffect(() => {
    if (!orderId) {
      navigate('/');
      return;
    }

    const loadOrder = async () => {
      try {
        const orderData = await orderService.getById(orderId);
        setOrder(orderData);
      } catch (error) {
        console.error('Failed to load order:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <ApperIcon name="Loader2" size={48} className="text-primary" />
        </motion.div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="AlertTriangle" size={48} className="text-warning mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Order Not Found</h3>
          <p className="text-gray-500 mb-4">We couldn't find your order details.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Return Home
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", duration: 0.5 }}
            className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <ApperIcon name="Check" size={40} className="text-white" />
          </motion.div>
          
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-display text-3xl md:text-4xl font-bold text-secondary mb-4"
          >
            ORDER CONFIRMED!
          </motion.h1>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-600 mb-2"
          >
            Thank you for your order! Your manga is on its way.
          </motion.p>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-500"
          >
            Order #{order.id}
          </motion.p>
        </motion.div>

        {/* Order Details */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-lg shadow-sm p-8 mb-8"
        >
          <h2 className="font-display text-xl font-bold text-secondary mb-6">Order Details</h2>
          
          {/* Order Items */}
          <div className="space-y-4 mb-6">
            {order.items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0"
              >
                <div>
                  <span className="font-medium">Manga Item #{item.mangaId}</span>
                  <span className="text-gray-500 ml-2">× {item.quantity}</span>
                </div>
                <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
              </motion.div>
            ))}
          </div>

          {/* Order Total */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="border-t pt-4"
          >
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total Paid</span>
              <span className="text-primary">${order.total.toFixed(2)}</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Shipping Information */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="bg-white rounded-lg shadow-sm p-8 mb-8"
        >
          <h3 className="font-display text-lg font-bold text-secondary mb-4">Shipping Information</h3>
          <div className="text-gray-700">
            <p className="font-medium">
              {order.shipping.firstName} {order.shipping.lastName}
            </p>
            <p>{order.shipping.address}</p>
            <p>
              {order.shipping.city}, {order.shipping.state} {order.shipping.zip}
            </p>
            <p>{order.shipping.country}</p>
          </div>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="bg-accent/10 border border-accent/20 rounded-lg p-6 mb-8"
        >
          <div className="flex items-start space-x-3">
            <ApperIcon name="Truck" size={24} className="text-accent flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-secondary mb-2">What's Next?</h3>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• You'll receive an email confirmation shortly</li>
                <li>• Your order will be processed within 1-2 business days</li>
                <li>• Estimated delivery: 3-7 business days</li>
                <li>• You'll receive tracking information once shipped</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/browse')}
            className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
          >
            <ApperIcon name="ShoppingBag" size={20} />
            <span>Continue Shopping</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="border-2 border-primary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors flex items-center justify-center space-x-2"
          >
            <ApperIcon name="Home" size={20} />
            <span>Return Home</span>
          </motion.button>
        </motion.div>

        {/* Contact Support */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center mt-12 text-gray-500"
        >
          <p className="text-sm">
            Questions about your order? 
            <button className="text-primary hover:text-red-600 ml-1 font-medium">
              Contact Support
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderSuccess;