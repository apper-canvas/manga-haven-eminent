import React from 'react';
import Input from '@/components/atoms/Input';
import Text from '@/components/atoms/Text';

const FormField = React.forwardRef(({ 
  label, 
  id, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  error, 
  className = '', 
  ...props 
}, ref) => {
  const inputId = id || name;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-2">
          {label} {props.required && <span className="text-error">*</span>}
        </label>
      )}
      <Input
        ref={ref}
        id={inputId}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        error={!!error}
        {...props}
      />
      {error && (
        <Text variant="small" className="text-error mt-1">
          {error}
        </Text>
      )}
    </div>
  );
});

FormField.displayName = 'FormField';

export default FormField;