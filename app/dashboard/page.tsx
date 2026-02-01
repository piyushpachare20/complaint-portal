'use client';

import React, { useState, useEffect } from 'react';
import {
    Shield, LayoutDashboard, FileText, User, LogOut, Languages,
    TrendingUp, TrendingDown, Clock, CheckCircle, AlertCircle,
    Loader2, ChevronRight, Calendar, MapPin
} from 'lucide-react';

// Mock data
const MOCK_STATS = {
    total: 47,
    open: 12,
    in_progress: 18,
    resolved: 15,
    rejected: 2,
    avg_resolution_days: 7.2,
    this_week: 8,
    trend: '+15%' // vs last week
};

const MOCK_RECENT_ACTIVITY = [
    {
        id: 1,
        complaint_id: 47,
        title: 'Garbage not collected for 3 days',
        action: 'status_change',
        old_status: 'open',
        new_status: 'in_progress',
        timestamp: '2026-01-26T09:30:00Z',
        category: 'garbage'
    },
    {
        id: 2,
        complaint_id: 46,
        title: 'Water leak on Park Road',
        action: 'resolved',
        old_status: 'in_progress',
        new_status: 'resolved',
        timestamp: '2026-01-26T08:15:00Z',
        category: 'water_leak'
    },
    {
        id: 3,
        complaint_id: 45,
        title: 'Street light not working',
        action: 'new_complaint',
        timestamp: '2026-01-25T18:45:00Z',
        category: 'street_light'
    },
    {
        id: 4,
        complaint_id: 44,
        title: 'Pothole on Main Street',
        action: 'status_change',
        old_status: 'open',
        new_status: 'in_progress',
        timestamp: '2026-01-25T14:20:00Z',
        category: 'pothole'
    }
];

const MOCK_URGENT_COMPLAINTS = [
    {
        id: 43,
        title: 'Deep pothole causing accidents',
        category: 'pothole',
        days_open: 5,
        status: 'open'
    },
    {
        id: 42,
        title: 'Major water leak flooding street',
        category: 'water_leak',
        days_open: 4,
        status: 'open'
    },
    {
        id: 41,
        title: 'Multiple street lights out',
        category: 'street_light',
        days_open: 8,
        status: 'open'
    }
];

// Category icons
const CategoryIcon = ({ category }: { category: string }) => {
    const icons: Record<string, string> = {
        pothole: '🕳️',
        garbage: '🗑️',
        water_leak: '💧',
        street_light: '💡',
        drainage: '🚰',
        other: '📋'
    };
    return <span className="text-xl">{icons[category] || icons.other}</span>;
};

// Format time ago
const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays}d ago`;
};

export default function NagaRasevakaDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    const [urgentComplaints, setUrgentComplaints] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showUserMenu, setShowUserMenu] = useState(false);

    // Mock data loading
    useEffect(() => {
        setTimeout(() => {
            setStats(MOCK_STATS);
            setRecentActivity(MOCK_RECENT_ACTIVITY);
            setUrgentComplaints(MOCK_URGENT_COMPLAINTS);
            setIsLoading(false);
        }, 600);
    }, []);

    const handleLogout = () => {
        // In production: Supabase sign out
        window.location.href = '/';
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
            {/* Navbar */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-lg font-bold text-gray-900 hidden sm:block">ComplaintPortal</span>
                        </div>

                        {/* Navigation */}
                        <nav className="hidden md:flex items-center space-x-1">
                            <button className="px-4 py-2 bg-orange-50 text-orange-600 rounded-lg font-medium">
                                Dashboard
                            </button>
                            <button
                                onClick={() => window.location.href = '/dashboard/complaints'}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                            >
                                All Complaints
                            </button>
                        </nav>

                        {/* Right side actions */}
                        <div className="flex items-center space-x-3">
                            {/* Language toggle */}
                            <button className="p-2 text-gray-600 hover:text-orange-600 transition-colors rounded-lg hover:bg-gray-100">
                                <Languages className="w-5 h-5" />
                            </button>

                            {/* User menu */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                        <User className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="hidden sm:block text-left">
                                        <div className="text-sm font-medium text-gray-700">Priya Sharma</div>
                                        <div className="text-xs text-gray-500">Ward 5 • Nagarasevaka</div>
                                    </div>
                                </button>

                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                                            <User className="w-4 h-4" />
                                            <span>Profile</span>
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <div className="flex items-center space-x-2 text-gray-600 mb-2">
                        <LayoutDashboard className="w-5 h-5" />
                        <span className="text-sm font-medium">Ward 5 Dashboard</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                        Welcome back, Priya
                    </h1>
                    <p className="text-gray-600">
                        Here's what's happening in your ward today
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                    {/* Total */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                            <FileText className="w-5 h-5 text-gray-500" />
                            <div className="flex items-center space-x-1 text-green-600 text-xs font-medium">
                                <TrendingUp className="w-3 h-3" />
                                <span>{stats.trend}</span>
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-1">{stats.total}</div>
                        <div className="text-sm text-gray-600">Total Complaints</div>
                    </div>

                    {/* Open */}
                    <div className="bg-amber-50 p-6 rounded-xl shadow-sm border border-amber-200">
                        <div className="flex items-center justify-between mb-2">
                            <AlertCircle className="w-5 h-5 text-amber-600" />
                        </div>
                        <div className="text-3xl font-bold text-amber-900 mb-1">{stats.open}</div>
                        <div className="text-sm text-amber-700">Open</div>
                    </div>

                    {/* In Progress */}
                    <div className="bg-blue-50 p-6 rounded-xl shadow-sm border border-blue-200">
                        <div className="flex items-center justify-between mb-2">
                            <Loader2 className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="text-3xl font-bold text-blue-900 mb-1">{stats.in_progress}</div>
                        <div className="text-sm text-blue-700">In Progress</div>
                    </div>

                    {/* Resolved */}
                    <div className="bg-green-50 p-6 rounded-xl shadow-sm border border-green-200">
                        <div className="flex items-center justify-between mb-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="text-3xl font-bold text-green-900 mb-1">{stats.resolved}</div>
                        <div className="text-sm text-green-700">Resolved</div>
                    </div>

                    {/* Avg Time */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 col-span-2 lg:col-span-1">
                        <div className="flex items-center justify-between mb-2">
                            <Clock className="w-5 h-5 text-gray-500" />
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-1">{stats.avg_resolution_days}</div>
                        <div className="text-sm text-gray-600">Avg Days to Resolve</div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Column - Recent Activity */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Recent Activity */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
                                <button
                                    onClick={() => window.location.href = '/dashboard/complaints'}
                                    className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                                >
                                    View all
                                </button>
                            </div>

                            <div className="space-y-4">
                                {recentActivity.map((activity) => (
                                    <div
                                        key={activity.id}
                                        onClick={() => window.location.href = `/dashboard/complaint/${activity.complaint_id}`}
                                        className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                                    >
                                        {/* Icon */}
                                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <CategoryIcon category={activity.category} />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between mb-1">
                                                <h3 className="text-sm font-medium text-gray-900 truncate pr-2">
                                                    #{activity.complaint_id} - {activity.title}
                                                </h3>
                                                <span className="text-xs text-gray-500 whitespace-nowrap">
                                                    {formatTimeAgo(activity.timestamp)}
                                                </span>
                                            </div>

                                            {/* Action description */}
                                            {activity.action === 'new_complaint' && (
                                                <p className="text-sm text-gray-600">New complaint submitted</p>
                                            )}
                                            {activity.action === 'status_change' && (
                                                <p className="text-sm text-gray-600">
                                                    Status changed from{' '}
                                                    <span className="font-medium capitalize">{activity.old_status.replace('_', ' ')}</span>
                                                    {' '}to{' '}
                                                    <span className="font-medium capitalize">{activity.new_status.replace('_', ' ')}</span>
                                                </p>
                                            )}
                                            {activity.action === 'resolved' && (
                                                <p className="text-sm text-green-600 font-medium">✓ Complaint resolved</p>
                                            )}
                                        </div>

                                        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* This Week Summary */}
                        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <div className="text-sm font-medium text-orange-100 mb-1">This Week</div>
                                    <div className="text-4xl font-bold mb-2">{stats.this_week}</div>
                                    <div className="text-orange-100">New complaints received</div>
                                </div>
                                <Calendar className="w-8 h-8 text-orange-200" />
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-orange-100">
                                <TrendingUp className="w-4 h-4" />
                                <span>{stats.trend} from last week</span>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                            <div className="space-y-2">
                                <button
                                    onClick={() => window.location.href = '/dashboard/complaints?status=open'}
                                    className="w-full flex items-center justify-between px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors text-left"
                                >
                                    <span className="text-sm font-medium text-amber-900">View Open Complaints</span>
                                    <span className="text-lg font-bold text-amber-600">{stats.open}</span>
                                </button>

                                <button
                                    onClick={() => window.location.href = '/dashboard/complaints?status=in_progress'}
                                    className="w-full flex items-center justify-between px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-left"
                                >
                                    <span className="text-sm font-medium text-blue-900">In Progress</span>
                                    <span className="text-lg font-bold text-blue-600">{stats.in_progress}</span>
                                </button>

                                <button
                                    onClick={() => window.location.href = '/dashboard/complaints'}
                                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
                                >
                                    <FileText className="w-4 h-4" />
                                    <span>All Complaints</span>
                                </button>
                            </div>
                        </div>

                        {/* Urgent Attention */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center space-x-2 mb-4">
                                <AlertCircle className="w-5 h-5 text-red-600" />
                                <h2 className="text-lg font-semibold text-gray-900">Needs Attention</h2>
                            </div>

                            <div className="space-y-3">
                                {urgentComplaints.map((complaint) => (
                                    <div
                                        key={complaint.id}
                                        onClick={() => window.location.href = `/dashboard/complaint/${complaint.id}`}
                                        className="p-3 border border-red-200 bg-red-50 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center space-x-2">
                                                <CategoryIcon category={complaint.category} />
                                                <span className="text-xs font-medium text-red-700">#{complaint.id}</span>
                                            </div>
                                            <span className="text-xs font-bold text-red-700">{complaint.days_open}d</span>
                                        </div>
                                        <p className="text-sm font-medium text-gray-900 line-clamp-2">
                                            {complaint.title}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => window.location.href = '/dashboard/complaints?urgent=true'}
                                className="w-full mt-4 text-sm text-red-600 hover:text-red-700 font-medium"
                            >
                                View all urgent
                            </button>
                        </div>

                        {/* Ward Info */}
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                            <div className="flex items-center space-x-2 mb-3">
                                <MapPin className="w-5 h-5 text-blue-100" />
                                <h3 className="font-semibold">Ward 5</h3>
                            </div>
                            <p className="text-sm text-blue-100 mb-4">
                                Covering Ambarnath East, Central Market area, and Railway Station zone
                            </p>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-blue-100">Population</span>
                                <span className="font-semibold">~25,000</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
