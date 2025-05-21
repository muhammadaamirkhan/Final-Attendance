import React from 'react';
import { Link } from 'react-router-dom';

const CallToAction = () => {
  return (
    <section className="relative py-10 bg-gradient-to-r from-teal-600 to-teal-500 text-white overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-20 left-10 w-24 h-24 rounded-full bg-white"></div>
        <div className="absolute bottom-10 right-20 w-28 h-28 rounded-full bg-white"></div>
        <div className="absolute top-1/3 right-1/4 w-12 h-12 rounded-full bg-white"></div>
      </div>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 animate-pulse">
          Ready to Transform Your Attendance System?
        </h2>
        <p className="text-base md:text-lg mb-6 max-w-xl mx-auto leading-relaxed">
          Join hundreds of institutions using our Smart Attendance Monitoring System for seamless, accurate class tracking.
        </p>

        <div className="flex justify-center">
          <Link 
            to="/reports"
            className="
              bg-white text-teal-600 font-semibold px-6 py-3 rounded-full 
              hover:bg-gray-100 hover:scale-105 transition-all duration-300
              shadow-md hover:shadow-lg
              flex items-center
            "
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            Contact Admin
          </Link>
        </div>

        <p className="mt-4 text-teal-100 text-xs">
          Get started in minutes • No credit card required • 24/7 Support
        </p>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.9; }
        }
        .animate-pulse {
          animation: pulse 2s infinite;
        }
      `}</style>
    </section>
  );
};

export default CallToAction;