import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchData } from '../services/apiService';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SingleInstallation = () => {
  const navigate = useNavigate(); 
  const { InstallationId } = useParams();
  const [Installation, setInstallation] = useState(null);
  const [doc, setDoc] = useState([]);
  const [wordOrder, setWordOrder] = useState([]);
  const [file, setFile] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('details'); // State to manage active tab

  useEffect(() => {
    const getInstallationDetails = async () => {
      try {
        if (!InstallationId) {
          setError('Work Order ID is not provided.');
          setLoading(false);
          return;
        }

        const endpoint = `https://v1servicedeskapi.wello.solutions/api/ProjectView(${InstallationId})`;
        const data = await fetchData(endpoint, 'GET');
        setInstallation(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching Installation details:", err);
        setError('Failed to fetch Installation details.');
        setLoading(false);
      }
    };

    const getInstallationDoc = async () => {
      try {
        const endpoint_1 = `https://servicedeskapi.wello.solutions/api/DbFileView?$filter=db_table_name+eq+%27project%27+and+id_in_table+eq+${InstallationId}`;
        const data_1 = await fetchData(endpoint_1, 'GET');
        setDoc(data_1.value);
      } catch (err) {
        console.error("Error fetching documents:", err);
        setError('Failed to fetch documents.');
      }
    };

    const getInstallationSub = async () => {
      try {
        const endpoint_2 = `https://servicedeskapi.wello.solutions/api/JobsView/SearchAllJobsLinkToProject`;
        const payload = {"project_id":"72c67d1d-4b0f-4f21-84a0-d6f50e1eb7f0","year":null,"query_object":{"startRow":0,"endRow":500,"rowGroupCols":[],"valueCols":[],"pivotCols":[],"pivotMode":false,"groupKeys":[],"filterModel":{},"sortModel":[]}}
        const data_2 = await fetchData(endpoint_2, 'POST', payload);
        setWordOrder(data_2);
        console.log(data_2);
      } catch (err) {
        console.error("Error fetching documents:", err);
        setError('Failed to fetch documents.');
      }
    };

    getInstallationDetails();
    getInstallationDoc();
    getInstallationSub();
  }, [InstallationId]);

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
        <h2 className="capitalize text-xl font-bold mb-2 ml-4">{Installation?.name} | Reference: {Installation?.id2}</h2>
      </div>
      
      {/* Tab Navigation */}
      <div className="flex space-x-4 border-b border-gray-300 mb-4">
        <button
          className={`py-2 px-4 font-semibold ${activeTab === 'details' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-600 hover:text-blue-500'}`}
          onClick={() => setActiveTab('details')}
        >
          Overview
        </button>
        <button
          className={`py-2 px-4 font-semibold ${activeTab === 'documents' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-600 hover:text-blue-500'}`}
          onClick={() => setActiveTab('documents')}
        >
          Documents
        </button>
        <button
          className={`py-2 px-4 font-semibold ${activeTab === 'wordOrder' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-600 hover:text-blue-500'}`}
          onClick={() => setActiveTab('wordOrder')}
        >
          Work Orders
        </button>
      </div>

      {activeTab === 'details' ? (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='shadow-md rounded-lg p-4 bg-amber-50'>
              <h4 className="text-lg font-semibold">Equipment</h4>
              <ul className="list-none list-inside text-gray-700">
                <li>{Installation?.name}</li>
              </ul>
          </div>

          <div className='shadow-md rounded-lg p-4 bg-amber-50'>
            <h4 className="text-lg font-semibold">Type and Status</h4>
            <ul className="list-none list-inside text-gray-700">
              <li>{Installation?.equipment_family_name}</li>
              <li>{Installation?.project_status_name}</li>
            </ul>
          </div>

          <div className='shadow-md rounded-lg p-4 bg-amber-50'>
            <h4 className="text-lg font-semibold">Warranty Info</h4>
            <ul className="list-none list-inside text-gray-700">
                <li>Build date:{new Date(Installation?.date_built).getFullYear() !== 1980 ?? new Date(Installation?.date_built).toLocaleString()}</li>
                <li>Commissioning date: {new Date(Installation?.date_start_production).getFullYear() !== 1980 ?? new Date(Installation?.date_start_production).toLocaleString()}</li>
                <li>End of warranty date: {new Date(Installation?.warranty_date_until).getFullYear() !== 1980 ?? new Date(Installation?.warranty_date_until).toLocaleString()}</li>
                <li>End of parts warranty date: {new Date(Installation?.replacement_date).getFullYear() !== 1980 ?? new Date(Installation?.replacement_date).toLocaleString()}</li>
            </ul>
          </div>

          <div className='shadow-md rounded-lg p-4 bg-amber-50'>
            <h4 className="text-lg font-semibold">Supplier reference</h4>
            <ul className="list-none list-inside text-gray-700">
              <li>{Installation?.id2}</li>
            </ul>
          </div>

          <div className='shadow-md rounded-lg p-4 bg-amber-50'>
            <h4 className="text-lg font-semibold">Our reference</h4>
            <p className="mb-4">{Installation?.customer_reference}</p>
          </div>

          <div className='shadow-md rounded-lg p-4 bg-amber-50'>
            <h4 className="text-lg font-semibold">Serial number and barcode</h4>
            <ul className="list-none list-inside text-gray-700">
              <li>{Installation?.serial_number}</li>
              <li>{Installation?.barcode}</li>
            </ul>
          </div>

          <div className='col-span-3 shadow-md rounded-lg p-4 bg-amber-50'>
            <h4 className="text-lg font-semibold">Shutdown consequence</h4>
            <ul className="list-none list-inside text-gray-700">
              <li>{Installation?.shutdown_consequence}</li>
            </ul>
          </div>

          <div className='shadow-md rounded-lg p-4 bg-amber-50'>
            <h4 className="text-lg font-semibold">Location</h4>
            <ul className="list-none list-inside text-gray-700">
                <li>{Installation?.company_name}</li>
                <li>{Installation?.db_address_street}</li>
                <li>{Installation?.db_address_zip} {Installation?.db_address_city}</li>
                {Installation?.contact_mobile && 
                  <li>{Installation?.contact_mobile}</li>}
            </ul>
          </div>

          <div className='shadow-md rounded-lg p-4 bg-amber-50'>
            <h4 className="text-lg font-semibold">Company address</h4>
            <ul className="list-none list-inside text-gray-700">
                <li>{Installation?.db_address_street}</li>
                <li>{Installation?.db_address_zip} {Installation?.db_address_city}</li>
                {Installation?.contact_mobile && 
                  <li>{Installation?.contact_mobile}</li>}
            </ul>
          </div>

          <div className='shadow-md rounded-lg p-4 bg-amber-50'>
            <h4 className="text-lg font-semibold">Extra location info</h4>
            <ul className="list-none list-inside text-gray-700">
              <li>{Installation?.total_time_planned}</li>
            </ul>
          </div>
        </div> 
      ) : activeTab === 'documents' ? (
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
      ) : (   
          <div>
            {wordOrder ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                          
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                          Reference
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                          Type
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                          First-scheduled technician
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                          Status
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                          Creation Date
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                          Complition Date
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                 {wordOrder.map(item => (
                      <tr className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm text-gray-800">
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-800">
                            <a href={`/word-order/${item.id}`}>{item.id2}</a>
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-800">
                            {item.project_name}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-800">
                            {item.first_planning_userfullname}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-800">
                            {item.job_status_name}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-800">
                            {new Date(item.dateutc_create).toLocaleString()}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-800">
                            {new Date(item.dateutc_closed).getFullYear() !== 1980 && new Date(item.dateutc_closed).toLocaleString()}
                          </td> 
                      </tr>
                 ))}
                </tbody>
              </table>
            </div>
            ) : (
              <p className="text-gray-600">No record available.</p>
            )}
          </div>
        
      )}
    </div>
  );
};

export default SingleInstallation;