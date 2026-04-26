"use client"
import { useTranslation } from "react-i18next";
import { Send } from "lucide-react";

const Newsletter = () => {
    const { t } = useTranslation();

    return (
        <section>
            <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4">
                <div className="grid grid-cols-1 gap-y-10 gap-x-6 md:grid-cols-12 xl:gap-x-8">
                    <div className={`col-span-12 bg-ultramarine rounded-3xl bg-contain bg-no-repeat relative overflow-hidden`}>
                        <div className="mb-10 mt-24 lg:mx-64 lg:my-24 relative z-10 p-6 md:p-0">
                            <h3 className="text-4xl md:text-5xl text-center font-semibold text-white mb-3">{t('landing.newsletter_title')}</h3>
                            <h3 className="text-base font-normal text-white/75 text-center mb-8">
                                {t('landing.newsletter_description')}
                            </h3>
                            <div>
                                <div className="relative text-white focus-within:text-white flex flex-row-reverse rounded-full pt-5 lg:pt-0">
                                    <input type="Email address" name="q" className="py-6 lg:py-8 text-sm md:text-lg w-full mx-3 text-black rounded-full pl-8 focus:outline-none focus:text-black" placeholder={t('landing.newsletter_placeholder')} autoComplete="off" />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-6 pt-5 lg:pt-0">
                                        <button type="submit" className="p-3 lg:p-4 focus:outline-none focus:shadow-outline bg-blue-600 hover:bg-blue-700 duration-150 ease-in-out rounded-full flex items-center justify-center">
                                            <Send className="w-6 h-6 text-white" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Background decorations */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/3 blur-2xl"></div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Newsletter;