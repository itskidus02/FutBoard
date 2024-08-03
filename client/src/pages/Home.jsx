import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";

const Home = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const res = await fetch('/api/table/get');
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch tables');
        }
        // Update tables state with fetched data
        setTables(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='px-4 py-12 max-w-2xl mx-auto'>
      <h1 className='text-3xl font-bold mb-4 text-slate-800'>
        Soccer Tables
      </h1>
      <div className='flex gap-4'>
        <button className='ring-2 ring-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white font-bold py-2 px-4 rounded'>
          <Link to="/create-table-team">Create Table</Link>
        </button>
        <button className='ring-2 ring-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white font-bold py-2 px-4 rounded'>
          <Link to="/display-result">Results</Link>
        </button>
      </div>
      <div className='mt-3'>
        <h2 className='text-xl font-bold mb-2'>Tables:</h2>
        <ul>
          {tables.map((table) => (
            <li key={table._id}>
              <Link to={`/display-table/${table._id}`}>
                <p className='text-blue-500 cursor-pointer'>{table.name}</p>
              </Link>
              {/* Display club logos for each table */}
              <div className="flex flex-wrap gap-2 mt-1">
                {table.clubs.map((club) => (
                  <div key={club.clubId._id} className="flex items-center">
                    {club.clubId.logoUrl && (
                      <img
                        src={club.clubId.logoUrl}
                        alt={`${club.clubId.name} logo`}
                        className="w-8 h-8 mr-1"
                      />
                    )}
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
