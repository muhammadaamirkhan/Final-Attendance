import React from 'react';

const FeatureSection = () => {
  const features = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      ),
      title: 'AI Accuracy',
      desc: 'Facial recognition ensures 99.8% accurate attendance logging.'
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: 'Real-Time Reports',
      desc: 'Instant summaries and analytics at your fingertips.'
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: 'Secure & Private',
      desc: 'Data stays on-campus, protected by local storage only.'
    }
  ];

  return (
    <div className="relative bg-gradient-to-r from-slate-50 to-teal-100 py-8 md:py-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 relative inline-block">
            Why Choose Smart Attendance?
            <span className="absolute bottom-0 left-0 w-full h-1 bg-teal-200/50 transform translate-y-1"></span>
          </h2>
          <p className="text-gray-600 text-sm md:text-base">Smarter solutions for modern classrooms</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 group"
            >
              <div className="flex justify-center mb-4">
                <div className="p-2 bg-teal-100/30 rounded-full group-hover:bg-teal-100/50 transition-all duration-300">
                  <div className="p-1.5 bg-white rounded-full shadow-sm">
                    {feature.icon}
                  </div>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">{feature.title}</h3>
              <p className="text-sm text-gray-600 text-center">{feature.desc}</p>
              
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-400 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-medium text-sm transition-all duration-300 shadow hover:shadow-md transform hover:scale-105">
            Get Started Today
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;