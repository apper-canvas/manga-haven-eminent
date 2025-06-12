import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import { motion } from 'framer-motion';

const ErrorMessage = ({ message, iconName = 'AlertCircle', className = '' }) => {
  if (!message) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`text-center py-8 flex flex-col items-center justify-center ${className}`}
    >
      <ApperIcon name={iconName} size={48} className="text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
      <p className="text-gray-500 mb-4">{message}</p>
    </motion.div>
  );
};

export default ErrorMessage;