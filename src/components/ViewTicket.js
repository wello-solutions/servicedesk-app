import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchData } from '../services/apiService';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SingleTicket = () => {
  const navigate = useNavigate(); 
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [doc, setDoc] = useState([]);
  const [file, setFile] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('details'); // State to manage active tab

  useEffect(() => {
    const getTicketDetails = async () => {
      try {
        if (!ticketId) {
          setError('Ticket ID is not provided.');
          setLoading(false);
          return;
        }

        const endpoint = `https://v1servicedeskapi.wello.solutions/api/TaskView(${ticketId})`;
        const data = await fetchData(endpoint, 'GET');
        setTicket(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching ticket details:", err);
        setError('Failed to fetch ticket details.');
        setLoading(false);
      }
    };

    const getTicketDoc = async () => {
      try {
        const endpoint_1 = `https://V1servicedeskapi.wello.solutions/api/DbFileView?$filter=db_table_name+eq+%27task%27+and+id_in_table+eq+${ticketId}`;
        const data_1 = await fetchData(endpoint_1, 'GET');
        setDoc(data_1.value);
      } catch (err) {
        console.error("Error fetching documents:", err);
        setError('Failed to fetch documents.');
      }
    };

    getTicketDetails();
    getTicketDoc();
  }, [ticketId]);

  useEffect(() => {
    const GetFileThumbnail = async () => {
      try {
        if (doc.length === 0) return; // Ensure there is data before fetching

        const docId = doc[0]?.id; // Use the first document ID (or adjust as needed)
        if (!docId) return;

        const auth = JSON.parse(sessionStorage.getItem('auth'));
    
        if (!auth || !auth.email || !auth.password || !auth.domain) {
          throw new Error('Invalid or missing authentication data');
        }
    
        const authString = `${auth.email.trim()}:${auth.password.trim()}@${auth.domain.trim()}`;
        const authKey = btoa(authString);
    
        const config = {
          url: `https://V1servicedeskapi.wello.solutions/api/DbFileView/GetFileThumbnail/?id=${docId}&maxWidth=256&maxHeight=256`,
          method: 'GET',
          headers: {
            'Authorization': `Basic ${authKey}`,
            'Accept': 'image/png',
          },
          responseType: 'blob',
        };
    
        const response = await axios(config);
        const imageObjectURL = URL.createObjectURL(response.data); 
        setFile(imageObjectURL);
        console.log(imageObjectURL);
      } catch (err) {
        console.error("Error fetching thumbnail:", err);
        setError('Failed to fetch thumbnail.');
      } finally {
        setLoading(false); // Set loading to false once done
      }
    };

    GetFileThumbnail();
  }, [doc]); // Run when `doc` changes

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-gray-100">
    <div className="relative">
      <div className="w-20 h-20 border-purple-200 border-2 rounded-full"></div>
      <div className="w-20 h-20 border-purple-700 border-t-2 animate-spin rounded-full absolute left-0 top-0"></div>
    </div>
  </div>;
  }
  if (error) return <div className="text-center text-red-600">{error}</div>;

  return (
    <div className="mx-auto p-6 bg-white">
      <div className='flex'>
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)} // Navigate back one step in history
          className="mb-6 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
        >
          {'<'}
        </button>
        <h2 className="capitalize text-xl font-bold mb-2 ml-4">{ticket?.subject} | Reference: {ticket?.id2}</h2>
      </div>
      
      {/* Tab Navigation */}
      <div className="flex space-x-4 border-b border-gray-300 mb-4">
        <button
          className={`py-2 px-4 font-semibold ${activeTab === 'details' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-600 hover:text-blue-500'}`}
          onClick={() => setActiveTab('details')}
        >
          Ticket Details
        </button>
        <button
          className={`py-2 px-4 font-semibold ${activeTab === 'documents' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-600 hover:text-blue-500'}`}
          onClick={() => setActiveTab('documents')}
        >
          Documents
        </button>
      </div>

      {activeTab === 'details' ? (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='shadow-md rounded-lg p-4 bg-amber-50'>
              <h4 className="text-lg font-semibold">Location and Equipment</h4>
              <ul className="list-none list-inside text-gray-700">
                <li>{ticket?.project_name}</li>
                <li>{ticket?.project_db_address_street}</li>
                <li>{ticket?.project_db_address_zip} {ticket?.project_db_address_city}</li>
              </ul>
            </div>

            <div className='shadow-md rounded-lg p-4 bg-amber-50'>
              <h4 className="text-lg font-semibold">Created By</h4>
              <ul className="list-none list-inside text-gray-700">
                <li>{ticket?.contact_fullname}</li>
                <li>{new Date(ticket?.date_update).toLocaleString()}</li>
              </ul>
            </div>

            <div className='shadow-md rounded-lg p-4 bg-amber-50'>
              <h4 className="text-lg font-semibold">Assigned To</h4>
              <ul className="list-none list-inside text-gray-700">
                <li>{ticket?.assigned_to_name || 'Not Assigned'}</li>
              </ul>
            </div>

            <div className='shadow-md rounded-lg p-4 bg-amber-50'>
              <h4 className="text-lg font-semibold">Type and Status</h4>
              <ul className="list-none list-inside text-gray-700">
                <li>{ticket?.task_type_name} - {ticket?.task_priority_name}</li>
                <li>{ticket?.task_status_description}</li>
              </ul>
            </div>
          <div className='shadow-md rounded-lg p-4 bg-amber-50'>
            <h4 className="text-lg font-semibold">Description</h4>
            <p className="mb-4">{ticket?.remark}</p>
          </div>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          <div className="border border-gray-300 rounded-md bg-gray-50">
            {file ? (
              <img src={file} alt="Thumbnail" className="w-full h-auto" />
            ) : (
              <p className="text-gray-600 p-4">No document preview available or image could not be loaded.</p>
            )}
            {doc.length > 0 && (
              doc.map(item => (
                <div key={item.id} className="p-4">
                  <h3 className="font-bold">{item.name}</h3>
                  <p className="text-gray-500">{new Date(item.date_add).toLocaleString()}</p>
                  <a href={file} target="_blank" rel="noopener noreferrer" className='flex items-center'> 
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16" style={{ marginRight: '5px' }}>
                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zm-8 4.5A4.5 4.5 0 1 1 8 3.5a4.5 4.5 0 0 1 0 9zm0-1A3.5 3.5 0 1 0 8 4.5a3.5 3.5 0 0 0 0 7z"/>
                    <path d="M8 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/>
                  </svg> View Document
                  </a>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleTicket;