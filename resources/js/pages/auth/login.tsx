import { Head, router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import LoginCard from '@/components/auth/login-card';
import LanguageBar from '@/components/language';
import TextLink from '@/components/text-link';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { User } from '@/types';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { auth } = usePage<{ auth: User }>().props;
    const { t } = useTranslation();

    useEffect(() => {
        // Initialize Telegram WebApp
        const tg = window.Telegram?.WebApp;
        if (!tg) return;

        tg.ready();
        tg.expand();

        const user = tg.initDataUnsafe?.user;

        // ✅ Attempt Auto-Login for Telegram WebApp users if not already authenticated
        if (!auth?.user && user) {
            fetch('/webapp-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify(user),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.success && data.redirect) {
                        router.visit(data.redirect);
                    }
                })
                .catch((err) => {
                    console.error('Telegram Login Error:', err);
                });
        }
    }, [auth?.user]);

    return (
        <AuthLayout title={t('login.title')} description={t('login.description')}>
            <Head title={t('login.submit')} />

            {/* Language Selection Bar */}
            <div className="mb-8 flex justify-center">
                <LanguageBar />
            </div>

            {/* Main Login Form Card */}
            <LoginCard />

            {/* Password Management & Status */}
            <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                    <Label className="text-slate-600 dark:text-slate-400">{t('login.password')}</Label>

                    {canResetPassword && (
                        <TextLink
                            href={route('password.request')}
                            className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
                            tabIndex={5}
                        >
                            {t('login.forgot')}
                        </TextLink>
                    )}
                </div>

                {/* Success Status Message */}
                {status && (
                    <div className="rounded-xl bg-emerald-50 p-4 text-center text-sm font-medium text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
                        {t('login.status_success')}
                    </div>
                )}

                {/* Registration Link */}
                <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                    {t('login.no_account')}{' '}
                    <TextLink href={route('register')} className="font-bold text-indigo-600 hover:underline">
                        {t('login.register')}
                    </TextLink>
                </p>
            </div>
        </AuthLayout>
    );
}
