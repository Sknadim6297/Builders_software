import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const ToastContainer = ({ toasts, removeToast }) => {
    return createPortal(
        <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full">
            {toasts.map((toast) => (
                <Toast 
                    key={toast.id} 
                    toast={toast} 
                    onRemove={() => removeToast(toast.id)} 
                />
            ))}
        </div>,
        document.body
    );
};

const Toast = ({ toast, onRemove }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        // Trigger entrance animation
        const timer = setTimeout(() => setIsVisible(true), 10);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // Auto-remove after duration
        if (toast.duration && toast.duration > 0) {
            const timer = setTimeout(() => {
                handleRemove();
            }, toast.duration);
            return () => clearTimeout(timer);
        }
    }, [toast.duration]);

    const handleRemove = () => {
        setIsLeaving(true);
        setTimeout(() => {
            onRemove();
        }, 300); // Match animation duration
    };

    const getToastStyles = () => {
        const baseStyles = "relative overflow-hidden rounded-xl shadow-lg backdrop-blur-sm border transform transition-all duration-300 ease-in-out";
        
        if (isLeaving) {
            return `${baseStyles} translate-x-full opacity-0 scale-95`;
        }
        
        if (isVisible) {
            return `${baseStyles} translate-x-0 opacity-100 scale-100`;
        }
        
        return `${baseStyles} translate-x-full opacity-0 scale-95`;
    };

    const getTypeStyles = () => {
        switch (toast.type) {
            case 'success':
                return {
                    bg: 'bg-gradient-to-r from-emerald-500/90 to-green-500/90',
                    border: 'border-emerald-300/50',
                    text: 'text-white',
                    icon: (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )
                };
            case 'error':
                return {
                    bg: 'bg-gradient-to-r from-red-500/90 to-rose-500/90',
                    border: 'border-red-300/50',
                    text: 'text-white',
                    icon: (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )
                };
            case 'warning':
                return {
                    bg: 'bg-gradient-to-r from-amber-500/90 to-orange-500/90',
                    border: 'border-amber-300/50',
                    text: 'text-white',
                    icon: (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    )
                };
            case 'info':
                return {
                    bg: 'bg-gradient-to-r from-blue-500/90 to-indigo-500/90',
                    border: 'border-blue-300/50',
                    text: 'text-white',
                    icon: (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )
                };
            default:
                return {
                    bg: 'bg-gradient-to-r from-gray-800/90 to-gray-700/90',
                    border: 'border-gray-300/50',
                    text: 'text-white',
                    icon: (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )
                };
        }
    };

    const typeStyles = getTypeStyles();

    return (
        <div className={`${getToastStyles()} ${typeStyles.bg} ${typeStyles.border} ${typeStyles.text}`}>
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 animate-pulse"></div>
            </div>
            
            {/* Progress bar */}
            {toast.duration && toast.duration > 0 && (
                <div className="absolute top-0 left-0 h-1 bg-white/30 w-full">
                    <div 
                        className="h-full bg-white/60 transition-all ease-linear"
                        style={{
                            animation: `toast-progress ${toast.duration}ms linear forwards`
                        }}
                    ></div>
                </div>
            )}
            
            <div className="relative p-4">
                <div className="flex items-start space-x-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-0.5">
                        <div className="p-1 rounded-full bg-white/20 backdrop-blur-sm">
                            {typeStyles.icon}
                        </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        {toast.title && (
                            <h4 className="text-sm font-semibold mb-1 leading-tight">
                                {toast.title}
                            </h4>
                        )}
                        <p className="text-sm opacity-95 leading-relaxed">
                            {toast.message}
                        </p>
                        {toast.description && (
                            <p className="text-xs opacity-80 mt-1">
                                {toast.description}
                            </p>
                        )}
                    </div>
                    
                    {/* Close button */}
                    <button
                        onClick={handleRemove}
                        className="flex-shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors duration-200 group"
                        aria-label="Close notification"
                    >
                        <svg className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ToastContainer;
