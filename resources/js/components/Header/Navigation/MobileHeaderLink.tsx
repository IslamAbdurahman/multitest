import { HeaderItem } from '@/types/menu';
import { Icon } from '@iconify/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const MobileHeaderLink: React.FC<{ item: HeaderItem }> = ({ item }) => {
    const { t } = useTranslation();
    const [submenuOpen, setSubmenuOpen] = useState(false);

    const handleToggle = (e: React.MouseEvent) => {
        if (item.submenu) {
            e.preventDefault();
            setSubmenuOpen(!submenuOpen);
        }
    };

    return (
        <div className="relative w-full border-b border-slate-50 last:border-0 dark:border-slate-800/50">
            <a
                href={item.href || '#'}
                onClick={handleToggle}
                className={`flex w-full items-center justify-between px-2 py-4 text-base font-semibold transition-all duration-200 focus:outline-none ${submenuOpen ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'} `}
            >
                {/* Translate the label using the key from menuData */}
                {t(item.label)}

                {item.submenu && (
                    <Icon
                        icon="tabler:chevron-down"
                        className={`text-xl transition-transform duration-300 ${submenuOpen ? 'rotate-180 text-indigo-600' : 'text-slate-400'}`}
                    />
                )}
            </a>

            {/* Submenu rendering */}
            {submenuOpen && item.submenu && (
                <div className="mb-2 ml-4 overflow-hidden rounded-xl border-l-2 border-slate-100 bg-slate-50/50 py-1 dark:border-slate-800 dark:bg-slate-900/30">
                    {item.submenu.map((subItem, index) => (
                        <a
                            key={index}
                            href={subItem.href || '#'}
                            className="block px-5 py-3 text-sm font-medium text-slate-500 transition-colors hover:bg-white hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
                        >
                            {/* Translate submenu labels too */}
                            {t(subItem.label)}
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MobileHeaderLink;
