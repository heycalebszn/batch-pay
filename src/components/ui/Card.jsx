import React from 'react';
import { cn } from '../../utils/cn';

const Card = React.forwardRef(({
  className,
  children,
  hover = false,
  padding = "p-24",
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "bg-white rounded-card border border-gray-200 shadow-card transition-all duration-200",
        hover && "hover:shadow-card-hover hover:-translate-y-1 cursor-pointer",
        padding,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

const CardHeader = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    >
      {children}
    </div>
  );
});

CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <h3
      ref={ref}
      className={cn("font-inter font-bold text-lg text-secondary leading-none tracking-tight", className)}
      {...props}
    >
      {children}
    </h3>
  );
});

CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-gray-600 font-inter", className)}
      {...props}
    >
      {children}
    </p>
  );
});

CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn("p-6 pt-0", className)}
      {...props}
    >
      {children}
    </div>
  );
});

CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    >
      {children}
    </div>
  );
});

CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };