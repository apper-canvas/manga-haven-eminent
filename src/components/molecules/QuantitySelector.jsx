import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const QuantitySelector = ({ quantity, onQuantityChange, max = 10, min = 1, disabled = false }) => {
  return (
    <div className="flex items-center border border-gray-300 rounded-lg">
      <Button
        onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
        disabled={quantity <= min || disabled}
        variant="ghost"
        size="sm"
        className="p-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ApperIcon name="Minus" size={14} />
      </Button>
      <span className="px-3 py-2 min-w-[3rem] text-center">
        {quantity}
      </span>
      <Button
        onClick={() => onQuantityChange(Math.min(max, quantity + 1))}
        disabled={quantity >= max || disabled}
        variant="ghost"
        size="sm"
        className="p-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ApperIcon name="Plus" size={14} />
      </Button>
    </div>
  );
};

export default QuantitySelector;