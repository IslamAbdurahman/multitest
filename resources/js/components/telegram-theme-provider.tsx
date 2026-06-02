import { useEffect } from 'react';

export function TelegramThemeProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const tg = window.Telegram?.WebApp;
        if (!tg || tg.platform === 'unknown') return;

        const updateTheme = () => {
            const theme = tg.themeParams;
            const root = document.documentElement;

            // Apply Telegram colors to CSS variables
            if (theme.bg_color) root.style.setProperty('--tg-theme-bg-color', theme.bg_color);
            if (theme.text_color) root.style.setProperty('--tg-theme-text-color', theme.text_color);
            if (theme.hint_color) root.style.setProperty('--tg-theme-hint-color', theme.hint_color);
            if (theme.link_color) root.style.setProperty('--tg-theme-link-color', theme.link_color);
            if (theme.button_color) root.style.setProperty('--tg-theme-button-color', theme.button_color);
            if (theme.button_text_color) root.style.setProperty('--tg-theme-button-text-color', theme.button_text_color);
            if (theme.secondary_bg_color) root.style.setProperty('--tg-theme-secondary-bg-color', theme.secondary_bg_color);
            if (theme.accent_text_color) root.style.setProperty('--tg-theme-accent-text-color', theme.accent_text_color);
            if (theme.header_bg_color) root.style.setProperty('--tg-theme-header-bg-color', theme.header_bg_color);
            if (theme.section_bg_color) root.style.setProperty('--tg-theme-section-bg-color', theme.section_bg_color);
            if (theme.section_header_text_color) root.style.setProperty('--tg-theme-section-header-text-color', theme.section_header_text_color);

            // Toggle .dark class based on colorScheme
            if (tg.colorScheme === 'dark') {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        };

        tg.onEvent('themeChanged', updateTheme);
        updateTheme(); // Initial call

        // Ready and expand for better TMA experience
        tg.ready();
        tg.expand();

        return () => {
            tg.offEvent('themeChanged', updateTheme);
        };
    }, []);

    return <>{children}</>;
}

export const useHaptic = () => {
    const impact = (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'light') => {
        window.Telegram?.WebApp.HapticFeedback.impactOccurred(style);
    };

    const notification = (type: 'error' | 'success' | 'warning') => {
        window.Telegram?.WebApp.HapticFeedback.notificationOccurred(type);
    };

    const selection = () => {
        window.Telegram?.WebApp.HapticFeedback.selectionChanged();
    };

    return { impact, notification, selection };
};

export function useTelegramMainButton(text: string, show: boolean, onClick: () => void, loading = false) {
    useEffect(() => {
        const tg = window.Telegram?.WebApp;
        if (!tg || tg.platform === 'unknown') return;

        const mainButton = tg.MainButton;
        mainButton.setText(text);

        if (show) {
            mainButton.show();
        } else {
            mainButton.hide();
        }

        if (loading) {
            mainButton.showProgress(false);
        } else {
            mainButton.hideProgress();
        }

        mainButton.onClick(onClick);

        return () => {
            mainButton.offClick(onClick);
            mainButton.hide();
        };
    }, [text, show, onClick, loading]);
}

export function useTelegramBackButton(show: boolean, onClick: () => void) {
    useEffect(() => {
        const tg = window.Telegram?.WebApp;
        if (!tg || tg.platform === 'unknown') return;

        const backButton = tg.BackButton;

        if (show) {
            backButton.show();
        } else {
            backButton.hide();
        }

        backButton.onClick(onClick);

        return () => {
            backButton.offClick(onClick);
            backButton.hide();
        };
    }, [show, onClick]);
}

