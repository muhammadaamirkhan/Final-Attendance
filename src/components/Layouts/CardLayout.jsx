import React from 'react';

function CardLayout({ children }) {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 my-6">
      {children}
    </div>
  );
}

export default CardLayout;
