import { useEffect, useState } from 'react';

export const useTelegram = () => {
    const [tg, setTg] = useState<any>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            const webapp = window.Telegram.WebApp;
            webapp.ready();
            webapp.expand();
            setTg(webapp);
        }
    }, []);

    const haptic = {
        impact: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'medium') => {
            tg?.HapticFeedback?.impactOccurred(style);
        },
        notification: (type: 'error' | 'success' | 'warning') => {
            tg?.HapticFeedback?.notificationOccurred(type);
        },
        selection: () => {
            tg?.HapticFeedback?.selectionChanged();
        },
    };

    const showMainButton = (text: string, onClick: () => void) => {
        if (!tg) return;
        tg.MainButton.setText(text);
        tg.MainButton.onClick(onClick);
        tg.MainButton.show();
    };

    const hideMainButton = () => {
        tg?.MainButton?.hide();
    };

    const showBackButton = (onClick: () => void) => {
        if (!tg) return;
        tg.BackButton.onClick(onClick);
        tg.BackButton.show();
    };

    const hideBackButton = () => {
        tg?.BackButton?.hide();
    };

    const showAlert = (message: string, callback?: () => void) => {
        tg?.showAlert(message, callback);
    };

    return {
        tg,
        haptic,
        showMainButton,
        hideMainButton,
        showBackButton,
        hideBackButton,
        showAlert,
        isTelegram: !!tg,
        platform: tg?.platform || 'unknown',
    };
};
