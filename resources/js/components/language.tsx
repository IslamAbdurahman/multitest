import AppearanceTabs from '@/components/appearance-tabs';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

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
        <div className="relative flex justify-end" ref={dropdownRef}>
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 rounded-2xl border border-slate-200/60 bg-white/80 px-4 py-2 text-sm font-bold shadow-sm backdrop-blur-xl transition-all hover:bg-white active:scale-95 dark:border-slate-800/60 dark:bg-slate-900/80 dark:text-white dark:hover:bg-slate-900"
            >
                <span className="text-lg leading-none">
                    {i18n.language === 'uz' ? '🇺🇿' : i18n.language === 'en' ? '🇬🇧' : '🇷🇺'}
                </span>
                <span className="hidden sm:inline-block">
                    {i18n.language === 'uz' ? 'Oʻzbekcha' : i18n.language === 'en' ? 'English' : 'Русский'}
                </span>
            </button>

            {open && (
                <div className="absolute right-0 z-[100] mt-3 w-48 overflow-hidden rounded-[1.5rem] border border-slate-200/60 bg-white/95 p-2 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-200 dark:border-slate-800/60 dark:bg-slate-900/95">
                    <div className="mb-2 px-3 pt-2 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                        {t('lang.title') ?? 'Select Language'}
                    </div>
                    <button
                        onClick={() => changeLanguage('uz')}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-all ${
                            i18n.language === 'uz' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                        }`}
                    >
                        <span className="text-lg">🇺🇿</span>
                        {t('lang.uz')}
                    </button>
                    <button
                        onClick={() => changeLanguage('en')}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-all ${
                            i18n.language === 'en' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                        }`}
                    >
                        <span className="text-lg">🇬🇧</span>
                        {t('lang.en')}
                    </button>
                    <button
                        onClick={() => changeLanguage('ru')}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-all ${
                            i18n.language === 'ru' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                        }`}
                    >
                        <span className="text-lg">🇷🇺</span>
                        {t('lang.ru')}
                    </button>
                    
                    <div className="my-2 h-px bg-slate-100 dark:bg-slate-800" />
                    
                    <div className="px-1 pb-1">
                        <AppearanceTabs className="flex flex-col gap-1 rounded-xl bg-slate-50 p-1 dark:bg-slate-800/50" />
                    </div>
                </div>
            )}
        </div>
    );

};

export default LanguageBar;
