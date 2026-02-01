'use client';

import React, { useEffect, useState } from 'react';
import { ArrowRight, Shield, Clock, CheckCircle, Users } from 'lucide-react';

// Simulated auth hook - replace with actual Supabase auth
const useAuth = () => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate auth check
        setTimeout(() => {
            setLoading(false);
            // Uncomment to test authenticated state:
            // setUser({ role: 'citizen' }); // or 'nagarasevaka'
        }, 500);
    }, []);

    return { user, loading };
};

// Main Landing Page Component
export default function LandingPage() {
    const { user, loading } = useAuth();
    const [redirecting, setRedirecting] = useState(false);

    useEffect(() => {
        if (!loading && user) {
            setRedirecting(true);
            // Redirect logic based on role
            setTimeout(() => {
                if (user.role === 'nagarasevaka') {
                    window.location.href = '/dashboard';
                } else {
                    window.location.href = '/complaint/my';
                }
            }, 500);
        }
    }, [user, loading]);

    // Loading state
    if (loading || redirecting) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Unauthenticated landing page
    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
            {/* Navbar */}
            <nav className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gray-900">ComplaintPortal</span>
                        </div>

                        {/* Auth Buttons - Desktop */}
                        <div className="hidden sm:flex items-center space-x-3">
                            <a
                                href="/login"
                                className="px-4 py-2 text-gray-700 hover:text-orange-600 font-medium transition-colors"
                            >
                                Log In
                            </a>
                            <a
                                href="/signup"
                                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium transition-colors shadow-sm"
                            >
                                Sign Up
                            </a>
                        </div>

                        {/* Auth Buttons - Mobile */}
                        <div className="flex sm:hidden items-center space-x-2">
                            <a
                                href="/login"
                                className="px-3 py-2 text-sm text-gray-700 hover:text-orange-600 font-medium"
                            >
                                Log In
                            </a>
                            <a
                                href="/signup"
                                className="px-4 py-2 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium"
                            >
                                Sign Up
                            </a>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column - Content */}
                    <div className="text-center lg:text-left">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                            Report Issues,
                            <span className="text-orange-600"> Track Progress</span>
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
                            Submit grievances about potholes, garbage, water leaks, and more.
                            Stay updated with real-time status tracking.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <a
                                href="/signup"
                                className="inline-flex items-center justify-center px-8 py-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold transition-colors shadow-lg hover:shadow-xl group"
                            >
                                Get Started
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </a>
                            <a
                                href="/login"
                                className="inline-flex items-center justify-center px-8 py-4 bg-white text-orange-600 border-2 border-orange-600 rounded-lg hover:bg-orange-50 font-semibold transition-colors"
                            >
                                Sign In
                            </a>
                        </div>
                    </div>

                    {/* Right Column - Illustration/Stats */}
                    <div className="hidden lg:block">
                        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
                            <div className="flex items-start space-x-4 p-4 bg-orange-50 rounded-xl">
                                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <CheckCircle className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">Quick Resolution</p>
                                    <p className="text-sm text-gray-600">Average 7-day turnaround</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-xl">
                                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Clock className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">Real-time Updates</p>
                                    <p className="text-sm text-gray-600">Track your complaint status</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-xl">
                                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Users className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">Community Driven</p>
                                    <p className="text-sm text-gray-600">Help improve your locality</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="bg-white py-16 sm:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            How It Works
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Submit, track, and resolve civic issues in just three simple steps
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Step 1 */}
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-orange-600">1</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Submit Complaint
                            </h3>
                            <p className="text-gray-600">
                                Report issues with photos, location, and detailed description
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-blue-600">2</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Track Progress
                            </h3>
                            <p className="text-gray-600">
                                Monitor status updates and get notified when action is taken
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="text-center p-6 sm:col-span-2 lg:col-span-1">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-green-600">3</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Issue Resolved
                            </h3>
                            <p className="text-gray-600">
                                Get confirmation once your complaint is successfully addressed
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-orange-600 py-12 sm:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="text-3xl sm:text-4xl font-bold text-white mb-2">500+</div>
                            <div className="text-orange-100">Complaints Resolved</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl sm:text-4xl font-bold text-white mb-2">7 Days</div>
                            <div className="text-orange-100">Avg Resolution Time</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl sm:text-4xl font-bold text-white mb-2">95%</div>
                            <div className="text-orange-100">Satisfaction Rate</div>
                        </div>
                        <div className="text-center col-span-2 lg:col-span-1">
                            <div className="text-3xl sm:text-4xl font-bold text-white mb-2">24/7</div>
                            <div className="text-orange-100">Online Support</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p>&copy; 2026 ComplaintPortal. Built for Ambarnath, Maharashtra.</p>
                </div>
            </footer>
        </div>
    );
}
