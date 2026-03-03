import RegisterCard from '@/components/auth/register-card';
import LanguageBar from '@/components/language';
import AuthLayout from '@/layouts/auth-layout';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function Register() {
    const { t } = useTranslation();

    return (
        <AuthLayout title={t('register.title')} description={t('register.description')}>
            <Head title={t('register.title')} />

            {/* Language Selection Bar - Positioned for focus */}
            <div className="mb-8 flex justify-center">
                <LanguageBar />
            </div>

            {/* Main Registration Form Card */}
            <RegisterCard />

            {/* Help/Support Text (Optional) */}
            <p className="mt-8 text-center text-xs text-slate-400 dark:text-slate-500">{t('register.terms_agreement')}</p>
        </AuthLayout>
    );
}
