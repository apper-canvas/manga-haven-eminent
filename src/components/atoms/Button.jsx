import React from 'react';
import { motion } from 'framer-motion';

const Button = React.forwardRef(({ 
  children, 
  className = '', 
  variant = 'primary', // 'primary', 'secondary', 'outline', 'ghost'
  size = 'md', // 'sm', 'md', 'lg'
  disabled = false, 
  onClick, 
  type = 'button',
  whileHover,
  whileTap,
  ...props 
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200';

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-red-600',
    secondary: 'bg-secondary text-white hover:bg-gray-700',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
    ghost: 'text-gray-500 hover:text-primary hover:bg-gray-100',
    success: 'bg-success text-white hover:bg-green-700',
    disabled: 'bg-gray-300 text-gray-500 cursor-not-allowed',
  };

  const currentVariantStyle = disabled ? variantStyles.disabled : variantStyles[variant];
  const currentSizeStyle = sizeStyles[size];

  // Filter out non-DOM props before passing to the underlying button element
  const domProps = { ...props };
  delete domProps.whileHover;
  delete domProps.whileTap;
  delete domProps.variant;
  delete domProps.size;

  return (
    <motion.button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${currentVariantStyle} ${currentSizeStyle} ${className}`}
      whileHover={disabled ? {} : (whileHover || { scale: 1.02 })}
      whileTap={disabled ? {} : (whileTap || { scale: 0.98 })}
      {...domProps}
    >
      {children}
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;