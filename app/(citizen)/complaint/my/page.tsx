'use client';

import React, { useState, useEffect } from 'react';
import {
    Shield, Plus, Search, Filter, Clock, ChevronRight,
    FileText, Loader2, User, LogOut, Languages
} from 'lucide-react';

// Mock data for demonstration
const MOCK_COMPLAINTS = [
    {
        id: 1,
        title: 'Large pothole on Main Street near City Hall',
        category: 'pothole',
        status: 'in_progress',
        created_at: '2026-01-20T10:30:00Z',
        photo_url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400',
        description: 'Deep pothole causing issues for vehicles...',
        ward_id: 5
    },
    {
        id: 2,
        title: 'Garbage not collected for 3 days',
        category: 'garbage',
        status: 'resolved',
        created_at: '2026-01-18T14:20:00Z',
        photo_url: null,
        description: 'Garbage bin overflowing on Park Road...',
        ward_id: 5,
        resolved_at: '2026-01-22T09:15:00Z'
    },
    {
        id: 3,
        title: 'Street light not working on Gandhi Road',
        category: 'street_light',
        status: 'open',
        created_at: '2026-01-15T08:45:00Z',
        photo_url: null,
        description: 'Street light pole #234 has been non-functional...',
        ward_id: 5
    },
    {
        id: 4,
        title: 'Water leak from main pipeline',
        category: 'water_leak',
        status: 'in_progress',
        created_at: '2026-01-10T16:30:00Z',
        photo_url: 'https://images.unsplash.com/photo-1584555613497-9ecf9dd06f68?w=400',
        description: 'Continuous water leak causing road damage...',
        ward_id: 5
    },
    {
        id: 5,
        title: 'Blocked drainage causing water logging',
        category: 'drainage',
        status: 'resolved',
        created_at: '2026-01-05T11:00:00Z',
        photo_url: null,
        description: 'Drainage blocked near temple area...',
        ward_id: 5,
        resolved_at: '2026-01-12T14:30:00Z'
    }
];

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
    const configs: Record<string, { bg: string; text: string; label: string }> = {
        open: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Open' },
        in_progress: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'In Progress' },
        resolved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Resolved' },
        rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' }
    };

    const config = configs[status] || configs.open;

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
            {config.label}
        </span>
    );
};

// Category emoji component
const CategoryIcon = ({ category }: { category: string }) => {
    const icons: Record<string, string> = {
        pothole: '🕳️',
        garbage: '🗑️',
        water_leak: '💧',
        street_light: '💡',
        drainage: '🚰',
        other: '📋'
    };

    return <span className="text-2xl">{icons[category] || icons.other}</span>;
};

// Format date helper
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
};

