import React from 'react';
import { motion } from 'framer-motion';

const Text = React.forwardRef(({ 
  children, 
  as = 'p', 
  className = '', 
  variant = 'body', // 'h1', 'h2', 'h3', 'lead', 'body', 'small'
  ...props 
}, ref) => {
  const Component = motion[as] || as;

  const variantStyles = {
    h1: 'font-display text-4xl md:text-6xl font-bold text-secondary',
    h2: 'font-display text-3xl md:text-4xl font-bold text-secondary',
    h3: 'font-display text-xl md:text-2xl font-bold text-secondary',
    h4: 'font-semibold text-lg text-secondary',
    lead: 'text-xl text-gray-600',
    body: 'text-base text-gray-700',
    small: 'text-sm text-gray-500',
    caption: 'text-xs text-gray-400',
  };

  return (
    <Component
      ref={ref}
      className={`${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
});

Text.displayName = 'Text';

export default Text;