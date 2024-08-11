import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const ResultDisplay = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const res = await fetch("/api/table/get");
        if (!res.ok) throw new Error("Failed to fetch tables");
        const data = await res.json();
        setTables(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tables:", error);
        setError(true);
        setLoading(false);
      }
    };

    fetchTables();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return <p>Error loading tables</p>;
  }

  const organizeMatchesByDate = (matches) => {
    return matches.reduce((acc, match) => {
      const matchDate = new Date(match.matchDate).toLocaleDateString();
      if (!acc[matchDate]) {
        acc[matchDate] = [];
      }
      acc[matchDate].push(match);
      return acc;
    }, {});
  };
  function formatDate(dateString) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }
  

  return (
    <main>
      {tables.length === 0 ? (
        <p>No tables found</p>
      ) : (
        tables.map((table) => {
          const matchesByDate = organizeMatchesByDate(table.matches);
          return (
            <div key={table._id} className="max-w-screen-xl mx-auto p-3 my-7">
              <div className="rng-2 p-3 rounded-lg ing-[#00684A]">
                {Object.keys(matchesByDate).length === 0 ? (
                  <p>No matches found</p>
                ) : (
                  Object.keys(matchesByDate).map((date) => (
                    <div key={date} className="mb-8">
                      <div className="flex mb-3 justify-between items-center">
                        <div className="text-[#00684A] font-fraunces flex gap-2 text-xs lg:text-2xl">
                          <div className="bg-[#00684A] rounded-lg">.</div>
                          {formatDate(date)}
                        </div>
                        <Link to={`/display-table/${table._id}`}>
                        <div className="bg-[#00684A] uppercase font-fraunces text-white text-xs lg:text-2xl rounded-md px-5 py-1">
                          {table.name.substring(0, 3)}
                        </div>
                          </Link>
                      </div>
  
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
                        {matchesByDate[date].map((match, index) => {
                          const homeClub = table.clubs.find(
                            (club) => club.clubId._id === match.homeClubId
                          );
                          const awayClub = table.clubs.find(
                            (club) => club.clubId._id === match.awayClubId
                          );
  
                          return (
                            <div key={index} className="bg-white rounded-lg p-3">
                              <div className="flex justify-evenly ring-2 ring-[#00684A] rounded-lg py-1 px-2 items-center">
                                <div className="flex items-center">
                                  <span className="font-bold md:text-xs font-poppins lg:text-2xl uppercase">
                                    {homeClub?.clubId.name}
                                  </span>
                                  {homeClub?.clubId.logoUrl && (
                                    <img
                                      src={homeClub.clubId.logoUrl}
                                      alt={`${homeClub.clubId.name} logo`}
                                      className="lg:w-8 lg:h-8 md:w-6 md:h-8 w-4 h-4 mx-2"
                                    />
                                  )}
                                </div>
                                <div className="bg-[#00684A] font-bold text-white text-xs lg:text-2xl font-poppins rounded-md lg:px-6 md:px-5 px-3 py-1">
                                  {match.homeGoals} - {match.awayGoals}
                                </div>
                                <div className="flex items-center">
                                  {awayClub?.clubId.logoUrl && (
                                    <img
                                      src={awayClub.clubId.logoUrl}
                                      alt={`${awayClub.clubId.name} logo`}
                                      className="lg:w-8 lg:h-8 md:w-6 md:h-8 w-4 h-4 mx-2"
                                    />
                                  )}
                                  <span className="font-bold md:text-xs font-poppins lg:text-2xl uppercase">
                                    {awayClub?.clubId.name}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })
      )}
    </main>
  );
  
};

export default ResultDisplay;
