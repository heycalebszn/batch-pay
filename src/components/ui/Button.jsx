import React from 'react';
import { cn } from '../../utils/cn';

const Button = React.forwardRef(({
  className,
  variant = "primary",
  size = "medium",
  children,
  disabled = false,
  loading = false,
  ...props
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-inter font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-button";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-600 focus:ring-primary-500 active:bg-primary-700",
    secondary: "border-2 border-primary text-primary bg-transparent hover:bg-primary-50 focus:ring-primary-500 active:bg-primary-100",
    ghost: "text-primary bg-transparent hover:bg-primary-50 focus:ring-primary-500 active:bg-primary-100",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 active:bg-red-800",
  };
  
  const sizes = {
    small: "h-32 px-16 text-sm",
    medium: "h-40 px-24 text-body",
    large: "h-48 px-32 text-lg",
  };
  
  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        loading && "cursor-wait",
        className
      )}
      disabled={disabled || loading}
      ref={ref}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;