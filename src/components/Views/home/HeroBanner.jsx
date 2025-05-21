import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const HeroBanner = () => {
  const images = [
    "/images/Logo/Hero.jpg",
    "/images/Logo/1.jpg",
    "/images/Logo/2.jpg",
    "/images/Logo/3.jpg",
  ];

  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % images.length);
        setIsTransitioning(false);
      }, 400);
    }, 3500);

    return () => clearInterval(interval);
  }, [images.length]);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent((current + 1) % images.length);
      setIsTransitioning(false);
    }, 400);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent((current - 1 + images.length) % images.length);
      setIsTransitioning(false);
    }, 400);
  };

  const goToSlide = (index) => {
    if (isTransitioning || current === index) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent(index);
      setIsTransitioning(false);
    }, 400);
  };

  return (
    <div className="relative bg-gradient-to-r from-slate-50 to-teal-100 py-10 md:py-12">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        {/* Left Text Content - Balanced size */}
        <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 leading-tight">
            Smarter <span className="text-teal-600">Attendance</span> with AI
          </h1>
          <p className="text-base text-gray-600 mb-5 max-w-md">
            Automate classroom attendance using facial recognition for a seamless experience.
          </p>
          <div className="flex flex-wrap gap-4 mb-5">
            <Link 
              to="/Login"
              className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 px-6 rounded-lg transition-all duration-300 shadow hover:shadow-md"
              aria-label="Get started"
            >
              Get Started
            </Link>
            <Link 
              to="" // Change this to your features route if different
              className="border border-teal-600 text-teal-600 hover:bg-teal-50 font-medium py-2.5 px-6 rounded-lg transition-all duration-300"
              aria-label="Explore features"
            >
              Explore Features
            </Link>
          </div>
          <div className="flex items-center space-x-2 text-gray-600 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Secure & contactless attendance</span>
          </div>
        </div>

        {/* Right Image Slider - Balanced size */}
        <div className="md:w-1/2 relative w-full h-64 md:h-72 rounded-xl shadow-xl overflow-hidden group">
          <div className="relative w-full h-full">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Feature ${index + 1}`}
                className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-400 ${
                  current === index ? 'opacity-100' : 'opacity-0'
                }`}
                loading="lazy"
              />
            ))}
          </div>
          
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-1.5 shadow transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-label="Previous image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-1.5 shadow transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-label="Next image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-white/30 backdrop-blur-sm px-3 py-1 rounded-full">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  current === index ? 'bg-teal-600 w-5' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;