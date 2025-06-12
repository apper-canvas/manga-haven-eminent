import React from 'react';
import { motion } from 'framer-motion';
import FormField from '@/components/molecules/FormField';
import Text from '@/components/atoms/Text';

const CheckoutForm = ({ formData, handleInputChange, errors, sameAsShipping, loading = false }) => {
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

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ x: -30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <Text as="h2" variant="h3" className="mb-6">
          Billing Information
        </Text>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="First Name"
            name="billingFirstName"
            value={formData.billingFirstName}
            onChange={(e) => handleInputChange('billingFirstName', e.target.value)}
            error={errors.billingFirstName}
            required
          />
          <FormField
            label="Last Name"
            name="billingLastName"
            value={formData.billingLastName}
            onChange={(e) => handleInputChange('billingLastName', e.target.value)}
            error={errors.billingLastName}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <FormField
            label="Email"
            name="billingEmail"
            type="email"
            value={formData.billingEmail}
            onChange={(e) => handleInputChange('billingEmail', e.target.value)}
            error={errors.billingEmail}
            placeholder="john@example.com"
            required
          />
          <FormField
            label="Phone"
            name="billingPhone"
            type="tel"
            value={formData.billingPhone}
            onChange={(e) => handleInputChange('billingPhone', e.target.value)}
            placeholder="(555) 123-4567"
          />
        </div>

        <div className="mt-4">
          <FormField
            label="Address"
            name="billingAddress"
            value={formData.billingAddress}
            onChange={(e) => handleInputChange('billingAddress', e.target.value)}
            error={errors.billingAddress}
            placeholder="123 Main Street"
            required
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <FormField
            label="City"
            name="billingCity"
            value={formData.billingCity}
            onChange={(e) => handleInputChange('billingCity', e.target.value)}
            error={errors.billingCity}
            placeholder="New York"
            required
          />
          <FormField
            label="State"
            name="billingState"
            value={formData.billingState}
            onChange={(e) => handleInputChange('billingState', e.target.value)}
            error={errors.billingState}
            placeholder="NY"
            required
          />
          <FormField
            label="ZIP Code"
            name="billingZip"
            value={formData.billingZip}
            onChange={(e) => handleInputChange('billingZip', e.target.value)}
            error={errors.billingZip}
            placeholder="10001"
            required
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ x: -30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <Text as="h2" variant="h3" className="mb-6">
          Shipping Information
        </Text>
        
        <div className="mb-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={sameAsShipping}
              onChange={(e) => handleInputChange('sameAsShipping', e.target.checked)}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <Text variant="small" className="font-medium">Same as billing address</Text>
          </label>
        </div>

        {!sameAsShipping && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="First Name"
                name="shippingFirstName"
                value={formData.shippingFirstName}
                onChange={(e) => handleInputChange('shippingFirstName', e.target.value)}
                error={errors.shippingFirstName}
                required
              />
              <FormField
                label="Last Name"
                name="shippingLastName"
                value={formData.shippingLastName}
                onChange={(e) => handleInputChange('shippingLastName', e.target.value)}
                error={errors.shippingLastName}
                required
              />
            </div>

            <div>
              <FormField
                label="Address"
                name="shippingAddress"
                value={formData.shippingAddress}
                onChange={(e) => handleInputChange('shippingAddress', e.target.value)}
                error={errors.shippingAddress}
                required
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <FormField
                label="City"
                name="shippingCity"
                value={formData.shippingCity}
                onChange={(e) => handleInputChange('shippingCity', e.target.value)}
                error={errors.shippingCity}
                required
              />
              <FormField
                label="State"
                name="shippingState"
                value={formData.shippingState}
                onChange={(e) => handleInputChange('shippingState', e.target.value)}
                error={errors.shippingState}
                required
              />
              <FormField
                label="ZIP Code"
                name="shippingZip"
                value={formData.shippingZip}
                onChange={(e) => handleInputChange('shippingZip', e.target.value)}
                error={errors.shippingZip}
                required
              />
            </div>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ x: -30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <Text as="h2" variant="h3" className="mb-6">
          Payment Information
        </Text>
        
        <div className="space-y-4">
          <FormField
            label="Card Number"
            name="cardNumber"
            type="text"
            value={formatCardNumber(formData.cardNumber)}
            onChange={(e) => handleInputChange('cardNumber', e.target.value)}
            error={errors.cardNumber}
            placeholder="1234 5678 9012 3456"
            maxLength="19"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Expiry Date"
              name="expiryDate"
              type="text"
              value={formatExpiryDate(formData.expiryDate)}
              onChange={(e) => handleInputChange('expiryDate', e.target.value)}
              error={errors.expiryDate}
              placeholder="MM/YY"
              maxLength="5"
              required
            />
            <FormField
              label="CVV"
              name="cvv"
              type="text"
              value={formData.cvv}
              onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
              error={errors.cvv}
              placeholder="123"
              maxLength="4"
              required
            />
          </div>

          <FormField
            label="Cardholder Name"
            name="cardName"
            type="text"
            value={formData.cardName}
            onChange={(e) => handleInputChange('cardName', e.target.value)}
            error={errors.cardName}
            placeholder="John Doe"
            required
          />
        </div>
      </motion.div>
    </div>
  );
};

export default CheckoutForm;