export default function MyComplaintsPage() {
    const [complaints, setComplaints] = useState<any[]>([]);
    const [filteredComplaints, setFilteredComplaints] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showUserMenu, setShowUserMenu] = useState(false);

    // Simulated data loading
    useEffect(() => {
        setTimeout(() => {
            setComplaints(MOCK_COMPLAINTS);
            setFilteredComplaints(MOCK_COMPLAINTS);
            setIsLoading(false);
        }, 800);
    }, []);

    // Filter and search
    useEffect(() => {
        let filtered = [...complaints];

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(c => c.status === statusFilter);
        }

        // Search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(c =>
                c.title.toLowerCase().includes(query) ||
                c.description.toLowerCase().includes(query) ||
                c.id.toString().includes(query)
            );
        }

        setFilteredComplaints(filtered);
    }, [complaints, statusFilter, searchQuery]);

    // Stats calculation
    const stats = {
        total: complaints.length,
        open: complaints.filter(c => c.status === 'open').length,
        in_progress: complaints.filter(c => c.status === 'in_progress').length,
        resolved: complaints.filter(c => c.status === 'resolved').length
    };

    const handleLogout = () => {
        // In production: Supabase sign out
        window.location.href = '/';
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
            {/* Header/Navbar */}
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
                                    <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                                        <User className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="hidden sm:block text-sm font-medium text-gray-700">
                                        Rajesh Kumar
                                    </span>
                                </button>

                                {/* Dropdown menu */}
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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                            My Complaints
                        </h1>
                        <p className="text-gray-600">
                            Track and manage all your submitted complaints
                        </p>
                    </div>
                    <button
                        onClick={() => window.location.href = '/complaint/new'}
                        className="mt-4 sm:mt-0 inline-flex items-center space-x-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold transition-colors shadow-sm"
                    >
                        <Plus className="w-5 h-5" />
                        <span>New Complaint</span>
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                        <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                        <div className="text-sm text-gray-600">Total Complaints</div>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-xl shadow-sm border border-amber-200">
                        <div className="text-2xl font-bold text-amber-900">{stats.open}</div>
                        <div className="text-sm text-amber-700">Open</div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl shadow-sm border border-blue-200">
                        <div className="text-2xl font-bold text-blue-900">{stats.in_progress}</div>
                        <div className="text-sm text-blue-700">In Progress</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl shadow-sm border border-green-200">
                        <div className="text-2xl font-bold text-green-900">{stats.resolved}</div>
                        <div className="text-sm text-green-700">Resolved</div>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by title, description, or ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="relative">
                            <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                            >
                                <option value="all">All Status</option>
                                <option value="open">Open</option>
                                <option value="in_progress">In Progress</option>
                                <option value="resolved">Resolved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && filteredComplaints.length === 0 && complaints.length === 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No complaints yet
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Start by submitting your first complaint to track civic issues
                        </p>
                        <button
                            onClick={() => window.location.href = '/complaint/new'}
                            className="inline-flex items-center space-x-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Submit Complaint</span>
                        </button>
                    </div>
                )}

                {/* No Results from Filter */}
                {!isLoading && filteredComplaints.length === 0 && complaints.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No complaints found
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Try adjusting your search or filter criteria
                        </p>
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setStatusFilter('all');
                            }}
                            className="text-orange-600 hover:text-orange-700 font-medium"
                        >
                            Clear filters
                        </button>
                    </div>
                )}

                {/* Complaints List */}
                {!isLoading && filteredComplaints.length > 0 && (
                    <div className="space-y-4">
                        {filteredComplaints.map((complaint) => (
                            <div
                                key={complaint.id}
                                onClick={() => window.location.href = `/complaint/${complaint.id}`}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
                            >
                                <div className="flex flex-col sm:flex-row">
                                    {/* Photo */}
                                    {complaint.photo_url ? (
                                        <div className="w-full sm:w-32 h-32 sm:h-auto flex-shrink-0">
                                            <img
                                                src={complaint.photo_url}
                                                alt={complaint.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="hidden sm:flex w-32 h-auto items-center justify-center bg-gray-100 flex-shrink-0">
                                            <CategoryIcon category={complaint.category} />
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="flex-1 p-4 sm:p-6">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex-1 pr-4">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <span className="text-xs font-medium text-gray-500">
                                                        #{complaint.id}
                                                    </span>
                                                    <StatusBadge status={complaint.status} />
                                                </div>
                                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                    {complaint.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 line-clamp-2">
                                                    {complaint.description}
                                                </p>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 hidden sm:block" />
                                        </div>

                                        {/* Footer */}
                                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                                <Clock className="w-4 h-4" />
                                                <span>{formatDate(complaint.created_at)}</span>
                                            </div>
                                            {complaint.resolved_at && (
                                                <div className="text-xs text-green-600 font-medium">
                                                    Resolved {formatDate(complaint.resolved_at)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination (placeholder) */}
                {!isLoading && filteredComplaints.length > 0 && (
                    <div className="mt-8 flex justify-center">
                        <div className="inline-flex items-center space-x-2">
                            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                Previous
                            </button>
                            <span className="px-4 py-2 text-sm text-gray-700">
                                Page 1 of 1
                            </span>
                            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
