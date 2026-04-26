import { AppBottomNav } from '@/components/app-bottom-nav';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Hero from '@/components/Home/Hero';
import CreateAttemptModal from '@/components/mock/create-attempt-modal';
import { useIsMobile } from '@/hooks/use-mobile';
import { Mock, User } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Welcome() {
    const { mock, auth } = usePage<{
        auth: { user: User };
        mock: Mock;
    }>().props;

    const { t } = useTranslation();
    const isMobile = useIsMobile();

    const [isLoggingIn, setIsLoggingIn] = useState(false);

    useEffect(() => {
        const tg = window.Telegram?.WebApp;
        tg?.ready();
        tg?.expand();

        const user = tg?.initDataUnsafe?.user;

        if (!auth?.user && user) {
            setIsLoggingIn(true);
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
                    } else {
                        setIsLoggingIn(false);
                    }
                })
                .catch((err) => {
                    console.error('Telegram WebApp login error:', err);
                    setIsLoggingIn(false);
                });
        }
    }, [auth?.user]);

    if (isLoggingIn) {
        return (
            <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50">
                <div className="relative mb-8">
                    <img 
                        src="/images/logo/logo.png" 
                        alt="Logo" 
                        className="h-20 w-auto animate-pulse"
                    />
                    <div className="absolute -inset-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"></span>
                    </div>
                    Checking your session...
                </div>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>{t('welcome.seo_title')}</title>
                <meta name="description" content={t('welcome.seo_description')} />
                <meta name="keywords" content={t('welcome.seo_keywords')} />
                <meta property="og:title" content={t('welcome.seo_title')} />
                <meta property="og:description" content={t('welcome.seo_description')} />
                <meta property="og:type" content="website" />
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            
            <div className="min-h-screen bg-background text-foreground">
                {!isMobile && <Header />}
                
                <main>
                    {!mock && <Hero />}

                    {mock && (
                        <div className={`flex items-center justify-center ${isMobile ? 'p-4' : 'mt-20'}`}>
                            <div className="tma-card w-full max-w-sm relative overflow-hidden group">
                                {/* Decorative Gradient */}
                                <div className="absolute top-0 right-0 -mr-16 -mt-16 h-32 w-32 rounded-full bg-primary/10 blur-3xl transition-all group-hover:bg-primary/20" />
                                
                                <div className="relative flex flex-col">
                                    {/* Status Badges */}
                                    <div className="mb-4 flex gap-2">
                                        {mock.active && (
                                            <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-500 border border-emerald-500/20">
                                                {t('common.active')}
                                            </span>
                                        )}
                                        {mock.open && (
                                            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-primary border border-primary/20">
                                                {t('common.open')}
                                            </span>
                                        )}
                                    </div>

                                    {/* Mock Info */}
                                    <div className="mb-6">
                                        <h3 className="text-xl font-bold text-foreground mb-2">{mock.name}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {mock.description || t('common.no_description')}
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-auto">
                                        <CreateAttemptModal mock={mock} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>

                {!isMobile && <Footer />}
                <AppBottomNav />
            </div>
        </>
    );
}
