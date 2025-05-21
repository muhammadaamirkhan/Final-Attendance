import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/config';
import { signOut } from 'firebase/auth';

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
      setIsOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navItems = [
    { to: "/", label: "Home", icon: "🏠", show: true },
    { to: "/students", label: "Student Enrollment", icon: "🎓", show: !!user },
    { to: "/faculty", label: "Faculty Hiring", icon: "👨‍🏫", show: !!user },
    { to: "/mark", label: "Mark Attendance", icon: "✅", show: !!user },
  ];

  return (
    <nav className="bg-gradient-to-r from-slate-800 via-teal-800 to-emerald-700 shadow-lg sticky top-0 z-50 backdrop-blur-md transition duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src="/images/Logo/logo.png" 
              alt="Attendance System Logo"
              className="h-14 w-auto object-contain" 
            />
            <span className="ml-3 text-white font-extrabold text-xl tracking-wider hidden sm:block">
              Smart Attendance
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item, index) => (
              item.show && (
                <Link 
                  key={index}
                  to={item.to}
                  className="text-white font-medium text-lg flex items-center gap-2 transform transition-all duration-300 hover:scale-110 hover:text-yellow-300"
                >
                  <span>{item.icon}</span> {item.label}
                </Link>
              )
            ))}

            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-white font-medium text-sm md:text-base">
                  Welcome, {user.displayName || user.email.split('@')[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-110 shadow-md"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-5 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-110 shadow-md flex items-center gap-2"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-yellow-300 focus:outline-none"
            >
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-slate-900 text-white rounded-b-lg py-4 mt-1 space-y-2 transition-all">
            {navItems.map((item, index) => (
              item.show && (
                <Link
                  key={index}
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                  className={`block px-6 py-2 text-lg font-medium transform transition duration-300 hover:text-yellow-300 hover:scale-110`}
                >
                  {item.label}
                </Link>
              )
            ))}

            {user ? (
              <>
                <div className="px-6 py-2 text-lg font-medium text-yellow-300">
                  Welcome, {user.displayName || user.email.split('@')[0]}
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-6 py-2 text-lg font-medium bg-red-500 text-white hover:bg-red-600 rounded transform transition duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block px-6 py-2 text-lg font-medium bg-yellow-400 text-gray-900 hover:bg-yellow-500 rounded transform transition duration-300"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavBar;