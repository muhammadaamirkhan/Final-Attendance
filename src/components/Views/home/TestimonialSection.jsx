import React, { useState, useEffect } from 'react';

const TestimonialSection = () => {
  const testimonials = [
    {
      quote: "This system has revolutionized attendance management. Quick, accurate, and saves hours each week.",
      author: "Dr. Ahsan Riaz",
      role: "Computer Science",
      avatar: "👨‍🏫"
    },
    {
      quote: "Facial recognition works perfectly, even in large lectures. No more manual roll calls!",
      author: "Prof. Sarah Khan",
      role: "Electrical Eng",
      avatar: "👩‍🔬"
    },
    {
      quote: "Intuitive system with 100% faculty adoption in just two weeks.",
      author: "Dr. Ali Hassan",
      role: "Academic Affairs",
      avatar: "👨‍⚕️"
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section className="relative bg-gradient-to-r from-slate-50 to-teal-100 py-8 md:py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Faculty Feedback</h2>
          <p className="text-gray-700 text-sm">What educators say about our system</p>
        </div>

        {/* Testimonial Card */}
        <div className="relative">
          <div
            className="bg-white p-6 rounded-2xl shadow-md transition duration-500 ease-in-out transform hover:scale-[1.01] hover:shadow-lg backdrop-blur-md border border-white/60"
            style={{ background: "rgba(255, 255, 255, 0.8)" }}
          >
            <div className="text-3xl text-center mb-2">{testimonials[activeIndex].avatar}</div>
            <p className="text-gray-700 italic text-sm mb-3 text-center transition-opacity duration-700">
              "{testimonials[activeIndex].quote}"
            </p>
            <div className="text-center">
              <p className="font-semibold text-teal-700 text-sm">{testimonials[activeIndex].author}</p>
              <p className="text-gray-600 text-xs">{testimonials[activeIndex].role}</p>
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center mt-4 space-x-1">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === activeIndex ? 'bg-teal-600 w-3' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
          {[
            { value: "98%", label: "Accuracy" },
            { value: "500+", label: "Faculty" },
            { value: "30s", label: "Setup" },
            { value: "24/7", label: "Support" },
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-xl py-3 px-2 shadow hover:shadow-md transition duration-300">
              <p className="text-xl font-bold text-teal-600">{item.value}</p>
              <p className="text-gray-600">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
