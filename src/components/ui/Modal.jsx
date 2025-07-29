import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  className,
  maxWidth = "max-w-md",
  showCloseButton = true,
}) => {
  const modalRef = useRef(null);
  const previouslyFocusedElement = useRef(null);
  
  useEffect(() => {
    if (isOpen) {
      // Store the previously focused element
      previouslyFocusedElement.current = document.activeElement;
      
      // Focus the modal
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements?.length > 0) {
        focusableElements[0].focus();
      }
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // Handle Escape key
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      
      // Handle Tab key for focus trapping
      const handleTab = (e) => {
        if (e.key === 'Tab') {
          const focusableElements = modalRef.current?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          const firstElement = focusableElements?.[0];
          const lastElement = focusableElements?.[focusableElements.length - 1];
          
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement?.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement?.focus();
            }
          }
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('keydown', handleTab);
      
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.removeEventListener('keydown', handleTab);
        document.body.style.overflow = 'unset';
      };
    } else {
      // Restore focus to previously focused element
      if (previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus();
      }
    }
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-16"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div
        ref={modalRef}
        className={cn(
          "relative w-full bg-white rounded-modal shadow-modal animate-modal-open",
          "max-h-[90vh] overflow-y-auto",
          maxWidth,
          className
        )}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-24 border-b border-gray-200">
            {title && (
              <h2 id="modal-title" className="text-xl font-bold font-inter text-secondary">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-8 text-gray-400 hover:text-gray-600 transition-colors rounded-button focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}
        
        {/* Content */}
        <div className="p-24">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;