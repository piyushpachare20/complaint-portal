'use client';

import React, { useState, useEffect } from 'react';
import {
    ArrowLeft, Shield, MapPin, Calendar, User, Clock,
    CheckCircle, Loader2, Image, X, Share2, AlertCircle
} from 'lucide-react';
import { useParams } from 'next/navigation';

// Mock complaints data - matches the My Complaints page
const MOCK_COMPLAINTS = [
    {
        id: 1,
        title: 'Large pothole on Main Street near City Hall',
        description: 'There is a deep pothole approximately 2 feet wide and 6 inches deep on Main Street, about 50 meters from City Hall. It has been causing issues for vehicles and motorcycles. The pothole is located in the right lane heading towards the market area. Several vehicles have already damaged their tires. This is also a safety hazard during nighttime as the area is poorly lit.',
        category: 'pothole',
        status: 'in_progress',
        photo_url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
        latitude: 19.1405,
        longitude: 73.8177,
        created_at: '2026-01-20T10:30:00Z',
        updated_at: '2026-01-23T14:20:00Z',
        resolved_at: null,
        resolution_remarks: null,
        created_by: 'user_123',
        assigned_to: 'nagarasevaka_456',
        ward_id: 5,
        citizen_name: 'Rajesh Kumar',
        nagarasevaka_name: 'Priya Sharma'
    },
    {
        id: 2,
        title: 'Garbage not collected for 3 days',
        description: 'The garbage bin at Park Road has been overflowing for the past three days. The municipal garbage truck has not arrived for collection. This is causing a foul smell and attracting stray animals. Residents are concerned about health hazards. The bin is located near house number 45.',
        category: 'garbage',
        status: 'resolved',
        photo_url: null,
        latitude: 19.1412,
        longitude: 73.8185,
        created_at: '2026-01-18T14:20:00Z',
        updated_at: '2026-01-22T09:15:00Z',
        resolved_at: '2026-01-22T09:15:00Z',
        resolution_remarks: 'Garbage collected. Regular schedule resumed.',
        created_by: 'user_124',
        assigned_to: 'nagarasevaka_457',
        ward_id: 5,
        citizen_name: 'Sunita Patel',
        nagarasevaka_name: 'Amit Desai'
    },
    {
        id: 3,
        title: 'Street light not working on Gandhi Road',
        description: 'Street light pole #234 has been non-functional for over a week. The area becomes very dark at night, making it unsafe for pedestrians and creating security concerns. This is a busy road with shops that operate until late evening.',
        category: 'street_light',
        status: 'open',
        photo_url: null,
        latitude: 19.1398,
        longitude: 73.8165,
        created_at: '2026-01-15T08:45:00Z',
        updated_at: '2026-01-15T08:45:00Z',
        resolved_at: null,
        resolution_remarks: null,
        created_by: 'user_125',
        assigned_to: null,
        ward_id: 5,
        citizen_name: 'Vikram Singh',
        nagarasevaka_name: null
    },
    {
        id: 4,
        title: 'Water leak from main pipeline',
        description: 'There is a continuous water leak from the main pipeline near the temple area. Water is flowing onto the road and causing damage to the road surface. This has been ongoing for 4-5 days. A lot of clean water is being wasted.',
        category: 'water_leak',
        status: 'in_progress',
        photo_url: 'https://images.unsplash.com/photo-1584555613497-9ecf9dd06f68?w=800',
        latitude: 19.1420,
        longitude: 73.8190,
        created_at: '2026-01-10T16:30:00Z',
        updated_at: '2026-01-21T11:00:00Z',
        resolved_at: null,
        resolution_remarks: null,
        created_by: 'user_126',
        assigned_to: 'nagarasevaka_458',
        ward_id: 5,
        citizen_name: 'Meera Joshi',
        nagarasevaka_name: 'Rahul Mehta'
    },
    {
        id: 5,
        title: 'Blocked drainage causing water logging',
        description: 'The drainage system near the school is completely blocked. During rain, water accumulates and causes flooding in the area. Children have difficulty reaching school. The drain needs urgent cleaning and repair.',
        category: 'drainage',
        status: 'resolved',
        photo_url: null,
        latitude: 19.1388,
        longitude: 73.8172,
        created_at: '2026-01-05T11:00:00Z',
        updated_at: '2026-01-12T14:30:00Z',
        resolved_at: '2026-01-12T14:30:00Z',
        resolution_remarks: 'Drainage cleaned and repaired. Flow restored.',
        created_by: 'user_127',
        assigned_to: 'nagarasevaka_459',
        ward_id: 5,
        citizen_name: 'Anil Rao',
        nagarasevaka_name: 'Kavita Nair'
    }
];

