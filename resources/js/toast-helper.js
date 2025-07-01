// Global toast helper function
window.showToast = (options) => {
    const event = new CustomEvent('show-toast', {
        detail: {
            type: 'info',
            duration: 5000,
            ...options
        }
    });
    window.dispatchEvent(event);
};

// Convenience methods
window.showSuccess = (message, options = {}) => {
    window.showToast({
        type: 'success',
        message,
        title: options.title || 'Success',
        ...options
    });
};

window.showError = (message, options = {}) => {
    window.showToast({
        type: 'error',
        message,
        title: options.title || 'Error',
        duration: options.duration || 7000,
        ...options
    });
};

window.showWarning = (message, options = {}) => {
    window.showToast({
        type: 'warning',
        message,
        title: options.title || 'Warning',
        ...options
    });
};

window.showInfo = (message, options = {}) => {
    window.showToast({
        type: 'info',
        message,
        title: options.title || 'Info',
        ...options
    });
};
