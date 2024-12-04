import React, { useMemo, useState, useEffect } from 'react';
import { useTable, usePagination } from 'react-table';
import { fetchData } from '../services/apiService.js';
import { useNavigate } from 'react-router-dom';

import Select from 'react-select';
import makeAnimated from 'react-select/animated';
const animatedComponents = makeAnimated();

const ViewDocuments = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fileTypesOptions = [
    { value: "documents", label: "Documents", extentions: ["DOC", "DOCX"] },
    { value: "pdf", label: "PDF", extentions: ["PDF"] },
    { value: "formpdf", label: "Form PDF", extentions: ["FORM_PDF"] },
    { value: "approvalpdf", label: "Approval PDF", extentions: ["APPROVAL_PDF"] },
    { value: "sheet", label: "Sheet", extentions: ["XLS", "XLSX", "CSV"] },
    { value: "text", label: "Text", extentions: ["TXT", "CSV"] },
    { value: "image", label: "Image", extentions: ["JPG", "PNG", "JPEG", "BMP", "TIFF", "GIF", "TGA"] },
    { value: "presentation", label: "Presentation", extentions: ["PPT", "PPTX"] },
    { value: "other", label: "Other", extentions: [] }
  ];

  const uniqueDates = [
    { value: '2024', label: "2024" },
    { value: '2023', label: "2023" },
    { value: '2022', label: "2022" },
    { value: '2021', label: "2021" },
    { value: '2020', label: "2020" },
    { value: '2019', label: "2019" }
  ];

  const uniqueObjects = [
    { value: "you", label: "Upload by you" },
    { value: "company", label: "Company" },
    { value: "task", label: "Task" },
    { value: "jobs", label: "Jobs" },
    { value: "project", label: "Project" }
  ];

  // Search Filter states
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [date, setDate] = useState([uniqueDates[0]]);
  const [fileType, setFileType] = useState([]);
  const [object, setObject] = useState([]);
  const [includeArchived, setIncludeArchived] = useState(false);

  // Debounced states
  const [debouncedKeyword, setDebouncedKeyword] = useState(keyword);
  const [debouncedLocation, setDebouncedLocation] = useState(location);
  const [debouncedStreet, setDebouncedStreet] = useState(street);
  const [debouncedCity, setDebouncedCity] = useState(city);

  const auth = JSON.parse(sessionStorage.getItem('auth'));
  const authString = `${auth.email.trim()}:${auth.password.trim()}@${auth.domain.trim()}`;
  const authKey = btoa(authString);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, [keyword]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedLocation(location);
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, [location]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedStreet(street);
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, [street]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedCity(city);
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, [city]);

  useEffect(() => {
    const fetchInstallations = async () => {
      try {
        const payload = {
          keyword: debouncedKeyword,
          file_types: fileType.map((type) => type.value),
          project_id: "00000000-0000-0000-0000-000000000000",
          db_report_type_ids: [],
          street: debouncedStreet,
          city: debouncedCity,
          added_date: date.length ? date.map((d) => d.value) : date.value,
          object_list: object.map((obj) => obj.value),
          file_extentions: fileType.reduce((acc, type) => acc.concat(type.extentions), []),
          file_extentions_not_in: [],
          date_add_min: `${date.length ? date.map((d) => d.value) : date.value}-01-01T00:00:00.000`,
          date_add_max: `${date.length ? date.map((d) => d.value) : date.value}-12-31T23:59:59.000`,
          query_object: {
            startRow: 0,
            endRow: 500,
            rowGroupCols: [
              {
                id: "object_type",
                displayName: "Object",
                field: "object_type"
              }
            ],
            valueCols: [],
            pivotCols: [],
            pivotMode: false,
            groupKeys: ["Upload by you", "Company", "Task", "Jobs", "Project"],
            filterModel: {},
            sortModel: []
          }
        };
        const response = await fetchData('https://V1servicedeskapi.wello.solutions/api/DbFileView/Search', 'POST', payload);
        setContacts(response || []);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchInstallations();
  }, [debouncedKeyword, debouncedLocation, debouncedStreet, debouncedCity, date, fileType, object, includeArchived]);

  const columns = useMemo(
    () => [
      { Header: 'Object', accessor: 'object_type' },
      { Header: 'Object Name', 
        Cell: ({ row }) => (
          <a href={`./ticket/${row.original.object_id}`} className="text-indigo-600 hover:underline">
            {row.original.object_name}
          </a>
        ),
      },
      { Header: 'File Type', accessor: 'file_extention' },
      { Header: 'File Name', 
        Cell: ({ row }) => (
          <a href={`https://servicedeskapi.wello.solutions/api/DbFileView/View/${row.original.file_name.replace(/[^a-zA-Z ]/g, "")}?id=${row.original.id}&token=${authKey}`} className="text-indigo-600 hover:underline" target="_blank" rel="noreferrer">
            {row.original.file_name}
          </a>
        ),
      },
      { Header: 'Upload When', accessor: 'date_add', Cell: ({ value }) => new Date(value).toLocaleDateString() },
    ],
    [authKey]
  );

  const handleReset = () => {
    setKeyword('');
    setLocation('');
    setStreet('');
    setCity('');
    setDate([uniqueDates[0]]);
    setFileType([]);
    setObject([]);
    setIncludeArchived(false);
  };

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
      data: contacts,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    usePagination
  );

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="relative">
        <div className="w-20 h-20 border-purple-200 border-2 rounded-full"></div>
        <div className="w-20 h-20 border-purple-700 border-t-2 animate-spin rounded-full absolute left-0 top-0"></div>
      </div>
    </div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className='flex'>
        <button
          onClick={() => navigate('/')}
          className="mb-6 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
        >
          {'<'}
        </button>
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 ml-4">Documents</h1>
      </div>

      {/* Search Filter UI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label>Keyword</label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full"
          />
        </div>
        <div>
          <label>Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full"
          />
        </div>
        <div>
          <label>Street</label>
          <input
            type="text"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full"
          />
        </div>
        <div>
          <label>City</label>
          <input
            type="text"
            value={city}
            onInput={(e) => setCity(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full"
          />
        </div>
        <div>
          <label>Created Date</label>
          <Select
            components={animatedComponents}
            defaultValue={uniqueDates[0]}
            options={uniqueDates}
            value={date}
            onChange={setDate}
            className="w-full"
          />
        </div>
        <div>
          <label>File Type</label>
          <Select
            closeMenuOnSelect={false}
            components={animatedComponents}
            isMulti
            defaultValue={fileTypesOptions}
            options={fileTypesOptions}
            value={fileType}
            onChange={setFileType}
            placeholder="Select file type"
            className="w-full border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label>Object</label>
          <Select
            closeMenuOnSelect={false}
            components={animatedComponents}
            isMulti
            defaultValue={uniqueObjects}
            options={uniqueObjects}
            value={object}
            onChange={setObject}
            placeholder="Select objects"
            className="w-full border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex items-end">
          <button onClick={handleReset} className="bg-gray-300 text-black rounded-md px-4 py-2 ml-2">Reset</button>
        </div>
      </div>

      {/* Table displaying data */}
      <div className="overflow-x-auto mb-4">
        <table {...getTableProps()} className="min-w-full divide-y divide-gray-200 border border-gray-300">
          <thead className="bg-gray-100">
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()} className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
            {page.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => (
                    <td {...cell.getCellProps()} className="px-4 py-2 text-sm text-gray-800">
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {contacts.length > 10 && (
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-sm text-gray-600">Page {pageIndex + 1} of {pageOptions.length}</span>
          </div>
          <div>
            <button onClick={() => gotoPage(0)} disabled={!canPreviousPage} className="py-2 px-4 mr-2 bg-indigo-600 text-white rounded-md disabled:bg-gray-300">
              {'<<'}
            </button>
            <button onClick={previousPage} disabled={!canPreviousPage} className="py-2 px-4 mr-2 bg-indigo-600 text-white rounded-md disabled:bg-gray-300">
              {'<'}
            </button>
            <button onClick={nextPage} disabled={!canNextPage} className="py-2 px-4 mr-2 bg-indigo-600 text-white rounded-md disabled:bg-gray-300">
              {'>'}
            </button>
            <button onClick={() => gotoPage(pageOptions.length - 1)} disabled={!canNextPage} className="py-2 px-4 bg-indigo-600 text-white rounded-md disabled:bg-gray-300">
              {'>>'}
            </button>
          </div>
          <select
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value));
            }}
            className="border border-gray-300 rounded-md p-2 max-w-32"
          >
            {[10, 20, 30, 50].map(pageSizeOption => (
              <option key={pageSizeOption} value={pageSizeOption}>
                Show {pageSizeOption}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default ViewDocuments;
