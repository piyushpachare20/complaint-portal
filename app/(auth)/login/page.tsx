'use client';

import React, { useState } from 'react';
import { Mail, Phone, Eye, EyeOff, ArrowLeft, Shield, AlertCircle } from 'lucide-react';

// Google Icon SVG Component
const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
    </svg>
);

export default function LoginPage() {
    const [loginMethod, setLoginMethod] = useState('email'); // 'email' | 'phone'
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        password: ''
    });

    const [errors, setErrors] = useState({
        email: '',
        phone: '',
        password: ''
    });

    // Form validation
    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone: string) => {
        const phoneRegex = /^[6-9]\d{9}$/; // Indian mobile number
        return phoneRegex.test(phone);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
        setError('');
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        // Demo mode: Instantly redirect to citizen dashboard
        setTimeout(() => {
            window.location.href = '/complaint/my';
        }, 500);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        let hasError = false;
        const newErrors = { email: '', phone: '', password: '' };

        // Validate based on login method
        if (loginMethod === 'email') {
            if (!formData.email) {
                newErrors.email = 'Email is required';
                hasError = true;
            } else if (!validateEmail(formData.email)) {
                newErrors.email = 'Please enter a valid email';
                hasError = true;
            }
        } else {
            if (!formData.phone) {
                newErrors.phone = 'Phone number is required';
                hasError = true;
            } else if (!validatePhone(formData.phone)) {
                newErrors.phone = 'Please enter a valid 10-digit mobile number';
                hasError = true;
            }
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
            hasError = true;
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
            hasError = true;
        }

        setErrors(newErrors);

        if (hasError) return;

        // Submit
        setIsLoading(true);

        setTimeout(() => {
            console.log('Login submitted:', { loginMethod, formData });
            setIsLoading(false);

            // Check for Nagarasevaka (admin) credentials
            if (loginMethod === 'email' && formData.email === 'admin@mail.com' && formData.password === 'admin@123') {
                // Redirect to Nagarasevaka dashboard
                window.location.href = '/dashboard';
            } else {
                // Redirect to citizen dashboard for any other credentials (demo mode)
                window.location.href = '/complaint/my';
            }
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
            {/* Simple Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <button
                            onClick={() => window.history.back()}
                            className="inline-flex items-center space-x-2 text-gray-700 hover:text-orange-600 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="font-medium">Back</span>
                        </button>

                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-lg font-bold text-gray-900 hidden sm:block">ComplaintPortal</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-gray-600">
                            Log in to track and manage your complaints
                        </p>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    {/* Demo Credentials Info */}
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h3 className="text-sm font-semibold text-blue-900 mb-2">🎯 Demo Credentials</h3>
                        <div className="space-y-1 text-xs text-blue-800">
                            <p><strong>Citizen Access:</strong> Click "Continue with Google" or use any email/password</p>
                            <p><strong>Nagarasevaka Access:</strong> Email: <code className="bg-blue-100 px-1 rounded">admin@mail.com</code> | Password: <code className="bg-blue-100 px-1 rounded">admin@123</code></p>
                        </div>
                    </div>

                    {/* Google Login */}
                    <button
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
                    >
                        <GoogleIcon />
                        <span>Continue with Google</span>
                    </button>

                    {/* Divider */}
                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    {/* Login Method Toggle */}
                    <div className="flex gap-2 mb-6">
                        <button
                            type="button"
                            onClick={() => setLoginMethod('email')}
                            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${loginMethod === 'email'
                                ? 'bg-orange-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            <Mail className="w-4 h-4" />
                            <span>Email</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setLoginMethod('phone')}
                            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${loginMethod === 'phone'
                                ? 'bg-orange-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            <Phone className="w-4 h-4" />
                            <span>Phone</span>
                        </button>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Input */}
                        {loginMethod === 'email' && (
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 pl-11 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${errors.email ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="you@example.com"
                                    />
                                    <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                </div>
                                {errors.email && (
                                    <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>
                        )}

                        {/* Phone Input */}
                        {loginMethod === 'phone' && (
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-900 mb-2">
                                    Mobile Number
                                </label>
                                <div className="relative">
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        autoComplete="tel"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        maxLength={10}
                                        className={`w-full px-4 py-3 pl-11 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${errors.phone ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="9876543210"
                                    />
                                    <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                </div>
                                {errors.phone && (
                                    <p className="mt-1.5 text-sm text-red-600">{errors.phone}</p>
                                )}
                            </div>
                        )}

                        {/* Password Input */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                                    Password
                                </label>
                                <button
                                    type="button"
                                    onClick={() => alert('Password reset functionality coming soon')}
                                    className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                                >
                                    Forgot?
                                </button>
                            </div>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 pr-11 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${errors.password ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1.5 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Logging in...
                                </>
                            ) : (
                                'Log In'
                            )}
                        </button>
                    </form>

                    {/* Sign Up Link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Don't have an account?{' '}
                            <button
                                onClick={() => window.location.href = '/signup'}
                                className="text-orange-600 hover:text-orange-700 font-semibold"
                            >
                                Sign Up
                            </button>
                        </p>
                    </div>
                </div>

                {/* Help Text */}
                <div className="mt-6 text-center text-sm text-gray-500">
                    By logging in, you agree to our{' '}
                    <button className="text-orange-600 hover:underline">Terms of Service</button>
                    {' '}and{' '}
                    <button className="text-orange-600 hover:underline">Privacy Policy</button>
                </div>
            </main>
        </div>
    );
}
