import { useIsMobile } from '@/hooks/use-mobile';
import { getImagePrefix } from '@/utils/util';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';

const Hero = () => {
    const { t } = useTranslation();
    const isMobile = useIsMobile();
    
    return (
        <section id="home-section" className="transition-colors duration-300 bg-background overflow-hidden">
            <div className={`container mx-auto px-4 ${isMobile ? 'pt-6 pb-10' : 'pt-20'} md:max-w-screen-md lg:max-w-screen-xl`}>
                <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
                    {/* Left Content */}
                    <div className="col-span-6 flex flex-col gap-6 lg:gap-8">
                        {/* Discount badge */}
                        <div className="flex items-center gap-2 lg:mx-0">
                            <Icon icon="solar:verified-check-bold" className="text-primary text-xl" />
                            <p className="text-primary text-xs font-bold uppercase tracking-wider">
                                {t('hero.badge')}
                            </p>
                        </div>

                        {/* Heading */}
                        <h1 className={`${isMobile ? 'text-3xl' : 'text-5xl'} font-extrabold text-foreground leading-tight`}>
                            {t('hero.title')}
                        </h1>

                        {/* AI Section */}
                        <div className={`flex items-center ${isMobile ? 'justify-start' : 'justify-center lg:justify-start'} gap-4`}>
                            <h2 className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-xl font-black text-transparent md:text-4xl">
                                {t('hero.ai_title')}
                            </h2>

                            <img
                                src={`${getImagePrefix()}images/banner/google_gemini_ai.png`}
                                alt={t('hero.ai_alt')}
                                width={isMobile ? 120 : 220}
                                className="rounded-2xl object-contain shadow-lg transition-transform duration-200 hover:scale-105"
                            />
                        </div>

                        {/* Subheading */}
                        <h3 className="text-base lg:text-lg text-muted-foreground max-w-lg">
                            {t('hero.description')}
                        </h3>

                        {/* Features */}
                        <div className={`flex flex-wrap items-center gap-4 ${isMobile ? 'pt-4' : 'pt-10'}`}>
                            {[t('hero.feature_levels'), t('hero.feature_instant_score')].map((text, i) => (
                                <div key={i} className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-full">
                                    <Icon icon="solar:check-circle-bold" className="text-primary text-lg" />
                                    <p className="text-xs font-semibold text-foreground">{text}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Image - Hidden on very small mobile to save space if needed, or scaled */}
                    {!isMobile && (
                        <div className="col-span-6 flex justify-center">
                            <img
                                src={`${getImagePrefix()}images/banner/mahila_boy.png`}
                                alt={t('hero.hero_alt')}
                                width={1000}
                                height={805}
                                className="object-contain"
                            />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Hero;
