'use client';

import React, { useState } from 'react';
import { Shield, User, LogOut, Plus, Search, Clock, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function LanguageDemo() {
    const { language, t } = useLanguage();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const mockComplaints = [
        {
            id: 1,
            title: language === 'en' ? 'Large pothole on Main Street' : 'मुख्य रस्त्यावर मोठा खड्डा',
            category: 'pothole',
            status: 'in_progress',
            created_at: '2026-01-20T10:30:00Z'
        },
        {
            id: 2,
            title: language === 'en' ? 'Garbage not collected for 3 days' : '३ दिवसांपासून कचरा गोळा केला गेला नाही',
            category: 'garbage',
            status: 'resolved',
            created_at: '2026-01-18T14:20:00Z'
        },
        {
            id: 3,
            title: language === 'en' ? 'Street light not working' : 'रस्त्याचा दिवा काम करत नाही',
            category: 'street_light',
            status: 'open',
            created_at: '2026-01-15T08:45:00Z'
        }
    ];

    const stats = {
        total: 3,
        open: 1,
        in_progress: 1,
        resolved: 1
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const configs: Record<string, { bg: string; text: string }> = {
            open: { bg: 'bg-amber-100', text: 'text-amber-800' },
            in_progress: { bg: 'bg-blue-100', text: 'text-blue-800' },
            resolved: { bg: 'bg-green-100', text: 'text-green-800' }
        };

        const config = configs[status];

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                {t(status === 'in_progress' ? 'inProgress' : (status as any))}
            </span>
        );
    };

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

                        {/* Right side actions */}
                        <div className="flex items-center space-x-3">
                            {/* Language Switcher */}
                            <LanguageSwitcher />

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
                                        {language === 'en' ? 'Rajesh Kumar' : 'राजेश कुमार'}
                                    </span>
                                </button>

                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                                            <User className="w-4 h-4" />
                                            <span>{t('profile')}</span>
                                        </button>
                                        <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2">
                                            <LogOut className="w-4 h-4" />
                                            <span>{t('logout')}</span>
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
                            {t('myComplaints')}
                        </h1>
                        <p className="text-gray-600">
                            {t('trackComplaints')}
                        </p>
                    </div>
                    <button className="mt-4 sm:mt-0 inline-flex items-center space-x-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold transition-colors shadow-sm">
                        <Plus className="w-5 h-5" />
                        <span>{t('newComplaint')}</span>
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                        <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                        <div className="text-sm text-gray-600">{t('totalComplaints')}</div>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-xl shadow-sm border border-amber-200">
                        <div className="text-2xl font-bold text-amber-900">{stats.open}</div>
                        <div className="text-sm text-amber-700">{t('open')}</div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl shadow-sm border border-blue-200">
                        <div className="text-2xl font-bold text-blue-900">{stats.in_progress}</div>
                        <div className="text-sm text-blue-700">{t('inProgress')}</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl shadow-sm border border-green-200">
                        <div className="text-2xl font-bold text-green-900">{stats.resolved}</div>
                        <div className="text-sm text-green-700">{t('resolved')}</div>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder={t('searchPlaceholder')}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                        </div>
                        <select className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white">
                            <option>{t('allStatus')}</option>
                            <option>{t('open')}</option>
                            <option>{t('inProgress')}</option>
                            <option>{t('resolved')}</option>
                        </select>
                    </div>
                </div>

                {/* Complaints List */}
                <div className="space-y-4">
                    {mockComplaints.map((complaint) => (
                        <div
                            key={complaint.id}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer p-6"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center space-x-2">
                                    <span className="text-xs font-medium text-gray-500">#{complaint.id}</span>
                                    <StatusBadge status={complaint.status} />
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {complaint.title}
                            </h3>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <Clock className="w-4 h-4" />
                                <span>{new Date(complaint.created_at).toLocaleDateString(language === 'en' ? 'en-US' : 'mr-IN')}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Demo Info */}
                <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex items-start space-x-3">
                        <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="text-lg font-semibold text-blue-900 mb-2">
                                {language === 'en' ? '🌐 Language System Demo' : '🌐 भाषा प्रणाली डेमो'}
                            </h3>
                            <p className="text-sm text-blue-800 mb-3">
                                {language === 'en'
                                    ? 'Click the globe icon (🌐) in the top-right corner to switch between English and Marathi. The entire interface updates instantly!'
                                    : 'इंग्रजी आणि मराठी दरम्यान स्विच करण्यासाठी वरच्या-उजव्या कोपर्यातील ग्लोब आयकन (🌐) वर क्लिक करा. संपूर्ण इंटरफेस त्वरित अपडेट होतो!'}
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
                                <li>{language === 'en' ? 'All UI text translates automatically' : 'सर्व UI मजकूर स्वयंचलितपणे अनुवादित होतो'}</li>
                                <li>{language === 'en' ? 'Language preference saves to localStorage' : 'भाषा प्राधान्य localStorage मध्ये जतन होते'}</li>
                                <li>{language === 'en' ? 'Works across all pages (when integrated)' : 'सर्व पृष्ठांवर कार्य करते (एकत्रित केल्यावर)'}</li>
                                <li>{language === 'en' ? 'Easy to add more languages' : 'अधिक भाषा जोडणे सोपे'}</li>
                            </ul>
                            <div className="mt-4 pt-4 border-t border-blue-200">
                                <p className="text-sm font-medium text-blue-900 mb-2">
                                    {language === 'en' ? 'Test the language switcher:' : 'भाषा स्विचर तपासा:'}
                                </p>
                                <p className="text-xs text-blue-700">
                                    {language === 'en'
                                        ? 'This is a demo page. To integrate this into your actual pages, I need to update each page component with the useLanguage hook and translation keys.'
                                        : 'हे एक डेमो पृष्ठ आहे. तुमच्या वास्तविक पृष्ठांमध्ये हे एकत्रित करण्यासाठी, मला प्रत्येक पृष्ठ घटक useLanguage हुक आणि अनुवाद की सह अपडेट करणे आवश्यक आहे.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
