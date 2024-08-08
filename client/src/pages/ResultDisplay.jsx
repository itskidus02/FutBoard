import React, { useEffect, useState } from "react";

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
    return <p>Loading...</p>;
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

  return (
    <main>
      {tables.length === 0 ? (
        <p>No tables found</p>
      ) : (
        tables.map((table) => {
          const matchesByDate = organizeMatchesByDate(table.matches);
          return (
            <div key={table._id} className="w-2/6 mx-auto p-3 my-7">
              <div className="overflow-x-auto flex flex-col items-start pl-3 mt-4 rounded-lg ring-2 ring-black">
                {Object.keys(matchesByDate).length === 0 ? (
                  <p>No matches found</p>
                ) : (
                  Object.keys(matchesByDate).map((date) => (
                    <div key={date} className="my-5 w-full">
                      <div className="text-xl font-semibold flex justify-between items-center my-3">
                        <div className="flex items-center gap-4">
                          <div className="bg-green-600 w-1 h-full rounded"></div>
                          <span className="text-green-800">{date}</span>
                        </div>
                        <span className="bg-green-600 text-white px-3 py-1 rounded">{table.name}</span>
                      </div>
  
                      {matchesByDate[date].map((match, index) => {
                        const homeClub = table.clubs.find(
                          (club) => club.clubId._id === match.homeClubId
                        );
                        const awayClub = table.clubs.find(
                          (club) => club.clubId._id === match.awayClubId
                        );
  
                        return (
                          <div
                            key={index}
                            className="flex items-center justify-between my-2 p-2 ring-2 ring-gray-300 rounded-lg"
                          >
                            <div className="flex items-center w-1/3">
                              <span className="mx-2 font-semibold">
                                {homeClub?.clubId.name}
                              </span>
                              {homeClub?.clubId.logoUrl && (
                                <img
                                  src={homeClub.clubId.logoUrl}
                                  alt={`${homeClub.clubId.name} logo`}
                                  className="w-6 h-6 mx-2"
                                />
                              )}
                            </div>
                            <div className="flex items-center justify-center">
                              <span className="font-bold bg-green-600 text-white px-4 py-1 rounded">
                                {match.homeGoals} - {match.awayGoals}
                              </span>
                            </div>
                            <div className="flex items-center justify-end w-1/3">
                              {awayClub?.clubId.logoUrl && (
                                <img
                                  src={awayClub.clubId.logoUrl}
                                  alt={`${awayClub.clubId.name} logo`}
                                  className="w-6 h-6 mx-2"
                                />
                              )}
                              <span className="mx-2 font-semibold">
                                {awayClub?.clubId.name}
                              </span>
                            </div>
                          </div>
                        );
                      })}
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
  ;
};

export default ResultDisplay;
