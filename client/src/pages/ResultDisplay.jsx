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
            <div key={table._id} className="w-3/4 mx-auto p-3 my-7">
              <h1 className="text-3xl font-semibold text-center my-7">
                {table.name}
              </h1>
              <div className="overflow-x-auto flex flex-col items-start pl-3 mt-4 rounded-lg ring-2 ring-black">
                <h2 className="text-2xl font-semibold underline text-center my-5">
                  Matches Played
                </h2>
                {Object.keys(matchesByDate).length === 0 ? (
                  <p>No matches found</p>
                ) : (
                  Object.keys(matchesByDate).map((date) => (
                    <div key={date} className="my-5">
                      <h3 className="text-xl font-semibold text-center my-3">
                        {date}
                      </h3>
                      {matchesByDate[date].map((match, index) => {
                        const homeClub = table.clubs.find(
                          (club) => club.clubId._id === match.homeClubId
                        );
                        const awayClub = table.clubs.find(
                          (club) => club.clubId._id === match.awayClubId
                        );

                        return (
                          <div key={index} className="flex items-center justify-between my-3">
                            <div className="flex items-center">
                              {homeClub?.clubId.logoUrl && (
                                <img
                                  src={homeClub.clubId.logoUrl}
                                  alt={`${homeClub.clubId.name} logo`}
                                  className="w-8 h-8 mx-2"
                                />
                              )}
                              <span className="mx-2">{homeClub?.clubId.name}</span>
                              <span className="font-bold mx-2">
                                {match.homeGoals} - {match.awayGoals}
                              </span>
                              <span className="mx-2">{awayClub?.clubId.name}</span>
                              {awayClub?.clubId.logoUrl && (
                                <img
                                  src={awayClub.clubId.logoUrl}
                                  alt={`${awayClub.clubId.name} logo`}
                                  className="w-8 h-8 mx-2"
                                />
                              )}
                            </div>
                            <div className="flex items-center">
                              <span className="mx-2">{match.stadium}</span>
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
};

export default ResultDisplay;
