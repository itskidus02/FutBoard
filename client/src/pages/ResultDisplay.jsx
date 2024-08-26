import Spinner from "@/components/Spinner";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import arrowright from "../assets/arrowright.svg";
import motm from "../assets/motm.svg";

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
        <Spinner />
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

  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Check if there are any matches across all tables
  const noMatchesFound = tables.every((table) => table.matches.length === 0);

  return (
    <main>
      {tables.length === 0 ? (
        <p>No tables found</p>
      ) : noMatchesFound ? (
        <p className="font-fraunces text-center text-3xl">No matches found</p>
      ) : (
        tables.map((table) => {
          const matchesByDate = organizeMatchesByDate(table.matches);

          return (
            <div
              key={table._id}
              className="max-w-screen-2xl mx-auto j gap-4 p-3 my-7"
            >
              <div className="">
                <div className="p-3 rounded-lg">
                  {Object.keys(matchesByDate).map((date) => (
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

                      <div className="">
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
                              className="bg-white rounded-lg p-3"
                            >
                              <Link to={`/match/${match._id}`} key={match._id}>
                                <div className="flex justify-between hover:ring-2 hover:ring-[#00684A] rounded-lg py-1 px-2 items-center">
                                  <div className="flex items-center justify-between space-x-3">
                                    <div className="flex items-center space-x-2">
                                      <span className="font-bold font-poppins uppercase text-xs md:text-sm lg:text-xl">
                                        {homeClub?.clubId.name}
                                      </span>
                                      {homeClub?.clubId.logoUrl && (
                                        <img
                                          src={homeClub.clubId.logoUrl}
                                          alt={`${homeClub.clubId.name} logo`}
                                          className="w-4 h-4 md:w-6 md:h-6 lg:w-7 lg:h-7"
                                        />
                                      )}
                                    </div>

                                    <div className="bg-[#00684A] font-bold text-white text-xs lg:text-2xl font-poppins rounded-md px-3 md:px-5 lg:px-6 py-1 text-center">
                                      {match.homeGoals} - {match.awayGoals}
                                    </div>

                                    <div className="flex items-center space-x-2">
                                      {awayClub?.clubId.logoUrl && (
                                        <img
                                          src={awayClub.clubId.logoUrl}
                                          alt={`${awayClub.clubId.name} logo`}
                                          className="w-4 h-4 md:w-6 md:h-6 lg:w-7 lg:h-7"
                                        />
                                      )}
                                      <span className="font-bold font-poppins uppercase text-xs md:text-sm lg:text-xl">
                                        {awayClub?.clubId.name}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-center uppercase font-poppins font-bold hidden sm:flex">
                                    <img
                                      src={motm}
                                      className="w-8 h-8"
                                      alt=""
                                    />
                                    {match.manOfMatch}
                                  </div>

                                  <img
                                    src={arrowright}
                                    className="lg:w-8 lg:h-8 w-4 h-4"
                                    alt=""
                                  />
                                </div>
                              </Link>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })
      )}
    </main>
  );
};

export default ResultDisplay;
