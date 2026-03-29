import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AppearanceTabs from '@/components/appearance-tabs';

const LanguageBar = () => {
    const { i18n, t } = useTranslation();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
        localStorage.setItem('lang', lang);
        setOpen(false);
    };

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="flex justify-start relative" ref={dropdownRef}>
            <button
                onClick={() => setOpen(!open)}
                className="text-sm px-3 py-1 rounded border border-gray-300 shadow bg-white hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
            >
                🌐 {t('lang.title') ?? 'Language'}
            </button>

            {open && (
                <div
                    className="absolute left-0 mt-2 w-36 rounded shadow-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 z-50">
                    <button
                        onClick={() => changeLanguage('uz')}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                    >
                        🇺🇿 {t('lang.uz')}
                    </button>
                    <button
                        onClick={() => changeLanguage('en')}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                    >
                        🇬🇧 {t('lang.en')}
                    </button>
                    <button
                        onClick={() => changeLanguage('ru')}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                    >
                        🇷🇺 {t('lang.ru')}
                    </button>
                    <AppearanceTabs className={'flex flex-col gap-1'} />
                </div>
            )}
        </div>
    );
};

export default LanguageBar;
