import '../css/app.css';
import './bootstrap';
import './toast-helper';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { useState, useEffect } from 'react';
import ToastContainer from './Components/Toast/ToastContainer';
import { ThemeProvider } from './Components/Theme/ThemeContext';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <ThemeProvider>
                <App {...props} />
                <ToastManagerComponent />
            </ThemeProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// Toast Manager Component
const ToastManagerComponent = () => {
    const [toasts, setToasts] = useState([]);
    
    // Listen for toast events
    useEffect(() => {
        const handleToast = (event) => {
            const { type, message, title, duration } = event.detail;
            const id = Date.now() + Math.random();
            const newToast = {
                id,
                type: type || 'info',
                message,
                title,
                duration: duration || 5000
            };
            setToasts(prev => [...prev, newToast]);
        };

        window.addEventListener('show-toast', handleToast);
        return () => window.removeEventListener('show-toast', handleToast);
    }, []);

    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    return <ToastContainer toasts={toasts} removeToast={removeToast} />;
};
