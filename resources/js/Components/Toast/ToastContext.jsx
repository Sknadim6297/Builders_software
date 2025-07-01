import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((toast) => {
        const id = Date.now() + Math.random();
        const newToast = {
            id,
            type: 'info',
            duration: 5000, // 5 seconds default
            ...toast
        };
        
        setToasts((prevToasts) => [...prevToasts, newToast]);
        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, []);

    const removeAllToasts = useCallback(() => {
        setToasts([]);
    }, []);

    // Convenience methods
    const showSuccess = useCallback((message, options = {}) => {
        return addToast({
            type: 'success',
            message,
            title: options.title || 'Success',
            ...options
        });
    }, [addToast]);

    const showError = useCallback((message, options = {}) => {
        return addToast({
            type: 'error',
            message,
            title: options.title || 'Error',
            duration: options.duration || 7000, // Errors stay longer
            ...options
        });
    }, [addToast]);

    const showWarning = useCallback((message, options = {}) => {
        return addToast({
            type: 'warning',
            message,
            title: options.title || 'Warning',
            ...options
        });
    }, [addToast]);

    const showInfo = useCallback((message, options = {}) => {
        return addToast({
            type: 'info',
            message,
            title: options.title || 'Info',
            ...options
        });
    }, [addToast]);

    const value = {
        toasts,
        addToast,
        removeToast,
        removeAllToasts,
        showSuccess,
        showError,
        showWarning,
        showInfo
    };

    return (
        <ToastContext.Provider value={value}>
            {children}
        </ToastContext.Provider>
    );
};