// Mock status history
const MOCK_STATUS_HISTORY = [
    {
        id: 1,
        old_status: null,
        new_status: 'open',
        remarks: null,
        updated_by: 'Rajesh Kumar',
        created_at: '2026-01-20T10:30:00Z'
    },
    {
        id: 2,
        old_status: 'open',
        new_status: 'in_progress',
        remarks: 'Team has been dispatched to inspect the site. Work will begin within 48 hours.',
        updated_by: 'Priya Sharma',
        created_at: '2026-01-22T09:15:00Z'
    }
];

// Category details
const CATEGORIES: Record<string, { label: string; icon: string; color: string }> = {
    pothole: { label: 'Pothole', icon: '🕳️', color: 'orange' },
    garbage: { label: 'Garbage Collection', icon: '🗑️', color: 'green' },
    water_leak: { label: 'Water Leak', icon: '💧', color: 'blue' },
    street_light: { label: 'Street Light', icon: '💡', color: 'yellow' },
    drainage: { label: 'Drainage Issue', icon: '🚰', color: 'purple' },
    other: { label: 'Other', icon: '📋', color: 'gray' }
};

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
    const configs: Record<string, { bg: string; text: string; label: string; icon: any }> = {
        open: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Open', icon: Clock },
        in_progress: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'In Progress', icon: Loader2 },
        resolved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Resolved', icon: CheckCircle },
        rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected', icon: X }
    };

    const config = configs[status] || configs.open;
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
            <Icon className="w-4 h-4" />
            <span>{config.label}</span>
        </span>
    );
};

// Format date
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
};

