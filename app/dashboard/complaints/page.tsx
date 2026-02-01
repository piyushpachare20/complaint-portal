'use client';

import React, { useState, useEffect } from 'react';
import {
    Shield, LayoutDashboard, FileText, User, LogOut, Languages,
    Search, Filter, SlidersHorizontal, ChevronDown, ChevronRight,
    Clock, CheckCircle, AlertCircle, Loader2, Calendar, Download,
    RefreshCw, X
} from 'lucide-react';

// Mock data
const MOCK_COMPLAINTS = [
    {
        id: 47,
        title: 'Garbage not collected for 3 days',
        category: 'garbage',
        status: 'in_progress',
        created_at: '2026-01-24T10:30:00Z',
        updated_at: '2026-01-26T09:30:00Z',
        citizen_name: 'Amit Patel',
        photo_url: null,
        priority: 'medium'
    },
    {
        id: 46,
        title: 'Water leak on Park Road near temple',
        category: 'water_leak',
        status: 'resolved',
        created_at: '2026-01-22T14:20:00Z',
        updated_at: '2026-01-26T08:15:00Z',
        resolved_at: '2026-01-26T08:15:00Z',
        citizen_name: 'Sunita Desai',
        photo_url: 'https://images.unsplash.com/photo-1584555613497-9ecf9dd06f68?w=400',
        priority: 'high'
    },
    {
        id: 45,
        title: 'Street light not working on Gandhi Road',
        category: 'street_light',
        status: 'open',
        created_at: '2026-01-20T18:45:00Z',
        updated_at: '2026-01-20T18:45:00Z',
        citizen_name: 'Rajesh Kumar',
        photo_url: null,
        priority: 'low'
    },
    {
        id: 44,
        title: 'Large pothole on Main Street causing damage',
        category: 'pothole',
        status: 'in_progress',
        created_at: '2026-01-18T11:00:00Z',
        updated_at: '2026-01-25T14:20:00Z',
        citizen_name: 'Priya Sharma',
        photo_url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400',
        priority: 'high'
    },
    {
        id: 43,
        title: 'Drainage blocked near market area',
        category: 'drainage',
        status: 'open',
        created_at: '2026-01-15T09:30:00Z',
        updated_at: '2026-01-15T09:30:00Z',
        citizen_name: 'Vikram Singh',
        photo_url: null,
        priority: 'medium'
    },
    {
        id: 42,
        title: 'Multiple street lights out in residential area',
        category: 'street_light',
        status: 'resolved',
        created_at: '2026-01-12T16:45:00Z',
        updated_at: '2026-01-24T10:30:00Z',
        resolved_at: '2026-01-24T10:30:00Z',
        citizen_name: 'Meera Joshi',
        photo_url: null,
        priority: 'medium'
    }
];

const CATEGORIES = [
    { value: 'all', label: 'All Categories', icon: '📋' },
    { value: 'pothole', label: 'Pothole', icon: '🕳️' },
    { value: 'garbage', label: 'Garbage', icon: '🗑️' },
    { value: 'water_leak', label: 'Water Leak', icon: '💧' },
    { value: 'street_light', label: 'Street Light', icon: '💡' },
    { value: 'drainage', label: 'Drainage', icon: '🚰' },
    { value: 'other', label: 'Other', icon: '📋' }
];

// Status badge
const StatusBadge = ({ status }: { status: string }) => {
    const configs: Record<string, { bg: string; text: string; label: string }> = {
        open: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Open' },
        in_progress: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'In Progress' },
        resolved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Resolved' },
        rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' }
    };

    const config = configs[status] || configs.open;

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
            {config.label}
        </span>
    );
};

// Priority badge
const PriorityBadge = ({ priority }: { priority: string }) => {
    const configs: Record<string, { bg: string; text: string; label: string }> = {
        high: { bg: 'bg-red-100', text: 'text-red-700', label: 'High' },
        medium: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Medium' },
        low: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Low' }
    };

    const config = configs[priority] || configs.medium;

    return (
        <span className={`text-xs font-medium ${config.text}`}>
            {config.label}
        </span>
    );
};

