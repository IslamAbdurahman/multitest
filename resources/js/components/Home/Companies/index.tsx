"use client"
import React from "react";
import { useTranslation } from "react-i18next";

const TruestedCompanies = [
    { imgSrc: "/assets/companies/company1.png", name: "Company 1" },
    { imgSrc: "/assets/companies/company2.png", name: "Company 2" },
    { imgSrc: "/assets/companies/company3.png", name: "Company 3" },
    { imgSrc: "/assets/companies/company4.png", name: "Company 4" },
    { imgSrc: "/assets/companies/company1.png", name: "Company 5" },
    { imgSrc: "/assets/companies/company2.png", name: "Company 6" },
];

const Companies = () => {
    const { t } = useTranslation();

    return (
        <section className='text-center overflow-hidden'>
            <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4">
                <h2 className="text-midnight_text text-2xl font-semibold">{t('landing.trusted_companies')}</h2>
                <div className="py-14 border-b relative">
                    <div className="flex justify-center items-center gap-8 md:gap-16 flex-wrap">
                        {TruestedCompanies.map((item, i) =>
                            <div key={i} className="flex-shrink-0">
                                <img 
                                    src={item.imgSrc} 
                                    alt={item.name} 
                                    width={116} 
                                    height={36} 
                                    className="opacity-60 hover:opacity-100 transition-opacity"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Companies;