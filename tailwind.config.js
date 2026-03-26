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
                    50: '#e8f0fa',
                    100: '#cfe0f3',
                    200: '#9ec0df',
                    300: '#6c9aca',
                    400: '#486fae',
                    500: '#2f5594',
                    600: '#244470',
                    700: '#1b3555',
                    800: '#112443',
                    900: '#07172a',
                },
                secondary: {
                    50: '#f6f0e2',
                    100: '#ede3c5',
                    200: '#dcc896',
                    300: '#c0ae8a',
                    400: '#af9a75',
                    500: '#9d8863',
                    600: '#8a7652',
                    700: '#6f5e40',
                    800: '#574a33',
                    900: '#3f3727',
                },
            },
        },
    },

    plugins: [forms],
};
