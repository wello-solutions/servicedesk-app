import React, { useState } from 'react';
import { fetchData } from '../services/apiService';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [domain, setDomain] = useState(''); // New state for domain
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      // API request to send password reset email
      await fetchData(
        `https://v1servicedeskapi.wello.solutions/api/Contact/SendPasswordReminder?domain=${domain}&e_login=${email}`,
        'POST',
        {}
      );
      setMessage('A password reset link has been sent to your email.');
      setError('');
      setEmail(''); // Clear email after successful submission
      setDomain(''); // Clear domain after successful submission
    } catch (err) {
      setError('Failed to send reset link. Please try again later.');
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">Forgot Password</h2>
        {message && <p className="text-green-600 mb-4">{message}</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <form onSubmit={handleForgotPassword}>
          <div className="mb-6">
            <label htmlFor="domain" className="block text-sm font-medium text-gray-600">Domain</label>
            <input
              type="text"
              id="domain"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md shadow-sm"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md shadow-sm"
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
            Send Reset Link
          </button>
          <button type="button"
            onClick={() => navigate(-1)} // Navigate back one step in history
            className="w-full bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 mt-2"
          >
            Back
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;