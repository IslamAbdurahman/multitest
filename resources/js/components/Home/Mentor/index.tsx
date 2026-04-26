"use client"
import React from "react";
import { useTranslation } from "react-i18next";

const MentorData = [
    { imgSrc: "/assets/mentor/user1.png", name: "Shohruh", profession: "Senior English Teacher" },
    { imgSrc: "/assets/mentor/user2.png", name: "Javlon", profession: "IELTS Examiner" },
    { imgSrc: "/assets/mentor/user3.png", name: "Malika", profession: "CEFR Specialist" },
];

const Mentor = () => {
    const { t } = useTranslation();

    return (
        <section className="bg-deepSlate py-10" id="mentor" >
            <div className='container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4 relative'>
                <h2 className="text-midnight_text text-5xl font-semibold mb-8 text-center">{t('landing.mentor_title')}</h2>

                <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 hide-scrollbar">
                    {MentorData.map((items, i) => (
                        <div key={i} className="min-w-[300px] sm:min-w-[350px] snap-center flex-shrink-0">
                            <div className='m-3 py-10 md:my-6 text-center bg-white rounded-2xl shadow-sm border p-4'>
                                <div className="relative mb-6">
                                    <div className="w-40 h-40 mx-auto rounded-full bg-gray-200 overflow-hidden">
                                        <img src={items.imgSrc} alt="user-image" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className='text-2xl font-semibold text-lightblack'>{items.name}</h3>
                                    <h4 className='text-lg font-normal text-lightblack pt-2 opacity-50'>{items.profession}</h4>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Mentor;