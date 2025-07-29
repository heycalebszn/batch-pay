import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';
import { cn } from '../../utils/cn';

const Toast = ({
  message,
  type = 'success',
  duration = 5000,
  onClose,
  isVisible = true,
}) => {
  const [show, setShow] = useState(isVisible);
  
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration]);
  
  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      onClose?.();
    }, 200); // Wait for animation to complete
  };
  
  if (!isVisible) return null;
  
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
  };
  
  const styles = {
    success: "bg-white border-green-200 text-green-800 shadow-lg",
    error: "bg-white border-red-200 text-red-800 shadow-lg",
  };
  
  return (
    <div
      className={cn(
        "fixed top-16 right-16 z-50 flex items-center gap-12 p-16 rounded-button border-2 font-inter transition-all duration-200",
        styles[type],
        show ? "animate-slide-in opacity-100" : "animate-slide-out opacity-0"
      )}
      role="alert"
      aria-live="polite"
    >
      {icons[type]}
      <span className="font-medium text-body">{message}</span>
      <button
        onClick={handleClose}
        className="ml-8 p-4 text-gray-400 hover:text-gray-600 transition-colors rounded-button focus:outline-none focus:ring-2 focus:ring-primary-500"
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
};

// Toast Provider Context
const ToastContext = React.createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  
  const addToast = (message, type = 'success', duration = 5000) => {
    const id = Date.now().toString();
    const toast = { id, message, type, duration };
    
    setToasts(prev => [...prev, toast]);
    
    return id;
  };
  
  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };
  
  const showSuccess = (message, duration) => addToast(message, 'success', duration);
  const showError = (message, duration) => addToast(message, 'error', duration);
  
  return (
    <ToastContext.Provider value={{ addToast, removeToast, showSuccess, showError }}>
      {children}
      <div className="fixed top-0 right-0 z-50 pointer-events-none">
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            className="pointer-events-auto mb-8"
            style={{ transform: `translateY(${index * 60}px)` }}
          >
            <Toast
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
              onClose={() => removeToast(toast.id)}
              isVisible={true}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default Toast;