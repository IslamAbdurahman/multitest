import { AppBottomNav } from '@/components/app-bottom-nav';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Hero from '@/components/Home/Hero';
import CreateAttemptModal from '@/components/mock/create-attempt-modal';
import { Mock, User } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function Welcome() {
    const { mock, auth } = usePage<{
        auth: User;
        mock: Mock;
    }>().props;

    const { t } = useTranslation(); // Using the translation hook

    useEffect(() => {
        const tg = window.Telegram?.WebApp;
        tg?.ready();
        tg?.expand();

        const user = tg?.initDataUnsafe?.user;

        // ✅ Prevent multiple login attempts if user already logged in
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
                .catch((err) => console.error('Telegram WebApp login error:', err));
        }
    }, [auth?.user]);

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div>
                <div>
                    <Header />
                    {!mock && (
                        <div>
                            <Hero />
                        </div>
                    )}

                    {mock && (
                        <div className={'mt-50 flex items-center justify-center'}>
                            <div className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
                                {/* Card Header Background */}
                                <div className="absolute top-0 h-24 w-full bg-gradient-to-br from-indigo-500/10 to-transparent" />

                                <div className="relative flex flex-1 flex-col p-6">
                                    {/* Top Line: Index & Status */}
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="flex gap-2">
                                            {mock.active && (
                                                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-emerald-700 uppercase dark:bg-emerald-900/30 dark:text-emerald-400">
                                                    Active
                                                </span>
                                            )}
                                            {mock.open && (
                                                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-blue-700 uppercase dark:bg-blue-900/30 dark:text-blue-400">
                                                    Open
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Mock Info */}
                                    <div className="mb-4">
                                        <h3 className="line-clamp-1 text-xl font-bold text-slate-900 dark:text-white">{mock.name}</h3>
                                        <p className="mt-2 line-clamp-2 min-h-[40px] text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                                            {mock.description || t('no_description')}
                                        </p>
                                    </div>

                                    {/* 🚀 Actions */}
                                    <div className="space-y-3 pt-4">
                                        <CreateAttemptModal mock={mock} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <Footer />

                <AppBottomNav />
            </div>
        </>
    );
}
