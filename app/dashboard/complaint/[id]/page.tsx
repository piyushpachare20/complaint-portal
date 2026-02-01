'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
    ArrowLeft, Shield, MapPin, Calendar, User, Clock,
    CheckCircle, Loader2, FileImage, X, AlertCircle,
    Edit3, Save, ChevronDown, Send
} from 'lucide-react';

// Mock complaint data - in production, fetch based on ID
const MOCK_COMPLAINTS = [
    {
        id: 47,
        title: 'Large pothole on Main Street near City Hall',
        description: 'There is a deep pothole approximately 2 feet wide and 6 inches deep on Main Street, about 50 meters from City Hall. It has been causing issues for vehicles and motorcycles. The pothole is located in the right lane heading towards the market area. Several vehicles have already damaged their tires. This is also a safety hazard during nighttime as the area is poorly lit.',
        category: 'pothole',
        status: 'in_progress',
        photo_url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
        latitude: 19.1405,
        longitude: 73.8177,
        created_at: '2026-01-20T10:30:00Z',
        updated_at: '2026-01-26T14:20:00Z',
        resolved_at: null,
        resolution_remarks: null,
        created_by: 'user_123',
        assigned_to: 'nagarasevaka_456',
        ward_id: 5,
        citizen_name: 'Rajesh Kumar',
        citizen_phone: '+91 98765 43210',
        nagarasevaka_name: 'Priya Sharma'
    },
    {
        id: 46,
        title: 'Water leak on Park Road near temple',
        description: 'Continuous water leak from main pipeline causing road damage and water wastage.',
        category: 'water_leak',
        status: 'resolved',
        photo_url: 'https://images.unsplash.com/photo-1584555613497-9ecf9dd06f68?w=800',
        latitude: 19.1410,
        longitude: 73.8180,
        created_at: '2026-01-22T14:20:00Z',
        updated_at: '2026-01-26T08:15:00Z',
        resolved_at: '2026-01-26T08:15:00Z',
        resolution_remarks: 'Pipeline repaired successfully.',
        created_by: 'user_124',
        assigned_to: 'nagarasevaka_456',
        ward_id: 5,
        citizen_name: 'Sunita Desai',
        citizen_phone: '+91 98765 43211',
        nagarasevaka_name: 'Priya Sharma'
    }
];

// Category details
const CATEGORIES: Record<string, { label: string; icon: string }> = {
    pothole: { label: 'Pothole', icon: '🕳️' },
    garbage: { label: 'Garbage Collection', icon: '🗑️' },
    water_leak: { label: 'Water Leak', icon: '💧' },
    street_light: { label: 'Street Light', icon: '💡' },
    drainage: { label: 'Drainage Issue', icon: '🚰' },
    other: { label: 'Other', icon: '📋' }
};

// Status badge
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
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
};

export default function NagaRasevakaComplaintDetail() {
    const params = useParams();
    const complaintId = params?.id ? parseInt(params.id as string) : null;

    const [complaint, setComplaint] = useState<any>(null);
    const [statusHistory, setStatusHistory] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showImageModal, setShowImageModal] = useState(false);

    // Update form state
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [remarks, setRemarks] = useState('');
    const [formError, setFormError] = useState('');

    // Quick action buttons state
    const [showQuickActions, setShowQuickActions] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            const foundComplaint = MOCK_COMPLAINTS.find(c => c.id === complaintId);

            if (foundComplaint) {
                setComplaint(foundComplaint);
                setNewStatus(foundComplaint.status);

                // Generate status history
                const history = [
                    {
                        id: 1,
                        old_status: null,
                        new_status: 'open',
                        remarks: null,
                        updated_by: foundComplaint.citizen_name,
                        role: 'Citizen',
                        created_at: foundComplaint.created_at
                    }
                ];

                if (foundComplaint.status === 'in_progress' || foundComplaint.status === 'resolved') {
                    history.push({
                        id: 2,
                        old_status: 'open',
                        new_status: 'in_progress',
                        remarks: 'Team has been dispatched to inspect the site. Work will begin within 48 hours.',
                        updated_by: foundComplaint.nagarasevaka_name,
                        role: 'Nagarasevaka',
                        created_at: foundComplaint.updated_at
                    });
                }

                if (foundComplaint.status === 'resolved') {
                    history.push({
                        id: 3,
                        old_status: 'in_progress',
                        new_status: 'resolved',
                        remarks: foundComplaint.resolution_remarks || 'Issue has been resolved successfully.',
                        updated_by: foundComplaint.nagarasevaka_name,
                        role: 'Nagarasevaka',
                        created_at: foundComplaint.resolved_at || foundComplaint.updated_at
                    });
                }

                setStatusHistory(history);
            }

            setIsLoading(false);
        }, 600);
    }, [complaintId]);

    const handleStatusUpdate = async () => {
        setFormError('');

        // Validation
        if (!newStatus) {
            setFormError('Please select a status');
            return;
        }

        if (newStatus !== complaint.status && !remarks.trim()) {
            setFormError('Please provide remarks when changing status');
            return;
        }

        if (remarks.length > 500) {
            setFormError('Remarks must be less than 500 characters');
            return;
        }

        setIsUpdating(true);

        // Simulate API call
        setTimeout(() => {
            console.log('Status updated:', { newStatus, remarks });

            // Update complaint
            setComplaint((prev: any) => ({
                ...prev,
                status: newStatus,
                resolution_remarks: newStatus === 'resolved' ? remarks : prev.resolution_remarks,
                resolved_at: newStatus === 'resolved' ? new Date().toISOString() : null,
                updated_at: new Date().toISOString()
            }));

            // Add to history
            setStatusHistory(prev => [...prev, {
                id: prev.length + 1,
                old_status: complaint.status,
                new_status: newStatus,
                remarks: remarks || null,
                updated_by: 'Priya Sharma',
                role: 'Nagarasevaka',
                created_at: new Date().toISOString()
            }]);

            setRemarks('');
            setIsUpdating(false);
            setUpdateSuccess(true);

            // Hide success message after 3 seconds
            setTimeout(() => setUpdateSuccess(false), 3000);

            // In production: API call to update complaint
        }, 1500);
    };

    const handleQuickResolve = () => {
        setNewStatus('resolved');
        setRemarks('Issue has been resolved successfully.');
        setShowQuickActions(false);
    };

    const handleQuickProgress = () => {
        setNewStatus('in_progress');
        setRemarks('Work is currently in progress.');
        setShowQuickActions(false);
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
                    <p className="text-gray-600 mb-6">This complaint doesn't exist or is not in your ward.</p>
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
    const statusChanged = newStatus !== complaint.status;

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
                            <span className="font-medium">Back to List</span>
                        </button>

                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Success Banner */}
            {updateSuccess && (
                <div className="bg-green-50 border-b border-green-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                        <div className="flex items-center space-x-2 text-green-800">
                            <CheckCircle className="w-5 h-5" />
                            <span className="font-medium">Status updated successfully!</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                                <FileImage className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
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

                        {/* Update Status Form */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-2">
                                    <Edit3 className="w-5 h-5 text-orange-600" />
                                    <h2 className="text-xl font-semibold text-gray-900">Update Status</h2>
                                </div>
                                {/* Quick Actions Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowQuickActions(!showQuickActions)}
                                        className="inline-flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                                    >
                                        <span>Quick Actions</span>
                                        <ChevronDown className="w-4 h-4" />
                                    </button>

                                    {showQuickActions && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                                            <button
                                                onClick={handleQuickProgress}
                                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Mark as In Progress
                                            </button>
                                            <button
                                                onClick={handleQuickResolve}
                                                className="w-full px-4 py-2 text-left text-sm text-green-700 hover:bg-green-50"
                                            >
                                                Mark as Resolved
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {formError && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
                                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-red-800">{formError}</p>
                                </div>
                            )}

                            <div className="space-y-4">
                                {/* Status Dropdown */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">
                                        New Status
                                    </label>
                                    <select
                                        value={newStatus}
                                        onChange={(e) => setNewStatus(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    >
                                        <option value="open">Open</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="resolved">Resolved</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                    {statusChanged && (
                                        <p className="mt-1.5 text-xs text-orange-600">
                                            Status will change from <strong>{complaint.status.replace('_', ' ')}</strong> to <strong>{newStatus.replace('_', ' ')}</strong>
                                        </p>
                                    )}
                                </div>

                                {/* Remarks Textarea */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">
                                        Remarks {statusChanged && <span className="text-red-600">*</span>}
                                    </label>
                                    <textarea
                                        value={remarks}
                                        onChange={(e) => setRemarks(e.target.value)}
                                        maxLength={500}
                                        rows={4}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                                        placeholder="Provide details about the status update, actions taken, or next steps..."
                                    />
                                    <div className="flex items-center justify-between mt-1.5">
                                        <p className="text-xs text-gray-500">
                                            {statusChanged ? 'Required when changing status' : 'Optional'}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {remarks.length}/500
                                        </p>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    onClick={handleStatusUpdate}
                                    disabled={isUpdating}
                                    className="w-full flex items-center justify-center space-x-2 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isUpdating ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Updating...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5" />
                                            <span>Update Status</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Status Timeline */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Status History</h2>
                            <div className="space-y-6">
                                {statusHistory.map((update, index) => (
                                    <div key={update.id} className="relative">
                                        {index < statusHistory.length - 1 && (
                                            <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-gray-200"></div>
                                        )}

                                        <div className="flex items-start space-x-4">
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
                                                <div className="flex items-center space-x-2 mt-2">
                                                    <span className="text-xs text-gray-500">Updated by</span>
                                                    <span className="text-xs font-medium text-gray-700">{update.updated_by}</span>
                                                    <span className="text-xs text-gray-400">•</span>
                                                    <span className="text-xs text-gray-500">{update.role}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Citizen Details Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Citizen Details</h2>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <User className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <div className="text-sm font-medium text-gray-500">Name</div>
                                        <div className="text-sm text-gray-900">{complaint.citizen_name}</div>
                                    </div>
                                </div>

                                {complaint.citizen_phone && (
                                    <div className="flex items-start space-x-3">
                                        <Send className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <div className="text-sm font-medium text-gray-500">Phone</div>
                                            <a href={`tel:${complaint.citizen_phone}`} className="text-sm text-orange-600 hover:text-orange-700">
                                                {complaint.citizen_phone}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-start space-x-3">
                                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <div className="text-sm font-medium text-gray-500">Submitted on</div>
                                        <div className="text-sm text-gray-900">{formatDate(complaint.created_at)}</div>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <div className="text-sm font-medium text-gray-500">Last updated</div>
                                        <div className="text-sm text-gray-900">{formatRelativeDate(complaint.updated_at)}</div>
                                    </div>
                                </div>
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

                        {/* Action Tips */}
                        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                            <div className="flex items-start space-x-3">
                                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-blue-900">
                                    <p className="font-medium mb-1">Status Update Tips:</p>
                                    <ul className="list-disc list-inside space-y-1 text-blue-800">
                                        <li>Provide clear, actionable remarks</li>
                                        <li>Update citizens on progress regularly</li>
                                        <li>Mark resolved only when fully completed</li>
                                        <li>Include next steps if still in progress</li>
                                    </ul>
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
