import { Icon } from '@iconify/react';
import { Link, usePage } from '@inertiajs/react';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import AppearanceTabs from '@/components/appearance-tabs';
import LoginCard from '@/components/auth/login-card';
import RegisterCard from '@/components/auth/register-card';
import FindMockModal from '@/components/mock/find-mock-modal';
import type { SharedData } from '@/types';
import HeaderLink from '../Header/Navigation/HeaderLink';
import { headerData } from '../Header/Navigation/menuData';
import MobileHeaderLink from '../Header/Navigation/MobileHeaderLink';
import Logo from './Logo';
import LanguageBar from '@/components/language';

const Header: React.FC = () => {
    const { t } = useTranslation();
    const { auth } = usePage<SharedData>().props;

    const [navbarOpen, setNavbarOpen] = useState(false);
    const [sticky, setSticky] = useState(false);
    const [isSignInOpen, setIsSignInOpen] = useState(false);
    const [isSignUpOpen, setIsSignUpOpen] = useState(false);

    const signInRef = useRef<HTMLDivElement>(null);
    const signUpRef = useRef<HTMLDivElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        setSticky(window.scrollY >= 80);
    };

    const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Node;
        if (isSignInOpen && signInRef.current && !signInRef.current.contains(target)) setIsSignInOpen(false);
        if (isSignUpOpen && signUpRef.current && !signUpRef.current.contains(target)) setIsSignUpOpen(false);
        if (navbarOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(target)) setNavbarOpen(false);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [navbarOpen, isSignInOpen, isSignUpOpen]);

    useEffect(() => {
        document.body.style.overflow = isSignInOpen || isSignUpOpen || navbarOpen ? 'hidden' : '';
    }, [isSignInOpen, isSignUpOpen, navbarOpen]);

    return (
        <header
            className={`fixed top-0 z-40 w-full transition-all duration-500 ${
                sticky ? 'border-b border-slate-100 bg-white py-3 shadow-md dark:border-slate-800 dark:bg-slate-900' : 'bg-transparent py-6'
            }`}
        >
            <div className="container mx-auto flex items-center justify-between px-4 md:max-w-screen-md lg:max-w-screen-xl">
                <Logo />

                {/* 💻 Desktop Navigation */}
                <nav className="hidden items-center gap-10 lg:flex">
                    <div className="flex items-center gap-8">
                        {headerData.map((item) => (
                            <HeaderLink key={item.label} item={item} />
                        ))}

                        <FindMockModal />
                    </div>

                    <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />

                    {/*<AppearanceTabs className="gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800" />*/}
                    <LanguageBar />

                    <div className="flex items-center gap-3">
                        {auth.user ? (
                            <>
                                <Link
                                    href={route('dashboard')}
                                    className="flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-slate-800 dark:bg-indigo-600"
                                >
                                    <Icon icon="tabler:layout-dashboard" className="text-lg" />
                                    {t('auth.profile')}
                                </Link>
                            </>
                        ) : (
                            <>
                                <button
                                    className="px-6 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:text-indigo-600 dark:text-slate-400"
                                    onClick={() => setIsSignInOpen(true)}
                                >
                                    {t('auth.sign_in')}
                                </button>
                                <button
                                    className="rounded-xl bg-indigo-600 px-8 py-2.5 text-sm font-black text-white shadow-lg transition-all hover:bg-indigo-700 active:scale-95"
                                    onClick={() => setIsSignUpOpen(true)}
                                >
                                    {t('auth.sign_up')}
                                </button>
                            </>
                        )}
                    </div>
                </nav>

                {/* 📱 Mobile Menu Toggle */}
                <button
                    onClick={() => setNavbarOpen(true)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 lg:hidden dark:bg-slate-800 dark:text-slate-300"
                >
                    <Icon icon="tabler:menu-2" className="text-2xl" />
                </button>
            </div>

            {/* 🚪 Auth Modals */}
            {(isSignInOpen || isSignUpOpen) && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
                    <div
                        ref={isSignInOpen ? signInRef : signUpRef}
                        className="relative w-full max-w-[480px] overflow-hidden rounded-[2.5rem] bg-white p-10 shadow-2xl dark:bg-slate-950"
                    >
                        <button
                            onClick={() => {
                                setIsSignInOpen(false);
                                setIsSignUpOpen(false);
                            }}
                            className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-slate-900 dark:bg-slate-900"
                        >
                            <Icon icon="tabler:x" className="text-xl" />
                        </button>

                        <div className="mb-6 flex justify-center">
                            <Logo />
                        </div>

                        {isSignInOpen ? <LoginCard /> : <RegisterCard />}
                    </div>
                </div>
            )}

            {/* 📱 Mobile Drawer (Optimized Readability) */}
            <div className={`fixed inset-0 z-50 lg:hidden ${navbarOpen ? 'visible' : 'invisible'}`}>
                {/* Backdrop - Dims the page behind */}
                <div
                    className={`absolute inset-0 bg-slate-900/60 transition-opacity duration-300 ${navbarOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setNavbarOpen(false)}
                />

                {/* Sidebar - SOLID Background (No Transparency) */}
                <div
                    ref={mobileMenuRef}
                    className={`absolute top-0 right-0 z-10 h-full w-full max-w-xs bg-white shadow-2xl transition-transform duration-300 ease-in-out dark:bg-slate-900 ${navbarOpen ? 'translate-x-0' : 'translate-x-full'}`}
                >
                    <div className="flex h-[93vh] flex-col">
                        {/* Sidebar Header */}
                        <div className="flex items-center justify-between border-b border-slate-50 p-6 dark:border-slate-800">
                            <Logo />
                            <button
                                onClick={() => setNavbarOpen(false)}
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                            >
                                <Icon icon="tabler:x" className="text-2xl" />
                            </button>
                        </div>

                        {/* Nav Links Area (Scrollable if needed) */}
                        <nav className="flex-1 space-y-2 overflow-y-auto p-6">
                            {headerData.map((item) => (
                                <MobileHeaderLink key={item.label} item={item} />
                            ))}
                            <FindMockModal />
                        </nav>

                        {/* Sidebar Footer Area (Solid Background) */}
                        <div className="mt-auto border-t border-slate-100 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950">
                            <AppearanceTabs className="mb-6 rounded-xl bg-white p-1 dark:bg-slate-800" />

                            {!auth.user ? (
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        className="rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-700 dark:border-slate-700 dark:text-slate-300"
                                        onClick={() => {
                                            setIsSignInOpen(true);
                                            setNavbarOpen(false);
                                        }}
                                    >
                                        {t('auth.sign_in')}
                                    </button>
                                    <button
                                        className="rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-md"
                                        onClick={() => {
                                            setIsSignUpOpen(true);
                                            setNavbarOpen(false);
                                        }}
                                    >
                                        {t('auth.sign_up')}
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <Link
                                        href={route('dashboard')}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3.5 text-sm font-bold text-white dark:bg-indigo-600"
                                    >
                                        <Icon icon="tabler:layout-dashboard" className="text-lg" />
                                        {t('auth.profile')}
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
