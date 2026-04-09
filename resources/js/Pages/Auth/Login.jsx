import InputError from '@/Components/InputError';
import CompanyLogo from '@/Components/CompanyLogo';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Login({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [companySettings, setCompanySettings] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch company settings
        fetch('/api/company-settings')
            .then(res => res.json())
            .then(data => {
                setCompanySettings(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to load company settings:', err);
                setLoading(false);
            });
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onBefore: () => {
                // Ensure fresh CSRF token before login
                const token = document.head.querySelector('meta[name="csrf-token"]');
                if (token && window.axios) {
                    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
                }
            },
            onFinish: () => reset('password'),
            onError: (errors) => {
                // Handle specific error scenarios
                if (Object.keys(errors).length === 0) {
                    // This might be a CSRF issue, refresh page
                    console.warn('Possible CSRF error during login, refreshing...');
                    setTimeout(() => window.location.reload(), 1000);
                }
            }
        });
    };

    return (
        <div className="min-h-screen flex">
            <Head title="Admin Login" />
            
            {/* Left Side - Login Form */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 to-primary-100">
                <div className="max-w-md w-full space-y-8">
                    {/* Header */}
                    <div className="text-center">
                        <CompanyLogo
                            alt="Company Logo"
                            className="mx-auto mb-6 h-32 w-auto max-w-full object-contain"
                        />
                    </div>

                    {/* Status Message */}
                    {status && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                            {status}
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={submit} className="mt-8 space-y-6">
                        <div className="space-y-5">
                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </svg>
                                    </div>
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="pl-10 block w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition duration-200"
                                        autoComplete="username"
                                        isFocused={true}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="Enter your email"
                                    />
                                </div>
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <TextInput
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={data.password}
                                        className="pl-10 pr-10 block w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition duration-200"
                                        autoComplete="current-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center">
                                <input
                                    id="remember"
                                    name="remember"
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                                    Remember me
                                </label>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <PrimaryButton
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition duration-200 disabled:opacity-50"
                                disabled={processing}
                            >
                                {processing ? (
                                    <div className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing in...
                                    </div>
                                ) : (
                                    'Sign in to Dashboard'
                                )}
                            </PrimaryButton>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="text-center text-sm text-gray-500">
                        <p>{companySettings?.company_name || 'Sayan Sita Builders'} Management Portal</p>
                        <p className="mt-1">Professional business administration</p>
                    </div>
                </div>
            </div>

            {/* Right Side - Company Information */}
            <div className="hidden lg:flex flex-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800"></div>
                <div className="absolute inset-0 bg-black opacity-20"></div>
                
                {/* Geometric Shapes */}
                <div className="absolute top-20 left-20 w-32 h-32 bg-white opacity-10 rounded-full"></div>
                <div className="absolute top-40 right-32 w-24 h-24 bg-white opacity-10 rounded-lg rotate-45"></div>
                <div className="absolute bottom-32 left-32 w-40 h-40 bg-white opacity-10 rounded-full"></div>
                <div className="absolute bottom-20 right-20 w-20 h-20 bg-white opacity-10 rounded-lg rotate-12"></div>
                
                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center items-center text-white p-16 w-full">
                    <div className="max-w-md w-full text-center">
                        {!loading && companySettings ? (
                            <>
                          

                                {/* Company Name */}
                                <h1 className="text-4xl font-bold mb-6 leading-tight">
                                    {companySettings?.company_name || 'SAYAN SITA BUILDERS'}
                                </h1>

                                {/* Divider */}
                                <div className="h-1 w-16 bg-white mx-auto mb-6 rounded-full opacity-50"></div>

                                {/* Address */}
                                <div className="mb-8">
                                    <p className="text-lg leading-relaxed opacity-95">
                                        {companySettings?.company_address || 'Chalitapara, Ajodhya, Shyampur, Howrah – 711312'}
                                    </p>
                                </div>

                                {/* Contact Info */}
                                <div className="space-y-3 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
                                    <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Contact Us</h3>
                                    <div className="flex items-center justify-center space-x-2 text-base">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773c.26.559.738 1.382 1.547 2.191.81.81 1.633 1.288 2.192 1.547l.773-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                                        </svg>
                                        <span className="text-lg font-semibold">{companySettings?.company_phone_1 || '6289249399'}</span>
                                    </div>
                                    {companySettings?.company_phone_2 && (
                                        <div className="flex items-center justify-center space-x-2 text-base">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773c.26.559.738 1.382 1.547 2.191.81.81 1.633 1.288 2.192 1.547l.773-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                                            </svg>
                                            <span className="text-lg font-semibold">{companySettings?.company_phone_2}</span>
                                        </div>
                                    )}
                                    {companySettings?.company_phone_3 && (
                                        <div className="flex items-center justify-center space-x-2 text-base">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773c.26.559.738 1.382 1.547 2.191.81.81 1.633 1.288 2.192 1.547l.773-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                                            </svg>
                                            <span className="text-lg font-semibold">{companySettings?.company_phone_3}</span>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="space-y-4">
                                <div className="mx-auto h-32 w-32 bg-white bg-opacity-20 rounded-2xl animate-pulse"></div>
                                <div className="h-8 bg-white bg-opacity-20 rounded animate-pulse"></div>
                                <div className="h-6 bg-white bg-opacity-20 rounded animate-pulse w-3/4 mx-auto"></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
