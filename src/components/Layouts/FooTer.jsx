import React from 'react';

function FooTer() {
  return (
    <footer className="relative bg-gradient-to-r from-[#1e293b] to-[#0f172a] backdrop-blur-sm text-white py-6 mt-16 border-t border-gray-700 shadow-lg overflow-hidden">
      {/* Subtle Animated Glow */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[200px] h-[200px] bg-teal-400 opacity-10 rounded-full blur-2xl animate-pulse" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Tagline */}
        <div className="text-center mb-4">
          <h2 className="text-xl md:text-2xl font-bold tracking-wide bg-gradient-to-r from-yellow-300 to-teal-300 text-transparent bg-clip-text drop-shadow-md">
            Smart Attendance Monitoring System
          </h2>
          <p className="text-gray-400 mt-1 text-sm">
            © University Edition - Empowering Smart Classrooms
          </p>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-6 text-sm font-medium">
          <div className="flex items-center gap-2">
            <span className="text-teal-400 text-lg animate-bounce">📧</span>
            <a
              href="mailto:attendance@university.edu"
              className="hover:text-yellow-300 transition duration-300"
            >
              attendance@university.edu
            </a>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-pink-400 text-lg animate-pulse">📍</span>
            <p className="text-gray-300">Main Campus, UOL, Pakistan</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-indigo-400 text-lg animate-bounce">📞</span>
            <a
              href="tel:+923001234567"
              className="hover:text-yellow-300 transition duration-300"
            >
              +92 300 1234567
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default FooTer;
