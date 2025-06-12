import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const OrderConfirmation = ({ order }) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
        
        <Text as="h1" variant="h2" className="mb-4" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          ORDER CONFIRMED!
        </Text>
        
        <Text variant="lead" className="mb-2" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
          Thank you for your order! Your manga is on its way.
        </Text>
        
        <Text variant="body" className="text-gray-500" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
          Order #{order.id}
        </Text>
      </motion.div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-lg shadow-sm p-8 mb-8"
      >
        <Text as="h2" variant="h3" className="mb-6">Order Details</Text>
        
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
                <Text className="font-medium">Manga Item #{item.mangaId}</Text>
                <Text variant="small" className="text-gray-500 ml-2">× {item.quantity}</Text>
              </div>
              <Text className="font-medium">${(item.price * item.quantity).toFixed(2)}</Text>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="border-t pt-4"
        >
          <div className="flex justify-between items-center text-lg font-bold">
            <Text>Total Paid</Text>
            <Text className="text-primary">${order.total.toFixed(2)}</Text>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="bg-white rounded-lg shadow-sm p-8 mb-8"
      >
        <Text as="h3" variant="h4" className="mb-4">Shipping Information</Text>
        <div className="text-gray-700">
          <Text className="font-medium">
            {order.shipping.firstName} {order.shipping.lastName}
          </Text>
          <Text>{order.shipping.address}</Text>
          <Text>
            {order.shipping.city}, {order.shipping.state} {order.shipping.zip}
          </Text>
          <Text>{order.shipping.country}</Text>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.0 }}
        className="bg-accent/10 border border-accent/20 rounded-lg p-6 mb-8"
      >
        <div className="flex items-start space-x-3">
          <ApperIcon name="Truck" size={24} className="text-accent flex-shrink-0 mt-1" />
          <div>
            <Text as="h3" variant="h4" className="font-semibold text-secondary mb-2">What's Next?</Text>
            <ul className="text-gray-700 space-y-1 text-sm">
              <li>• You'll receive an email confirmation shortly</li>
              <li>• Your order will be processed within 1-2 business days</li>
              <li>• Estimated delivery: 3-7 business days</li>
              <li>• You'll receive tracking information once shipped</li>
            </ul>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Button
          onClick={() => navigate('/browse')}
          variant="primary"
          size="md"
          className="space-x-2"
        >
          <ApperIcon name="ShoppingBag" size={20} />
          <span>Continue Shopping</span>
        </Button>
        
        <Button
          onClick={() => navigate('/')}
          variant="outline"
          size="md"
          className="space-x-2"
        >
          <ApperIcon name="Home" size={20} />
          <span>Return Home</span>
        </Button>
      </motion.div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-center mt-12 text-gray-500"
      >
        <Text variant="small">
          Questions about your order? 
          <Button variant="ghost" size="sm" className="text-primary hover:text-red-600 ml-1 font-medium">
            Contact Support
          </Button>
        </Text>
      </motion.div>
    </div>
  );
};

export default OrderConfirmation;