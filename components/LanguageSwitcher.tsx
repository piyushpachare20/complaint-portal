'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Globe, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export default function LanguageSwitcher() {
    const { language, changeLanguage } = useLanguage();
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center space-x-2 p-2 text-gray-600 hover:text-orange-600 transition-colors rounded-lg hover:bg-gray-100"
                aria-label="Change language"
            >
                <Globe className="w-5 h-5" />
                <span className="hidden sm:inline text-sm font-medium">
                    {language === 'en' ? 'EN' : 'मर'}
                </span>
            </button>

            {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <button
                        onClick={() => {
                            changeLanguage('en');
                            setShowMenu(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center justify-between transition-colors ${language === 'en' ? 'text-orange-600 font-medium bg-orange-50' : 'text-gray-700'
                            }`}
                    >
                        <span>English</span>
                        {language === 'en' && <CheckCircle className="w-4 h-4" />}
                    </button>
                    <button
                        onClick={() => {
                            changeLanguage('mr');
                            setShowMenu(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center justify-between transition-colors ${language === 'mr' ? 'text-orange-600 font-medium bg-orange-50' : 'text-gray-700'
                            }`}
                    >
                        <span>मराठी (Marathi)</span>
                        {language === 'mr' && <CheckCircle className="w-4 h-4" />}
                    </button>
                </div>
            )}
        </div>
    );
}
