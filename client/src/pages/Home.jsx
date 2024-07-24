import React, { useEffect, useState } from 'react';

export default function Home() {
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
        setTables(data); // Assuming 'data' is the array of tables in your response
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, []); // Empty dependency array means this effect runs once on component mount

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='px-4 py-12 max-w-2xl mx-auto'>
      <h1 className='text-3xl font-bold mb-4 text-slate-800'>
        The new project
      </h1>
      
      <div>
        <h2 className='text-xl font-bold mb-2'>Tables:</h2>
        <ul>
          {tables.map((table) => (
            <li key={table._id}>
              <p>{table.name}</p> {/* Assuming each table has a 'name' property */}
             
              {/* Render other table details as needed */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
