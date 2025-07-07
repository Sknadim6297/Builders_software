import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],
    darkMode: 'class',

    theme: {
        extend: {
            fontFamily: {
                sans: ['Lexend', ...defaultTheme.fontFamily.sans],
                display: ['Lexend', ...defaultTheme.fontFamily.sans],
                heading: ['Lexend', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                primary: {
                    50: '#f7f3f9',
                    100: '#ede4f2',
                    200: '#dcc9e4',
                    300: '#c6a3d2',
                    400: '#b188c3',
                    500: '#a47db5',
                    600: '#9569a6',
                    700: '#7d5587',
                    800: '#69466f',
                    900: '#573c5c',
                },
            },
        },
    },

    plugins: [forms],
};
