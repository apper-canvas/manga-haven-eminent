import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const OrderSummaryCard = ({ 
  items, 
  calculateSubtotal, 
  calculateTax, 
  calculateShipping, 
  calculateTotal,
  showCheckoutButton = false,
  showContinueShoppingButton = false,
  onProceedToCheckout,
  onContinueShopping,
  children // For additional content like specific item lists
}) => {
  const subtotal = calculateSubtotal();
  const tax = calculateTax(subtotal);
  const shipping = calculateShipping(subtotal);
  const total = calculateTotal();

  return (
    <motion.div
      initial={{ x: 30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="bg-white rounded-lg shadow-sm p-6 h-fit sticky top-8"
    >
      <Text as="h3" variant="h3" className="mb-6">
        Order Summary
      </Text>

      {children} {/* This allows passing in the list of cart items */}

      <div className="space-y-3 mb-6 border-t pt-4">
        <div className="flex justify-between">
          <Text variant="body" className="text-gray-600">Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</Text>
          <Text className="font-medium">${subtotal.toFixed(2)}</Text>
        </div>
        
        <div className="flex justify-between">
          <Text variant="body" className="text-gray-600">Shipping</Text>
          <Text className="font-medium">
            {shipping === 0 ? (
              <span className="text-success">FREE</span>
            ) : (
              `$${shipping.toFixed(2)}`
            )}
          </Text>
        </div>
        
        <div className="flex justify-between">
          <Text variant="body" className="text-gray-600">Tax</Text>
          <Text className="font-medium">${tax.toFixed(2)}</Text>
        </div>
        
        <hr className="my-4" />
        
        <div className="flex justify-between text-lg font-bold">
          <Text>Total</Text>
          <Text className="text-primary">${total.toFixed(2)}</Text>
        </div>
      </div>

      {shipping > 0 && (
        <div className="bg-accent/10 text-accent text-sm p-3 rounded-lg mb-4">
          <ApperIcon name="Truck" size={16} className="inline mr-2" />
          Add ${(50 - subtotal).toFixed(2)} more for free shipping!
        </div>
      )}

      {showCheckoutButton && (
        <Button
          onClick={onProceedToCheckout}
          variant="primary"
          size="lg"
          className="w-full space-x-2"
        >
          <ApperIcon name="CreditCard" size={20} />
          <span>Proceed to Checkout</span>
        </Button>
      )}

      {showContinueShoppingButton && (
        <Button
          onClick={onContinueShopping}
          variant="outline"
          className="w-full mt-3"
        >
          Continue Shopping
        </Button>
      )}
    </motion.div>
  );
};

export default OrderSummaryCard;