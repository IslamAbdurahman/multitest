import React from 'react';
import { Link } from '@inertiajs/react';

const Logo: React.FC = () => {

    const domain = typeof window !== 'undefined' ? window.location.hostname : 'multitest.uz';

    // domenni capitalize qilish (faqat birinchi harflar katta)
    const capitalizeDomain = domain
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());

    return (
        <Link href={route('dashboard')} className="flex items-center gap-2">
            <h1 className={'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-3xl font-bold text-transparent'}>
                {capitalizeDomain}
            </h1>
        </Link>
    );
};

export default Logo;
