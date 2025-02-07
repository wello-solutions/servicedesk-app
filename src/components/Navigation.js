import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { fetchData } from '../services/apiService.js';

const Navigation = () => {
  const { auth, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null); // ref to handle outside click

  useEffect(() => {
    const fetchContactCount = async () => {
      const auth = JSON.parse(sessionStorage.getItem('auth'));
      try {
        const responseUser = await fetchData(`https://V1servicedeskapi.wello.solutions/api/Contact?$filter=e_login+eq+'${encodeURIComponent(auth.email)}'`, 'GET');
        setUser(responseUser.value[0]);
        setLoading(false);
      } catch (err) {
        setUser({
          firstname: 'Guest',
          lastname: 'User'
        })
        setLoading(false);
      }
    };

    fetchContactCount();
  }, []);

  useEffect(() => {
    // Close the menu if clicked outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <nav className="bg-white" ref={dropdownRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-12">
          <div className="flex items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center pe-3 rounded-md text-gray-400"
              aria-controls="menu"
              aria-expanded={isOpen}
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
          {auth && (
            <div className="flex items-center">
              <div className="space-y-1">
                <span className="text-gray-900 px-3 py-2 text-base font-medium">Welcome {user?.firstname} {user?.lastname},</span>
                <button
                  onClick={logout}
                  className="text-left px-3 py-2 text-gray-900 text-base font-medium hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {isOpen && (
        <div
          className="absolute z-10 px-2 pt-2 pb-3 space-y-1 bg-white shadow-md"
          id="menu"
          tabIndex="0"
          onBlur={() => setIsOpen(false)} // Close menu on blur
        >
          <Link to="/" className="block text-gray-900 px-3 py-2 rounded-md text-base font-medium">
            Home
          </Link>
          {auth && (
            <>
              <Link to="/create" className="block text-gray-900 px-3 py-2 rounded-md text-base font-medium">
                Create
              </Link>
              <Link to="/tickets" className="block text-gray-900 px-3 py-2 rounded-md text-base font-medium">
                Tickets
              </Link>
              <Link to="/calendar" className="block text-gray-900 px-3 py-2 rounded-md text-base font-medium">
                Calendar
              </Link>
              <Link to="/workorders" className="block text-gray-900 px-3 py-2 rounded-md text-base font-medium">
                Work Order
              </Link>
              <Link to="/users" className="block text-gray-900 px-3 py-2 rounded-md text-base font-medium">
                Users
              </Link>
              <Link to="/installations" className="block text-gray-900 px-3 py-2 rounded-md text-base font-medium">
                Installations
              </Link>
              <Link to="/documents" className="block text-gray-900 px-3 py-2 rounded-md text-base font-medium">
                Documents
              </Link>
              <Link to="/about" className="block text-gray-900 px-3 py-2 rounded-md text-base font-medium">
                About
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navigation;