export default function ComplaintDetailPage() {
    const params = useParams();
    const complaintId = params?.id ? parseInt(params.id as string) : null;

    const [complaint, setComplaint] = useState<any>(null);
    const [statusHistory, setStatusHistory] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showImageModal, setShowImageModal] = useState(false);

    // Simulated data loading - find complaint by ID
    useEffect(() => {
        setTimeout(() => {
            if (complaintId) {
                const foundComplaint = MOCK_COMPLAINTS.find(c => c.id === complaintId);
                setComplaint(foundComplaint || null);

                // Generate mock status history based on complaint status
                if (foundComplaint) {
                    const history = [
                        {
                            id: 1,
                            old_status: null,
                            new_status: 'open',
                            remarks: null,
                            updated_by: foundComplaint.citizen_name,
                            created_at: foundComplaint.created_at
                        }
                    ];

                    if (foundComplaint.status === 'in_progress' || foundComplaint.status === 'resolved') {
                        history.push({
                            id: 2,
                            old_status: 'open',
                            new_status: 'in_progress',
                            remarks: 'Team has been dispatched to inspect the site. Work is in progress.',
                            updated_by: foundComplaint.nagarasevaka_name || 'Municipal Team',
                            created_at: foundComplaint.updated_at
                        });
                    }

                    if (foundComplaint.status === 'resolved') {
                        history.push({
                            id: 3,
                            old_status: 'in_progress',
                            new_status: 'resolved',
                            remarks: foundComplaint.resolution_remarks || 'Issue has been resolved successfully.',
                            updated_by: foundComplaint.nagarasevaka_name || 'Municipal Team',
                            created_at: foundComplaint.resolved_at || foundComplaint.updated_at
                        });
                    }

                    setStatusHistory(history);
                }
            }
            setIsLoading(false);
        }, 600);
    }, [complaintId]);

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: complaint.title,
                text: `Check out this complaint: ${complaint.title}`,
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
            </div>
        );
    }

    if (!complaint) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center px-4">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Complaint Not Found</h2>
                    <p className="text-gray-600 mb-6">This complaint doesn't exist or you don't have permission to view it.</p>
                    <button
                        onClick={() => window.history.back()}
                        className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const category = CATEGORIES[complaint.category];

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-40">
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
                            <button
                                onClick={handleShare}
                                className="p-2 text-gray-600 hover:text-orange-600 transition-colors rounded-lg hover:bg-gray-100"
                            >
                                <Share2 className="w-5 h-5" />
                            </button>
                            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center space-x-3 mb-3">
                        <span className="text-4xl">{category.icon}</span>
                        <div>
                            <div className="text-sm font-medium text-gray-500 mb-1">
                                Complaint #{complaint.id} • {category.label}
                            </div>
                            <StatusBadge status={complaint.status} />
                        </div>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4">
                        {complaint.title}
                    </h1>
                </div>

                {/* Photo */}
                {complaint.photo_url && (
                    <div className="mb-8">
                        <div className="relative rounded-2xl overflow-hidden shadow-lg cursor-pointer group">
                            <img
                                src={complaint.photo_url}
                                alt={complaint.title}
                                onClick={() => setShowImageModal(true)}
                                className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                <Image className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Description */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                {complaint.description}
                            </p>
                        </div>

                        {/* Status Timeline */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Status Timeline</h2>
                            <div className="space-y-6">
                                {statusHistory.map((update, index) => (
                                    <div key={update.id} className="relative">
                                        {/* Timeline line */}
                                        {index < statusHistory.length - 1 && (
                                            <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-gray-200"></div>
                                        )}

                                        <div className="flex items-start space-x-4">
                                            {/* Timeline dot */}
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${update.new_status === 'resolved' ? 'bg-green-100' :
                                                update.new_status === 'in_progress' ? 'bg-blue-100' :
                                                    update.new_status === 'rejected' ? 'bg-red-100' :
                                                        'bg-amber-100'
                                                }`}>
                                                {update.new_status === 'resolved' ? (
                                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                                ) : update.new_status === 'in_progress' ? (
                                                    <Loader2 className="w-5 h-5 text-blue-600" />
                                                ) : (
                                                    <Clock className="w-5 h-5 text-amber-600" />
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 pb-6">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h3 className="font-semibold text-gray-900 capitalize">
                                                        {update.new_status.replace('_', ' ')}
                                                    </h3>
                                                    <span className="text-sm text-gray-500">
                                                        {formatRelativeDate(update.created_at)}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-1">
                                                    {formatDate(update.created_at)}
                                                </p>
                                                {update.remarks && (
                                                    <p className="text-sm text-gray-700 mt-2 bg-gray-50 p-3 rounded-lg">
                                                        {update.remarks}
                                                    </p>
                                                )}
                                                <p className="text-xs text-gray-500 mt-2">
                                                    Updated by {update.updated_by}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Details Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Details</h2>
                            <div className="space-y-4">
                                {/* Submitted By */}
                                <div className="flex items-start space-x-3">
                                    <User className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <div className="text-sm font-medium text-gray-500">Submitted by</div>
                                        <div className="text-sm text-gray-900">{complaint.citizen_name}</div>
                                    </div>
                                </div>

                                {/* Date */}
                                <div className="flex items-start space-x-3">
                                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <div className="text-sm font-medium text-gray-500">Submitted on</div>
                                        <div className="text-sm text-gray-900">{formatDate(complaint.created_at)}</div>
                                    </div>
                                </div>

                                {/* Last Updated */}
                                <div className="flex items-start space-x-3">
                                    <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <div className="text-sm font-medium text-gray-500">Last updated</div>
                                        <div className="text-sm text-gray-900">{formatRelativeDate(complaint.updated_at)}</div>
                                    </div>
                                </div>

                                {/* Assigned To */}
                                {complaint.nagarasevaka_name && (
                                    <div className="flex items-start space-x-3">
                                        <User className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <div className="text-sm font-medium text-gray-500">Assigned to</div>
                                            <div className="text-sm text-gray-900">{complaint.nagarasevaka_name}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Location Card */}
                        {complaint.latitude && complaint.longitude && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Location</h2>
                                <div className="flex items-start space-x-3 mb-4">
                                    <MapPin className="w-5 h-5 text-orange-600 mt-0.5" />
                                    <div>
                                        <div className="text-sm text-gray-600">
                                            {complaint.latitude.toFixed(6)}, {complaint.longitude.toFixed(6)}
                                        </div>
                                    </div>
                                </div>

                                {/* Map placeholder */}
                                <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                                    <div className="text-center">
                                        <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-sm text-gray-500">Map view</p>
                                        <a
                                            href={`https://www.google.com/maps?q=${complaint.latitude},${complaint.longitude}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                                        >
                                            Open in Google Maps
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Help Card */}
                        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                            <div className="flex items-start space-x-3">
                                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-blue-900">
                                    <p className="font-medium mb-1">Need help?</p>
                                    <p className="text-blue-800">
                                        If you have questions about this complaint, contact your ward office or use the feedback option.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Image Modal */}
            {showImageModal && complaint.photo_url && (
                <div
                    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                    onClick={() => setShowImageModal(false)}
                >
                    <button
                        onClick={() => setShowImageModal(false)}
                        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>
                    <img
                        src={complaint.photo_url}
                        alt={complaint.title}
                        className="max-w-full max-h-full object-contain rounded-lg"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
}