// Category icon
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

// Format date
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });
};

const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(dateString);
};

export default function NagaRasevakaComplaintsList() {
    const [complaints, setComplaints] = useState<any[]>([]);
    const [filteredComplaints, setFilteredComplaints] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest'); // newest, oldest, priority

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Mock data loading
    useEffect(() => {
        setTimeout(() => {
            setComplaints(MOCK_COMPLAINTS);
            setFilteredComplaints(MOCK_COMPLAINTS);
            setIsLoading(false);
        }, 600);
    }, []);

    // Filter and search
    useEffect(() => {
        let filtered = [...complaints];

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(c => c.status === statusFilter);
        }

        // Category filter
        if (categoryFilter !== 'all') {
            filtered = filtered.filter(c => c.category === categoryFilter);
        }

        // Search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(c =>
                c.title.toLowerCase().includes(query) ||
                c.citizen_name.toLowerCase().includes(query) ||
                c.id.toString().includes(query)
            );
        }

        // Sort
        if (sortBy === 'newest') {
            filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        } else if (sortBy === 'oldest') {
            filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        } else if (sortBy === 'priority') {
            const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
            filtered.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
        }

        setFilteredComplaints(filtered);
        setCurrentPage(1); // Reset to first page on filter change
    }, [complaints, statusFilter, categoryFilter, searchQuery, sortBy]);

    // Pagination
    const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);
    const paginatedComplaints = filteredComplaints.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Stats
    const stats = {
        total: filteredComplaints.length,
        open: filteredComplaints.filter(c => c.status === 'open').length,
        in_progress: filteredComplaints.filter(c => c.status === 'in_progress').length,
        resolved: filteredComplaints.filter(c => c.status === 'resolved').length
    };

    const clearFilters = () => {
        setSearchQuery('');
        setStatusFilter('all');
        setCategoryFilter('all');
        setSortBy('newest');
    };

    const activeFiltersCount =
        (statusFilter !== 'all' ? 1 : 0) +
        (categoryFilter !== 'all' ? 1 : 0) +
        (searchQuery ? 1 : 0);

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
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-lg font-bold text-gray-900 hidden sm:block">ComplaintPortal</span>
                        </div>

                        <nav className="hidden md:flex items-center space-x-1">
                            <button
                                onClick={() => window.location.href = '/dashboard'}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                            >
                                Dashboard
                            </button>
                            <button className="px-4 py-2 bg-orange-50 text-orange-600 rounded-lg font-medium">
                                All Complaints
                            </button>
                        </nav>

                        <div className="flex items-center space-x-3">
                            <button className="p-2 text-gray-600 hover:text-orange-600 transition-colors rounded-lg hover:bg-gray-100">
                                <Languages className="w-5 h-5" />
                            </button>

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
                                        <div className="text-xs text-gray-500">Ward 5</div>
                                    </div>
                                </button>

                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                                            <User className="w-4 h-4" />
                                            <span>Profile</span>
                                        </button>
                                        <button
                                            onClick={() => window.location.href = '/'}
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
                <div className="mb-6">
                    <div className="flex items-center space-x-2 text-gray-600 mb-2">
                        <FileText className="w-5 h-5" />
                        <span className="text-sm font-medium">Ward 5 • All Complaints</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <h1 className="text-3xl font-bold text-gray-900">Manage Complaints</h1>
                        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                            <button className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
                                <Download className="w-4 h-4" />
                                <span className="hidden sm:inline">Export</span>
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
                            >
                                <RefreshCw className="w-4 h-4" />
                                <span className="hidden sm:inline">Refresh</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                        <div className="text-sm text-gray-600">Total</div>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                        <div className="text-2xl font-bold text-amber-900">{stats.open}</div>
                        <div className="text-sm text-amber-700">Open</div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="text-2xl font-bold text-blue-900">{stats.in_progress}</div>
                        <div className="text-sm text-blue-700">In Progress</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="text-2xl font-bold text-green-900">{stats.resolved}</div>
                        <div className="text-sm text-green-700">Resolved</div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by title, citizen name, or ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                        </div>

                        {/* Status Filter */}
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                        >
                            <option value="all">All Status</option>
                            <option value="open">Open</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="rejected">Rejected</option>
                        </select>

                        {/* More Filters Button */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="inline-flex items-center space-x-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <SlidersHorizontal className="w-4 h-4" />
                            <span>Filters</span>
                            {activeFiltersCount > 0 && (
                                <span className="px-2 py-0.5 bg-orange-600 text-white text-xs rounded-full">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Advanced Filters */}
                    {showFilters && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category
                                    </label>
                                    <select
                                        value={categoryFilter}
                                        onChange={(e) => setCategoryFilter(e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                                    >
                                        {CATEGORIES.map(cat => (
                                            <option key={cat.value} value={cat.value}>
                                                {cat.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Sort By
                                    </label>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                                    >
                                        <option value="newest">Newest First</option>
                                        <option value="oldest">Oldest First</option>
                                        <option value="priority">Priority</option>
                                    </select>
                                </div>
                            </div>

                            {activeFiltersCount > 0 && (
                                <button
                                    onClick={clearFilters}
                                    className="mt-4 inline-flex items-center space-x-2 text-sm text-orange-600 hover:text-orange-700 font-medium"
                                >
                                    <X className="w-4 h-4" />
                                    <span>Clear all filters</span>
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Complaints Table */}
                {paginatedComplaints.length === 0 ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                        <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No complaints found
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Try adjusting your search or filter criteria
                        </p>
                        {activeFiltersCount > 0 && (
                            <button
                                onClick={clearFilters}
                                className="text-orange-600 hover:text-orange-700 font-medium"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden md:block bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Complaint</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {paginatedComplaints.map((complaint) => (
                                        <tr key={complaint.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-medium text-gray-900">#{complaint.id}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    {complaint.photo_url ? (
                                                        <img src={complaint.photo_url} alt="" className="w-12 h-12 rounded object-cover" />
                                                    ) : (
                                                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                                                            <CategoryIcon category={complaint.category} />
                                                        </div>
                                                    )}
                                                    <div className="min-w-0">
                                                        <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                                            {complaint.title}
                                                        </div>
                                                        <div className="text-xs text-gray-500">by {complaint.citizen_name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-gray-600 capitalize">
                                                    {complaint.category.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <StatusBadge status={complaint.status} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <PriorityBadge priority={complaint.priority} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {formatRelativeDate(complaint.created_at)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => window.location.href = `/dashboard/complaint/${complaint.id}`}
                                                    className="text-orange-600 hover:text-orange-700 font-medium text-sm"
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden space-y-4">
                            {paginatedComplaints.map((complaint) => (
                                <div
                                    key={complaint.id}
                                    onClick={() => window.location.href = `/dashboard/complaint/${complaint.id}`}
                                    className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-xs font-medium text-gray-500">#{complaint.id}</span>
                                            <StatusBadge status={complaint.status} />
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-400" />
                                    </div>

                                    <h3 className="text-sm font-semibold text-gray-900 mb-2">
                                        {complaint.title}
                                    </h3>

                                    <div className="flex items-center justify-between text-xs text-gray-600">
                                        <span className="capitalize">{complaint.category.replace('_', ' ')}</span>
                                        <span>{formatRelativeDate(complaint.created_at)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-6 flex items-center justify-between">
                                <div className="text-sm text-gray-600">
                                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredComplaints.length)} of {filteredComplaints.length} complaints
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                                    >
                                        Previous
                                    </button>
                                    <span className="px-4 py-2 text-sm text-gray-700">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
