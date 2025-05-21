import React from 'react';

function SectionContainer({ children }) {
  return (
    <section className="px-4 md:px-12 lg:px-20 py-6">
      {children}
    </section>
  );
}

export default SectionContainer;
