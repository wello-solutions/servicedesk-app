import React, { useState } from 'react';
import { fetchData } from '../services/apiService';
import { useNavigate } from 'react-router-dom';

const CreateUser = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [error, setError] = useState('');

  const handleCreateUser = async (e) => {
    e.preventDefault();

    try {
      // API request to send password reset email
      await fetchData(``, 'POST', {});
      setError('');
      setEmail(''); // Clear email after successful submission
    } catch (err) {
      setError('Failed to send reset link. Please try again later.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">Create New User</h2>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <form onSubmit={handleCreateUser}>
          <div className='grid grid-cols-2 gap-4'>
          <div className="mb-6">
            <label htmlFor="firstname" className="block text-sm font-medium text-gray-600">First Name</label>
            <input
              type="text"
              id="firstname"
              value={firstname}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md shadow-sm"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="lastname" className="block text-sm font-medium text-gray-600">Last Name</label>
            <input
              type="text"
              id="lastname"
              value={lastname}
              onChange={(e) => setLastName(e.target.value)}
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
          <div className="mb-6">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-600">Phone No.</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md shadow-sm"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">Create Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md shadow-sm"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="rePassword" className="block text-sm font-medium text-gray-600">Confirm Password</label>
            <input
              type="password"
              id="rePassword"
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md shadow-sm"
              required
            />
          </div>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
            Submit
          </button>
          <button
            onClick={() => navigate('/login')} // Navigate back one step in history
            className="w-full bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 mt-2"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;