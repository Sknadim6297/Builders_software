import React, { useState, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

const Toast = ({ message, type = 'info', onClose, duration = 5000 }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Allow time for fade out animation
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const icons = {
        success: CheckCircleIcon,
        error: XCircleIcon,
        warning: ExclamationTriangleIcon,
        info: InformationCircleIcon,
    };

    const colors = {
        success: 'bg-green-50 border-green-200 text-green-800',
        error: 'bg-red-50 border-red-200 text-red-800',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        info: 'bg-primary-50 border-primary-200 text-primary-800',
    };

    const iconColors = {
        success: 'text-green-400',
        error: 'text-red-400',
        warning: 'text-yellow-400',
        info: 'text-blue-400',
    };

    const Icon = icons[type];

    return (
        <div
            className={`fixed top-4 right-4 z-50 w-96 p-4 border rounded-lg shadow-lg transition-all duration-300 ${
                isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-2'
            } ${colors[type]}`}
        >
            <div className="flex items-start">
                <Icon className={`w-5 h-5 mt-0.5 mr-3 ${iconColors[type]}`} />
                <div className="flex-1">
                    <p className="text-sm font-medium">{message}</p>
                </div>
                <button
                    onClick={() => {
                        setIsVisible(false);
                        setTimeout(onClose, 300);
                    }}
                    className="ml-3 text-gray-400 hover:text-gray-600"
                >
                    <XMarkIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

const ToastContainer = () => {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        // Create global functions for showing toasts
        window.showSuccess = (message) => showToast(message, 'success');
        window.showError = (message) => showToast(message, 'error');
        window.showWarning = (message) => showToast(message, 'warning');
        window.showInfo = (message) => showToast(message, 'info');

        return () => {
            // Cleanup
            delete window.showSuccess;
            delete window.showError;
            delete window.showWarning;
            delete window.showInfo;
        };
    }, []);

    const showToast = (message, type) => {
        const id = Date.now();
        const newToast = { id, message, type };
        setToasts(prev => [...prev, newToast]);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    return (
        <div className="fixed top-0 right-0 z-50 p-4 space-y-2">
            {toasts.map((toast, index) => (
                <div
                    key={toast.id}
                    style={{ top: `${index * 80}px` }}
                    className="relative"
                >
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => removeToast(toast.id)}
                    />
                </div>
            ))}
        </div>
    );
};

export default ToastContainer;
