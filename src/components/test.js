import React, { useMemo, useState, useEffect } from 'react';
import { useTable, usePagination } from 'react-table';
import { fetchData } from '../services/apiService.js';
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

const CreateTicket = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [step, setStep] = useState(1);
  const [ticketDetails, setTicketDetails] = useState({
    ticketType: 'Repair request', 
    severity: 'Not critical', 
    problemDescription: '', 
    file: null
  });
  
  const [location, setLocation] = useState('');
  const [keyword, setKeyword] = useState('');
  const [brand, setBrand] = useState('All');
  const [model, setModel] = useState('All');
  const [status, setStatus] = useState('All');
  const [includeArchived, setIncludeArchived] = useState(false);

  // Missing state variables
  const [date, setDate] = React.useState(new Date())
  const [hours, setHours] = React.useState(19)
  const [minutes, setMinutes] = React.useState(38)
  const [prefersDate, setPrefersDate] = useState(false); // Toggle for showing the date picker

  const incrementHours = () => setHours(h => h === 23 ? 0 : h + 1)
  const decrementHours = () => setHours(h => h === 0 ? 23 : h - 1)
  const incrementMinutes = () => setMinutes(m => m === 59 ? 0 : m + 1)
  const decrementMinutes = () => setMinutes(m => m === 0 ? 59 : m - 1)

  const uniqueBrands = [...new Set(contacts.map(contact => contact.equipment_brand_name))];
  const uniqueModels = [...new Set(contacts.map(contact => contact.equipment_model_name))];
  const uniqueStatuses = [...new Set(contacts.map(contact => contact.project_status_name))];

  const steps = [
    { id: 1, label: "Installation" },
    { id: 2, label: "Ticket Description" },
    { id: 3, label: "Date & Time" },
    { id: 4, label: "Review & Submit" },
  ];

  useEffect(() => {
    const fetchInstallations = async () => {
      try {
        const response = await fetchData('https://v1servicedeskapi.wello.solutions/api/ProjectView', 'GET');
        setContacts(response.value || []); // Adjusted for your API's response structure
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };
    fetchInstallations();
  }, []);

  const columns = useMemo(
    () => [
      { Header: 'Name', accessor: 'name' },
      { Header: 'Address', accessor: 'db_address_street' },
      { Header: 'Type', accessor: 'equipment_family_name' },
      { Header: 'Customer Reference', accessor: 'customer_reference' },
      { Header: 'Brand', accessor: 'equipment_brand_name' },
      { Header: 'Model', accessor: 'equipment_model_name' },
      { Header: 'Serial Number', accessor: 'serial_number' },
      { Header: 'Barcode', accessor: 'barcode' },
      { Header: 'Status', accessor: 'project_status_name' },
    ],
    []
  );

  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      const matchesLocation = location ? contact.db_address_street.toLowerCase().includes(location.toLowerCase()) : true;
      const matchesKeyword = keyword ? contact.name.toLowerCase().includes(keyword.toLowerCase()) : true;
      const matchesBrand = brand !== 'All' ? contact.equipment_brand_name === brand : true;
      const matchesModel = model !== 'All' ? contact.equipment_model_name === model : true;
      const matchesStatus = status !== 'All' ? contact.project_status_name === status : true;
      const matchesArchived = includeArchived ? true : contact.project_status_name !== 'Archived';

      return matchesLocation && matchesKeyword && matchesBrand && matchesModel && matchesStatus && matchesArchived;
    });
  }, [contacts, location, keyword, brand, model, status, includeArchived]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: filteredContacts,
      initialState: { pageIndex: 0 },
    },
    usePagination
  );

  if (loading) {
    return <div className="text-center text-gray-700">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">Error fetching data: {error.message}</div>;
  }

  const handleReset = () => {
    setLocation('');
    setKeyword('');
    setBrand('All');
    setModel('All');
    setStatus('All');
    setIncludeArchived(false);
  };

  const handleRowClick = (row) => {
    setSelectedRow(row.original);
    setStep(2);
  };


  const handleSubmitTicket = () => {
    console.log('Ticket details:', ticketDetails);
    alert('Ticket created successfully!');
    setStep(1); // Reset to the first step
    setSelectedRow(null);
    setTicketDetails({});
  };


  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Create New Ticket</h1>

      {/* Step Indicator Bar */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((item) => (
          <div key={item.id} className="flex-1 text-center">
            <div className={`flex items-center justify-center w-10 h-10 mx-auto rounded-full ${
              step >= item.id ? "bg-indigo-500 text-white" : "bg-gray-300 text-gray-600"
            }`}>
              {item.id}
            </div>
            <p
              className={`text-sm font-medium mt-2 ${
                step >= item.id ? "text-indigo-600" : "text-gray-500"
              }`}
            >
              {item.label}
            </p>
            {item.id <= steps.length && (
              <div className={`h-1 mx-auto w-full ${
                step >= item.id ? "bg-indigo-500" : "bg-gray-300"
              }`}></div>
            )}
          </div>
        ))}
      </div>

      {step === 1 && (
        <>
          {/* Search Filter UI */}
          <div className="mb-6 p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">1. Installation</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input 
                  type="text" 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)} 
                  placeholder="Enter location" 
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Keyword</label>
                <input 
                  type="text" 
                  value={keyword} 
                  onChange={(e) => setKeyword(e.target.value)} 
                  placeholder="Type a text" 
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Brand</label>
                <select value={brand} onChange={(e) => setBrand(e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="All">All</option>
                  {uniqueBrands.map((brand) => (
                      brand && <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Model</label>
                <select value={model} onChange={(e) => setModel(e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="All">All</option>
                  {uniqueModels.map((model) => (
                      model && <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="All">All</option>
                  {uniqueStatuses.map((status) => (
                      status && <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-between">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={includeArchived} 
                  onChange={() => setIncludeArchived(!includeArchived)} 
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">Include archived equipment</label>
              </div>
              <button onClick={handleReset} className="bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-md hover:bg-gray-400">
                Reset
              </button>
            </div>
          </div>

          {/* Contacts Table */}
          <div className="overflow-x-auto mt-6">
            <table {...getTableProps()} className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
              <thead>
                {headerGroups.map(headerGroup => (
                  <tr {...headerGroup.getHeaderGroupProps()} className="bg-gray-200">
                    {headerGroup.headers.map(column => (
                      <th {...column.getHeaderProps()} className="border px-4 py-2 text-left text-sm font-medium text-gray-700">
                        {column.render('Header')}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {page.map((row, i) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()} onClick={() => handleRowClick(row)} className="hover:bg-gray-100 cursor-pointer">
                      {row.cells.map(cell => (
                        <td {...cell.getCellProps()} className="border px-4 py-2 text-sm text-gray-600">
                          {cell.render('Cell')}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination Controls - Only show if filteredTickets exceed pageSize (10) */}
            {filteredContacts.length > 10 && (
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-gray-700">
                  Page {pageIndex + 1} of {pageOptions.length}
                </span>
                <div>
                  <button onClick={() => gotoPage(0)} disabled={!canPreviousPage} className="py-2 px-4 mr-2 bg-indigo-600 text-white rounded-md disabled:bg-gray-300">
                    {'<<'}
                  </button>
                  <button onClick={() => previousPage()} disabled={!canPreviousPage} className="py-2 px-4 mr-2 bg-indigo-600 text-white rounded-md disabled:bg-gray-300">
                    {'<'}
                  </button>
                  <button onClick={() => nextPage()} disabled={!canNextPage} className="py-2 px-4 mr-2 bg-indigo-600 text-white rounded-md disabled:bg-gray-300">
                    {'>'}
                  </button>
                  <button onClick={() => gotoPage(pageOptions.length - 1)} disabled={!canNextPage} className="py-2 px-4 bg-indigo-600 text-white rounded-md disabled:bg-gray-300">
                    {'>>'}
                  </button>
                </div>
                <select value={pageSize} onChange={e => setPageSize(Number(e.target.value))} className="ml-2 p-2 border border-gray-300 rounded-md">
                  {[5, 10, 20, 30, 50].map(size => (
                    <option key={size} value={size}>
                      Show {size}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </>
      )}

      {step === 2 && selectedRow && (
        <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">2. Ticket Description</h2>
            
            <form onSubmit={(e) => { e.preventDefault(); setStep(3); }}>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Ticket Type and Severity</label>
                <div className="flex gap-4">
                <select
                    onChange={(e) => setTicketDetails({...ticketDetails, ticketType: e.target.value })}
                    className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                >
                    <option value="Repair request">Repair request</option>
                    {/* Add other ticket types if needed */}
                </select>

                <select
                    onChange={(e) => setTicketDetails({...ticketDetails, severity: e.target.value })}
                    className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                >
                    <option value="Not critical">Not critical</option>
                    <option value="Low">Low</option>
                    <option value="Medium high">Medium high</option>
                    <option value="Critical">Critical</option>
                </select>
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <textarea
                value={`${selectedRow.name} - ${selectedRow.db_address_street}`}
                readOnly
                className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>
            
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Describe the Problem</label>
                <textarea
                onChange={(e) => setTicketDetails({ problemDescription: e.target.value })}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            {/* File Upload Field */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Add Pictures and Documents (max 5MB)</label>
                <input
                type="file"
                onChange={(e) => setTicketDetails({ file: e.target.files[0] })}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            <div className="mt-4 flex justify-end">
                <button type="submit" className="bg-indigo-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-600 mr-2">
                Confirm & Proceed
                </button>
                <button onClick={() => setStep(1)} className="bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-md hover:bg-gray-400">
                Back
                </button>
            </div>
            </form>
        </div>
        )}

      {step === 3 && (
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">3. Select Preferred Intervention Date & Time</h2>
          <span className="text-sm font-medium text-gray-700 mr-4">Date and Time</span>
          <form onSubmit={(e) => { e.preventDefault(); setStep(4); }}>
            {/* Yes/No Toggle for Preferred Date & Time */}
            <div className="mb-4 flex items-center">
              <span className="text-sm text-gray-600 mr-2">Do you have a preferred date and time for the intervention?</span>
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPrefersDate(true)}
                  className={`py-1 px-3 rounded-md font-semibold ${prefersDate ? "bg-indigo-600 text-white" : "bg-gray-300 text-gray-800"}`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setPrefersDate(false)}
                  className={`py-1 px-3 rounded-md font-semibold ${!prefersDate ? "bg-indigo-600 text-white" : "bg-gray-300 text-gray-800"}`}
                >
                  No
                </button>
              </div>
            </div>

            {/* Calendar Picker */}
            {prefersDate && (
              <div className="grid md:grid-cols-2 gap-6">
              <div className="react-calendar-wrapper">
              <h4 className='font-semibold mb-4'>{date.toDateString()} {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}</h4>
                <Calendar
                  onChange={setDate}
                  value={date}
                  className="rounded-lg border border-gray-200 shadow-sm"
                />
              </div>
    
              <div className="flex items-center justify-center gap-4">
                <div className="flex flex-col items-center">
                <div 
                    onClick={incrementHours} 
                    className="p-1 hover:bg-gray-100 rounded"  
                    aria-label="Increment hours" 
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </div>
                  <div className="h-12 w-12 flex items-center justify-center border rounded-md">
                    {hours.toString().padStart(2, '0')}
                  </div>
                  <div
                    onClick={decrementHours}
                    className="p-1 hover:bg-gray-100 rounded"
                    aria-label="Decrement hours"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
    
                <div className="text-2xl">:</div>
    
                <div className="flex flex-col items-center">
                  <div
                    onClick={incrementMinutes}
                    className="p-1 hover:bg-gray-100 rounded"
                    aria-label="Increment minutes"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </div>
                  <div className="h-12 w-12 flex items-center justify-center border rounded-md">
                    {minutes.toString().padStart(2, '0')}
                  </div>
                  <div
                    onClick={decrementMinutes}
                    className="p-1 hover:bg-gray-100 rounded"
                    aria-label="Decrement minutes"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-4 flex justify-end">
              <button type="submit" className="bg-indigo-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-600 mr-2">
                Confirm & Proceed
              </button>
              <button onClick={() => setStep(2)} className="bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-md hover:bg-gray-400">
                Back
              </button>
            </div>
          </form>
        </div>
      )}

      {step === 4 && (
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">4. Confirm and send ticket</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
            <h4 className='font-semibold my-2'>Location</h4>
                <ul className="list-none list-inside text-gray-700">
                    <li>{selectedRow?.db_address_street} {selectedRow?.db_address_city}</li>
                </ul>
            </div>  
            <div>
                <h4 className='font-semibold my-2'>Ticket description</h4>
                <ul className="list-none list-inside text-gray-700">
                    <li>{ticketDetails.ticketType}</li>
                    <li>{ticketDetails.severity}</li>
                </ul>
            </div>
            <div>
                <h4 className='font-semibold my-2'>Equipment</h4>
                <ul className="list-none list-inside text-gray-700">
                    <li>{selectedRow?.equipment_family_name} - {selectedRow?.name}</li>
                </ul>
            </div>
            <div>
                {prefersDate && (
                    <>
                    <h4 className='font-semibold my-2'>Select preferred intervention data & time</h4>
                    <ul className="list-none list-inside text-gray-700">
                        <li>{date.toDateString()} {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}</li>
                    </ul>
                    </>
                )}
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button onClick={handleSubmitTicket} className="bg-green-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-600 mr-2">
              Create
            </button>
            <button onClick={() => setStep(3)} className="bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-md hover:bg-gray-400">
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateTicket;