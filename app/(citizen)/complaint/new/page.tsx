'use client';

import React, { useState, useRef } from 'react';
import {
    ArrowLeft, Shield, Upload, X, MapPin, CheckCircle,
    AlertCircle, FileImage, Loader2
} from 'lucide-react';

// Category options with icons
const CATEGORIES = [
    { value: 'pothole', label: 'Pothole', icon: '🕳️' },
    { value: 'garbage', label: 'Garbage Collection', icon: '🗑️' },
    { value: 'water_leak', label: 'Water Leak', icon: '💧' },
    { value: 'street_light', label: 'Street Light', icon: '💡' },
    { value: 'drainage', label: 'Drainage Issue', icon: '🚰' },
    { value: 'other', label: 'Other', icon: '📋' }
];

export default function ComplaintSubmissionPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');
    const [isGettingLocation, setIsGettingLocation] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<{
        title: string;
        description: string;
        category: string;
        photo: File | null;
        photoPreview: string | null;
        latitude: number | null;
        longitude: number | null;
    }>({
        title: '',
        description: '',
        category: '',
        photo: null,
        photoPreview: null,
        latitude: null,
        longitude: null
    });

    const [errors, setErrors] = useState({
        title: '',
        description: '',
        category: '',
        photo: ''
    });

    // Character counts
    const titleMaxLength = 100;
    const descriptionMaxLength = 500;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
        setError('');
    };

    const handleCategorySelect = (category: string) => {
        setFormData(prev => ({ ...prev, category }));
        setErrors(prev => ({ ...prev, category: '' }));
        setError('');
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setErrors(prev => ({
                ...prev,
                photo: 'Only JPEG, PNG, and WebP images are allowed'
            }));
            return;
        }

        // Validate file size (5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            setErrors(prev => ({
                ...prev,
                photo: 'File size must be less than 5MB'
            }));
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prev => ({
                ...prev,
                photo: file,
                photoPreview: reader.result as string
            }));
            setErrors(prev => ({ ...prev, photo: '' }));
        };
        reader.readAsDataURL(file);
    };

    const handleRemovePhoto = () => {
        setFormData(prev => ({
            ...prev,
            photo: null,
            photoPreview: null
        }));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        setIsGettingLocation(true);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setFormData(prev => ({
                    ...prev,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }));
                setIsGettingLocation(false);
            },
            (error) => {
                console.error('Error getting location:', error);
                alert('Unable to get your location. Please enable location services.');
                setIsGettingLocation(false);
            }
        );
    };

    const handleRemoveLocation = () => {
        setFormData(prev => ({
            ...prev,
            latitude: null,
            longitude: null
        }));
    };

    const validateForm = () => {
        let hasError = false;
        const newErrors = { title: '', description: '', category: '', photo: '' };

        // Validate title
        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
            hasError = true;
        } else if (formData.title.trim().length < 5) {
            newErrors.title = 'Title must be at least 5 characters';
            hasError = true;
        }

        // Validate description
        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
            hasError = true;
        } else if (formData.description.trim().length < 20) {
            newErrors.description = 'Description must be at least 20 characters';
            hasError = true;
        }

        // Validate category
        if (!formData.category) {
            newErrors.category = 'Please select a category';
            hasError = true;
        }

        setErrors(newErrors);
        return !hasError;
    };

    const handleSubmit = async () => {
        setError('');

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            console.log('Complaint submitted:', formData);
            setIsLoading(false);
            setIsSuccess(true);

            // In production: 
            // 1. Upload photo to Supabase Storage
            // 2. Create complaint record with photo URL
            // 3. Redirect to /complaint/my

            setTimeout(() => {
                window.location.href = '/complaint/my';
            }, 2000);
        }, 1500);
    };

    // Success state
    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Complaint Submitted!
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Your complaint has been successfully submitted. You'll be notified when there's an update.
                    </p>
                    <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-sm text-gray-500">Redirecting to your complaints...</p>
                </div>
            </div>
        );
    }

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
                            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-lg font-bold text-gray-900 hidden sm:block">ComplaintPortal</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                        Submit a Complaint
                    </h1>
                    <p className="text-lg text-gray-600">
                        Report civic issues in your area and help improve your community
                    </p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-800">{error}</p>
                    </div>
                )}

                <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 space-y-6">
                    {/* Title Input */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-900 mb-2">
                            Complaint Title <span className="text-red-600">*</span>
                        </label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            value={formData.title}
                            onChange={handleInputChange}
                            maxLength={titleMaxLength}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${errors.title ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="e.g., Large pothole on Main Street near City Hall"
                        />
                        <div className="flex items-center justify-between mt-1.5">
                            {errors.title ? (
                                <p className="text-sm text-red-600">{errors.title}</p>
                            ) : (
                                <p className="text-sm text-gray-500">Brief, descriptive title</p>
                            )}
                            <p className="text-sm text-gray-400">
                                {formData.title.length}/{titleMaxLength}
                            </p>
                        </div>
                    </div>

                    {/* Category Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-3">
                            Category <span className="text-red-600">*</span>
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat.value}
                                    type="button"
                                    onClick={() => handleCategorySelect(cat.value)}
                                    className={`p-4 border-2 rounded-lg transition-all text-left ${formData.category === cat.value
                                        ? 'border-orange-600 bg-orange-50'
                                        : 'border-gray-200 hover:border-gray-300 bg-white'
                                        }`}
                                >
                                    <div className="text-2xl mb-1">{cat.icon}</div>
                                    <div className="text-sm font-medium text-gray-900">{cat.label}</div>
                                </button>
                            ))}
                        </div>
                        {errors.category && (
                            <p className="mt-1.5 text-sm text-red-600">{errors.category}</p>
                        )}
                    </div>

                    {/* Description Textarea */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-2">
                            Description <span className="text-red-600">*</span>
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            maxLength={descriptionMaxLength}
                            rows={6}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors resize-none ${errors.description ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Describe the issue in detail. Include location landmarks, severity, and any safety concerns..."
                        />
                        <div className="flex items-center justify-between mt-1.5">
                            {errors.description ? (
                                <p className="text-sm text-red-600">{errors.description}</p>
                            ) : (
                                <p className="text-sm text-gray-500">Minimum 20 characters</p>
                            )}
                            <p className="text-sm text-gray-400">
                                {formData.description.length}/{descriptionMaxLength}
                            </p>
                        </div>
                    </div>

                    {/* Photo Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Photo (Optional)
                        </label>

                        {!formData.photoPreview ? (
                            <div>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-orange-500 hover:bg-orange-50 transition-colors text-center"
                                >
                                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm font-medium text-gray-700 mb-1">
                                        Click to upload photo
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        JPEG, PNG, or WebP (Max 5MB)
                                    </p>
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </div>
                        ) : (
                            <div className="relative border-2 border-gray-200 rounded-lg overflow-hidden">
                                <img
                                    src={formData.photoPreview}
                                    alt="Preview"
                                    className="w-full h-64 object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={handleRemovePhoto}
                                    className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                                    <div className="flex items-center space-x-2 text-white">
                                        <FileImage className="w-4 h-4" />
                                        <span className="text-sm font-medium truncate">
                                            {formData.photo?.name}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {errors.photo && (
                            <p className="mt-1.5 text-sm text-red-600">{errors.photo}</p>
                        )}
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Location (Optional)
                        </label>

                        {formData.latitude && formData.longitude ? (
                            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <MapPin className="w-5 h-5 text-green-600" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Location captured</p>
                                        <p className="text-xs text-gray-600">
                                            {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleRemoveLocation}
                                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={handleGetLocation}
                                disabled={isGettingLocation}
                                className="w-full flex items-center justify-center space-x-2 px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isGettingLocation ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
                                        <span className="text-gray-700 font-medium">Getting location...</span>
                                    </>
                                ) : (
                                    <>
                                        <MapPin className="w-5 h-5 text-gray-600" />
                                        <span className="text-gray-700 font-medium">Add my current location</span>
                                    </>
                                )}
                            </button>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 border-t border-gray-200">
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="w-full py-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold text-lg transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                                    Submitting...
                                </>
                            ) : (
                                'Submit Complaint'
                            )}
                        </button>
                    </div>
                </div>

                {/* Help Text */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-900">
                            <p className="font-medium mb-1">Tips for better complaints:</p>
                            <ul className="list-disc list-inside space-y-1 text-blue-800">
                                <li>Be specific about the location</li>
                                <li>Upload clear photos showing the issue</li>
                                <li>Mention any safety hazards</li>
                                <li>Include nearby landmarks for easy identification</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
