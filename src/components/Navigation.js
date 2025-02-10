import React, { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, BadgePlus, LogOut, Ticket, CalendarDays, User, Workflow, NotepadText, FileStack, PackagePlus } from "lucide-react";
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Navigation = () => {
  const { auth, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null); // ref to handle outside click

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

  return (
    <nav className="bg-white" ref={dropdownRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-12">
          <div className="flex items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center pe-3 rounded-md text-gray-900"
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
                <span className="text-gray-900 px-3 py-2 text-base font-medium">Welcome {auth.userName},</span>
              </div>
              <div className="space-y-1">
                <button
                  onClick={logout}
                  className="flex items-center gap-2 w-full px-3 py-2 font-medium text-gray-900 hover:bg-gray-100"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            </div>
          )}
        </div>


        {isOpen && (
          <div
            className="absolute z-10 px-2 pt-2 pb-3 space-y-1 bg-white shadow-md"
            id="menu"
            tabIndex="0"
            onBlur={() => setIsOpen(false)} // Close menu on blur
          >
            <Link to="/" className="flex items-center gap-2 w-full px-4 py-2 text-gray-900 hover:bg-gray-100">
              <LayoutDashboard className="w-4 h-4" />Home
            </Link>
            {auth && (
              <>
                <Link to="/create" className="flex items-center gap-2 w-full px-4 py-2 text-gray-900 hover:bg-gray-100">
                  <BadgePlus className="w-4 h-4" /> Create
                </Link>
                <Link to="/tickets" className="flex items-center gap-2 w-full px-4 py-2 text-gray-900 hover:bg-gray-100">
                  <Ticket className="w-4 h-4" /> Tickets
                </Link>
                <Link to="/calendar" className="flex items-center gap-2 w-full px-4 py-2 text-gray-900 hover:bg-gray-100">
                  <CalendarDays className="w-4 h-4" /> Calendar
                </Link>
                <Link to="/workorders" className="flex items-center gap-2 w-full px-4 py-2 text-gray-900 hover:bg-gray-100">
                  <Workflow className="w-4 h-4" /> Work Order
                </Link>
                <Link to="/users" className="flex items-center gap-2 w-full px-4 py-2 text-gray-900 hover:bg-gray-100">
                  <User className="w-4 h-4" /> Users
                </Link>
                <Link to="/installations" className="flex items-center gap-2 w-full px-4 py-2 text-gray-900 hover:bg-gray-100">
                  <PackagePlus className="w-4 h-4" />Installations
                </Link>
                <Link to="/documents" className="flex items-center gap-2 w-full px-4 py-2 text-gray-900 hover:bg-gray-100">
                  <FileStack className="w-4 h-4" />Documents
                </Link>
                <Link to="/about" className="flex items-center gap-2 w-full px-4 py-2 text-gray-900 hover:bg-gray-100">
                 <NotepadText className="w-4 h-4" />About
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;