import { Icon } from '@iconify/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Logo from '../Header/Logo';
import { headerData } from '../Header/Navigation/menuData';

const Footer: React.FC = () => {
    const { t } = useTranslation();

    // Default domain set to the platform name for Multilevel Uzbekistan
    const domain = typeof window !== 'undefined' ? window.location.hostname : 'multitest.uz';

    const capitalizeDomain = domain
        .toLowerCase()
        .split('.')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join('.');

    const socialLinks = [
        { icon: 'tabler:brand-telegram', href: 'https://t.me/livelongevity' }, // Primary for Uzbekistan
        { icon: 'tabler:brand-instagram', href: 'https://instagram.com' },
        { icon: 'tabler:brand-youtube', href: 'https://youtube.com' },
    ];

    return (
        <footer id="contact" className="border-t border-slate-100 bg-slate-50 py-16 dark:border-slate-900 dark:bg-slate-950">
            <div className="container mx-auto px-6 md:max-w-screen-md lg:max-w-screen-xl">
                <div className="grid grid-cols-1 gap-x-16 gap-y-12 sm:grid-cols-2 lg:grid-cols-12">
                    {/* 🏢 Brand Section */}
                    <div className="col-span-1 sm:col-span-2 lg:col-span-5">
                        <Logo />
                        <p className="mt-6 max-w-sm text-base leading-relaxed text-slate-500 dark:text-slate-400">
                            <span className="font-bold text-slate-900 dark:text-white">{capitalizeDomain}</span> —{' '}
                            {t('footer.description')}
                        </p>
                        <div className="mt-8 flex items-center gap-5">
                            {socialLinks.map((social, idx) => (
                                <a
                                    key={idx}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href={social.href}
                                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-all hover:-translate-y-1 hover:border-indigo-500 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:text-indigo-400"
                                >
                                    <Icon icon={social.icon} className="text-2xl" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* 🔗 Quick Links */}
                    <div className="col-span-1 lg:col-span-3">
                        <h3 className="mb-6 text-sm font-black tracking-widest text-slate-900 uppercase dark:text-white">
                            {t('footer.quick_links')}
                        </h3>
                        <ul className="space-y-4">
                            {headerData.map((item, index) => (
                                <li key={index}>
                                    <a
                                        href={item.href}
                                        className="font-medium text-slate-500 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                                    >
                                        {t(item.label)}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 📞 Contact Info */}
                    <div className="col-span-1 lg:col-span-4">
                        <h3 className="mb-6 text-sm font-black tracking-widest text-slate-900 uppercase dark:text-white">
                            {t('footer.contact')}
                        </h3>
                        <div className="space-y-5">
                            <div className="flex items-start gap-4">
                                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400">
                                    <Icon icon="tabler:map-pin" className="text-xl" />
                                </div>
                                <span className="font-medium text-slate-600 dark:text-slate-400">{t('footer.location')}</span>
                            </div>

                            <a href="tel:+998911157709" className="group flex items-center gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 transition-all group-hover:bg-emerald-600 group-hover:text-white dark:bg-emerald-900/20 dark:text-emerald-400">
                                    <Icon icon="tabler:phone" className="text-xl" />
                                </div>
                                <span className="font-medium text-slate-600 transition-colors group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-white">
                                    +998 91 115 77 09
                                </span>
                            </a>

                            <a href="https://t.me/livelongevity" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600 transition-all group-hover:bg-sky-600 group-hover:text-white dark:bg-sky-900/20 dark:text-sky-400">
                                    <Icon icon="tabler:brand-telegram" className="text-xl" />
                                </div>
                                <span className="font-medium text-slate-600 transition-colors group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-white">
                                    {t('footer.support_telegram')}
                                </span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* 📜 Bottom Bar */}
                <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-8 md:flex-row dark:border-slate-900">
                    <span className="text-center text-sm font-medium text-slate-400 dark:text-slate-500">
                        © {new Date().getFullYear()} <span className="font-bold text-slate-900 dark:text-slate-200">{capitalizeDomain}</span>.{' '}
                        {t('footer.rights_reserved')}
                    </span>
                    <div className="flex gap-8 text-xs font-bold tracking-widest text-slate-400 uppercase">
                        <a href="#" className="transition-colors hover:text-indigo-600">
                            {t('footer.privacy')}
                        </a>
                        <a href="#" className="transition-colors hover:text-indigo-600">
                            {t('footer.terms')}
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
