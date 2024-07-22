import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function DisplayTable() {
  const [table, setTable] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const params = useParams();

  useEffect(() => {
    const fetchTable = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/table/get/${params.tableId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setTable(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchTable();
  }, [params.tableId]);

  return (
    <main>
      {loading && (
        <div className="fixed top-1/3 left-1/2 transform -translate-y-1/3 -translate-x-1/2">
          <p>Loading...</p>
        </div>
      )}
      {error && (
        <p className="text-center my-7 text-2xl">Error loading table</p>
      )}
      {table && !loading && !error && (
        <div className="max-w-4xl mx-auto p-3 my-7">
          <h1 className="text-3xl font-semibold text-center my-7">{table.name}</h1>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border-collapse">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Club Name</th>
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
                    <td className="py-2 px-4 border-b">{club.clubId.name}</td>
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
}
