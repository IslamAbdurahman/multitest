import { useState, useEffect } from 'react';

export function useIsDarkMode() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const checkDarkMode = () => {
            if (typeof document !== 'undefined') {
                setIsDark(document.documentElement.classList.contains('dark'));
            }
        };

        checkDarkMode();

        const observer = new MutationObserver(checkDarkMode);

        if (typeof document !== 'undefined') {
            observer.observe(document.documentElement, {
                attributes: true,
                attributeFilter: ['class'],
            });
        }

        return () => observer.disconnect();
    }, []);

    return isDark;
}
