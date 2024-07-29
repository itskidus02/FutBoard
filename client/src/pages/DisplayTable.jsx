import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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
        // Sort clubs by points and then by goal difference
        data.clubs.sort((a, b) => {
          if (b.points === a.points) {
            return b.goalDifference - a.goalDifference;
          }
          return b.points - a.points;
        });
        setTable(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching table:', error);
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
        setCreator(data);
      } catch (error) {
        console.error('Error fetching creator:', error);
      }
    };
    if (table) {
      fetchCreator();
    }
  }, [table]);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(table.clubs.map((club, index) => ({
      Position: index + 1,
      Club: club.clubId.name,
      Played: club.played,
      Won: club.won,
      Lost: club.lost,
      Drawn: club.drawn,
      'Goals Scored': club.goalsScored,
      'Goals Conceded': club.goalsConceded,
      'Goal Difference': club.goalDifference,
      Points: club.points
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Table');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `${table.name}.xlsx`);
  };

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
          <button onClick={exportToExcel} className="px-4 py-2 bg-black text-white rounded-md mb-4">
            Export to Excel
          </button>
          <div className="overflow-x-auto mb-8">
            <table className="min-w-full bg-white border-collapse">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Position</th>
                  <th className="py-2 px-4 border-b">Club</th>
                  <th className="py-2 px-4 border-b">Played</th>
                  <th className="py-2 px-4 border-b">Won</th>
                  <th className="py-2 px-4 border-b">Drawn</th>
                  <th className="py-2 px-4 border-b">Lost</th>
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
          <div className="overflow-x-auto">
            <h2 className="text-2xl font-semibold text-center my-5">Matches Played</h2>
            <table className="min-w-full bg-white border-collapse">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Match</th>
                  <th className="py-2 px-4 border-b">Match Date</th>
                </tr>
              </thead>
              <tbody>
                {table.matches.map((match, index) => (
                  <tr key={index} className="text-center">
                    <td className="py-2 px-4 border-b">
                      {table.clubs.find(club => club.clubId._id === match.homeClubId)?.clubId.name}, 
                      {match.homeGoals} - {match.awayGoals}, 
                      {table.clubs.find(club => club.clubId._id === match.awayClubId)?.clubId.name}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {new Date(match.matchDate).toLocaleDateString()}
                    </td>
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
