import React, { useState, useId } from 'react';
import { cn } from '../../utils/cn';

const Input = React.forwardRef(({
  className,
  type = "text",
  label,
  placeholder,
  error,
  disabled = false,
  required = false,
  suffix,
  value,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!value);
  const id = useId();
  
  const handleFocus = (e) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };
  
  const handleBlur = (e) => {
    setIsFocused(false);
    setHasValue(!!e.target.value);
    props.onBlur?.(e);
  };
  
  const handleChange = (e) => {
    setHasValue(!!e.target.value);
    props.onChange?.(e);
  };
  
  const isFloating = isFocused || hasValue || type === 'date' || type === 'datetime-local';
  
  return (
    <div className="relative">
      <div className="relative">
        <input
          id={id}
          ref={ref}
          type={type}
          value={value}
          className={cn(
            "w-full px-16 pt-24 pb-8 font-inter text-body bg-white border-2 rounded-button transition-all duration-200 focus:outline-none",
            "placeholder-transparent peer",
            error 
              ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200" 
              : "border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary-200",
            disabled && "bg-gray-50 cursor-not-allowed opacity-60",
            className
          )}
          placeholder={label || placeholder}
          disabled={disabled}
          required={required}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          {...props}
        />
        
        {/* Floating Label */}
        {label && (
          <label
            htmlFor={id}
            className={cn(
              "absolute left-16 font-inter font-medium transition-all duration-200 cursor-text",
              isFloating 
                ? "top-8 text-xs text-gray-600" 
                : "top-16 text-body text-gray-500",
              error && isFloating && "text-red-600",
              disabled && "cursor-not-allowed",
              "peer-focus:top-8 peer-focus:text-xs peer-focus:text-primary"
            )}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        {/* Suffix */}
        {suffix && (
          <div className="absolute right-16 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium">
            {suffix}
          </div>
        )}
      </div>
      
      {/* Error Message */}
      {error && (
        <p className="mt-4 text-sm text-red-600 font-inter animate-slide-up">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;