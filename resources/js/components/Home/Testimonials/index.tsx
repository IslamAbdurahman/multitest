"use client";
import React from "react";
import { Star, StarHalf } from "lucide-react";

const TestimonialData = [
    { imgSrc: "/assets/testimonial/user1.png", name: "Azizbek", profession: "IELTS 7.5", comment: "Multitest has completely changed how I prepare for IELTS. The AI evaluation is incredibly accurate!", rating: 5 },
    { imgSrc: "/assets/testimonial/user2.png", name: "Malika", profession: "CEFR B2", comment: "The speaking mock tests are very close to the real exam. The detailed feedback helped me improve fast.", rating: 4.5 },
    { imgSrc: "/assets/testimonial/user3.png", name: "Dilshod", profession: "IELTS 8.0", comment: "I loved the dynamic UI and the instant feedback. I could practice anytime, anywhere.", rating: 5 },
];

const Testimonial = () => {

    const renderStars = (rating: number) => {
        const fullStars = Math.floor(rating);
        const halfStars = rating % 1 >= 0.5 ? 1 : 0;
        const emptyStars = 5 - fullStars - halfStars;

        return (
            <div className="flex gap-1">
                {Array(fullStars).fill(0).map((_, i) => <Star key={`full-${i}`} className="text-yellow-500 fill-yellow-500 w-5 h-5" />)}
                {halfStars > 0 && <StarHalf className="text-yellow-500 fill-yellow-500 w-5 h-5" />}
                {Array(emptyStars).fill(0).map((_, i) => <Star key={`empty-${i}`} className="text-gray-300 fill-gray-300 w-5 h-5" />)}
            </div>
        );
    };

    return (
        <section id="testimonial" className="py-10 bg-slate-50">
            <div className='container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4'>
                <h2 className="text-center text-midnight_text text-4xl font-semibold mb-16">What Our Students Say</h2>
                
                <div className="flex flex-wrap justify-center gap-8">
                    {TestimonialData.map((items, i) => (
                        <div key={i} className="w-full md:w-[calc(33.333%-2rem)] max-w-sm">
                            <div className={`bg-white rounded-2xl p-6 relative shadow-sm border mt-8 ${i % 2 ? 'shadow-md' : ''}`}>
                                <div className="absolute -top-10 left-6">
                                    <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden bg-gray-200">
                                        <img src={items.imgSrc} alt={items.name} className="w-full h-full object-cover" />
                                    </div>
                                </div>
                                <h4 className='text-base font-normal text-gray-700 mt-10 mb-6 italic'>"{items.comment}"</h4>
                                <div className="flex justify-between items-end border-t pt-4">
                                    <div>
                                        <h3 className='text-lg font-medium text-gray-900'>{items.name}</h3>
                                        <h3 className='text-sm font-normal text-gray-500'>{items.profession}</h3>
                                    </div>
                                    <div>
                                        {renderStars(items.rating)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonial;
