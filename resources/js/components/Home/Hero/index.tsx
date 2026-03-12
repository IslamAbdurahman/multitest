import { getImagePrefix } from '@/utils/util';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';

const Hero = () => {
    const { t } = useTranslation();
    
    return (
        <section id="home-section" className="bg-slateGray transition-colors duration-300 dark:bg-black">
            <div className="container mx-auto px-4 pt-20 md:max-w-screen-md lg:max-w-screen-xl">
                <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
                    {/* Left Content */}
                    <div className="col-span-6 flex flex-col gap-8">
                        {/* Discount badge */}
                        <div className="mx-auto flex items-center gap-2 lg:mx-0">
                            <Icon icon="solar:verified-check-bold" className="text-success me-2 inline-block text-xl" />
                            <p className="text-success text-center text-sm font-semibold lg:text-start">
                                {t('hero.badge')}
                            </p>
                        </div>

                        {/* Heading */}
                        <h1 className="text-midnight_text pt-5 text-4xl font-semibold sm:text-5xl lg:pt-0 dark:text-white">
                            {t('hero.title')}
                        </h1>

                        {/* AI Section */}
                        <div className="flex flex-col items-center justify-center gap-4 text-center md:flex-row md:text-left">
                            <h1 className="bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-2xl font-extrabold text-transparent drop-shadow-lg md:text-4xl">
                                {t('hero.ai_title')}
                            </h1>

                            <img
                                src={`${getImagePrefix()}images/banner/google_gemini_ai.png`}
                                alt={t('hero.ai_alt')}
                                width={220}
                                className="rounded-2xl object-contain shadow-[0_4px_12px_rgba(0,0,0,0.3)] transition-transform duration-200 ease-in-out hover:scale-105"
                            />
                        </div>

                        {/* Subheading */}
                        <h3 className="pt-5 text-lg text-black/70 lg:pt-0 dark:text-gray-300">
                            {t('hero.description')}
                        </h3>

                        {/* Features */}
                        <div className="flex items-center justify-between pt-10 lg:pt-4">
                            {[t('hero.feature_levels'), t('hero.feature_instant_score'), t('hero.feature_environment')].map((text, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <img
                                        src={`${getImagePrefix()}images/banner/check-circle.svg`}
                                        alt="check-image"
                                        width={30}
                                        height={30}
                                        className="smallImage"
                                    />
                                    <p className="text-sm font-normal text-black sm:text-lg dark:text-white">{text}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="col-span-6 flex justify-center">
                        <img
                            src={`${getImagePrefix()}images/banner/mahila_boy.png`}
                            alt={t('hero.hero_alt')}
                            width={1000}
                            height={805}
                            className="object-contain"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
