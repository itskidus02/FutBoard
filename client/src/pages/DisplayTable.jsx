import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const DisplayTable = () => {
  const [table, setTable] = useState(null);
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const params = useParams();

  useEffect(() => {
    const fetchTable = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/table/get/${params.tableId}`);
        if (!res.ok) throw new Error('Failed to fetch table');
        const data = await res.json();
        console.log('Fetched table data:', data); // Log the fetched data
        setTable(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching table:', error); // Log any errors
        setError(true);
        setLoading(false);
      }
    };
    fetchTable();
  }, [params.tableId]);

  useEffect(() => {
    const fetchCreator = async () => {
      try {
        const res = await fetch(`/api/user/${table.userId._id}`);
        if (!res.ok) throw new Error('Failed to fetch creator');
        const data = await res.json();
        console.log('Fetched creator data:', data); // Log the fetched data
        setCreator(data);
      } catch (error) {
        console.error('Error fetching creator:', error); // Log any errors
      }
    };
    if (table) {
      fetchCreator();
    }
  }, [table]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error loading table</p>;
  }

  return (
    <main>
      {table && (
        <div className="w-3/4 mx-auto p-3 my-7">
          <h1 className="text-3xl font-semibold text-center my-7">{table.name}</h1>
          {creator && (
            <div className="flex ring-2 p-2 ring-[#00ed64] rounded-lg flex-col gap-2">
              <p>
                Listed by{" "}
                <span className="font-semibold">{creator.username}</span>{" "}
              </p>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border-collapse">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Position</th>
                  <th className="py-2 px-4 border-b">Club</th>
                  <th className="py-2 px-4 border-b">Played</th>
                  <th className="py-2 px-4 border-b">Won</th>
                  <th className="py-2 px-4 border-b">Lost</th>
                  <th className="py-2 px-4 border-b">Drawn</th>
                  <th className="py-2 px-4 border-b">Goals Scored</th>
                  <th className="py-2 px-4 border-b">Goals Conceded</th>
                  <th className="py-2 px-4 border-b">Goal Difference</th>
                  <th className="py-2 px-4 border-b">Points</th>
                </tr>
              </thead>
              <tbody>
                {table.clubs.map((club, index) => (
                  <tr key={index} className="text-center">
                    <td className="py-2 px-4 border-b">{index + 1}</td>
                    <td className="py-2 px-4 border-b flex items-center">
                      {club.clubId.logoUrl && (
                        <img
                          src={club.clubId.logoUrl}
                          alt={`${club.clubId.name} logo`}
                          className="w-6 h-6 mr-2"
                        />
                      )}
                      {club.clubId.name}
                    </td>
                    <td className="py-2 px-4 border-b">{club.played}</td>
                    <td className="py-2 px-4 border-b">{club.won}</td>
                    <td className="py-2 px-4 border-b">{club.lost}</td>
                    <td className="py-2 px-4 border-b">{club.drawn}</td>
                    <td className="py-2 px-4 border-b">{club.goalsScored}</td>
                    <td className="py-2 px-4 border-b">{club.goalsConceded}</td>
                    <td className="py-2 px-4 border-b">{club.goalDifference}</td>
                    <td className="py-2 px-4 border-b">{club.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
};

export default DisplayTable;
