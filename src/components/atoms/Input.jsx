import React from 'react';

const Input = React.forwardRef(({ 
  className = '', 
  error = false, 
  type = 'text', 
  label, 
  id, 
  ...props 
}, ref) => {
  const baseStyles = 'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent';
  const errorStyles = error ? 'border-error' : 'border-gray-300';

  return (
    <input
      ref={ref}
      type={type}
      id={id || props.name} // Use id from props or fallback to name
      className={`${baseStyles} ${errorStyles} ${className}`}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export default Input;