import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import football from "../assets/football.svg";
import boots from "../assets/boots.svg";

const MatchDisplay = () => {
  const { matchId } = useParams();
  const [match, setMatch] = useState(null);
  const [tableName, setTableName] = useState(null); // State for table name
  const [tableMatches, setTableMatches] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const response = await axios.get(`/api/table/match/${matchId}`);
        setMatch(response.data.match);
        setTableName(response.data.tableName); // Set the table name
        setTableMatches(response.data.tableMatches);
      } catch (err) {
        setError(
          err.response
            ? err.response.data.message
            : "Error fetching match details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMatch();
  }, [matchId]);

  if (loading)
    return <div className="text-center text-gray-500">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="flex max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
      {/* Left Sidebar - Other Matches */}
      <div className="w-1/3 bg-gray-100 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Matchweek 1</h2>
        <div>
          {tableMatches && tableMatches.length > 0 ? (
            <div className="space-y-4">
              {tableMatches.map((matchItem, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm hover:bg-gray-200 transition duration-200 ease-in-out"
                >
                  <div className="flex items-center">
                    <img
                      src={matchItem.homeClubId.logoUrl}
                      alt={matchItem.homeClubId.name}
                      className="h-12 w-12 mr-4"
                    />
                    <span className="text-lg font-semibold text-gray-800">
                      {matchItem.homeClubId.name}
                    </span>
                  </div>
                  <div className="text-lg font-bold text-gray-800">
                    {matchItem.homeGoals} - {matchItem.awayGoals}
                  </div>
                  <div className="flex items-center">
                    <span className="text-lg font-semibold text-gray-800 mr-4">
                      {matchItem.awayClubId.name}
                    </span>
                    <img
                      src={matchItem.awayClubId.logoUrl}
                      alt={matchItem.awayClubId.name}
                      className="h-12 w-12"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No matches found.</p>
          )}
        </div>
      </div>

      {/* Right Side - Match Details */}
      <div className="w-2/3 pl-6">
        <div className="bg-gray-50 p-6 rounded-lg shadow-md">
          <div className="flex justify-between ring items-center border-b border-gray-200 pb-4 mb-4">
            <div className="flex items-center">
              <img
                src={match.homeClubId.logoUrl}
                alt={match.homeClubId.name}
                className="h-16 w-16 mr-4"
              />
              <span className="text-2xl font-semibold text-gray-800">
                {match.homeClubId.name}
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {match.homeGoals} - {match.awayGoals}
            </div>
            <div className="flex items-center">
              <span className="text-2xl font-semibold text-gray-800 mr-4">
                {match.awayClubId.name}
              </span>
              <img
                src={match.awayClubId.logoUrl}
                alt={match.awayClubId.name}
                className="h-16 w-16"
              />
            </div>
          </div>

          <div className="flex justify-between">
            <div className="border-b ring  border-gray-200 pb-4">
              {match.homeScorers.length ? (
                <ul className="list-none space-y-3">
                  {match.homeScorers.map((scorer, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <span className="text-lg font-semibold text-gray-700">
                        {scorer.scorer}
                      </span>
                      <span className="text-sm text-gray-600">
                        {scorer.time}'{" "}
                        <img
                          src={football}
                          alt="football"
                          className="inline h-4 w-4"
                        />
                        {scorer.assistor && (
                          <>
                            <span className="ml-2">Assist:</span>{" "}
                            <img
                              src={boots}
                              alt="assist"
                              className="inline h-4 w-4"
                            />
                            <span className="ml-1">{scorer.assistor}</span>
                          </>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No scorers for {match.homeClubId.name}.</p>
              )}
            </div>

            <div className="border-b ring border-gray-200 pb-4">
              {match.awayScorers.length ? (
                <ul className="list-none space-y-3">
                  {match.awayScorers.map((scorer, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <span className="text-lg font-semibold text-gray-700">
                        {scorer.scorer}
                      </span>
                      <span className="text-sm text-gray-600">
                        {scorer.time}'{" "}
                        <img
                          src={football}
                          alt="football"
                          className="inline h-4 w-4"
                        />
                        {scorer.assistor && (
                          <>
                            <span className="ml-2">Assist:</span>{" "}
                            <img
                              src={boots}
                              alt="assist"
                              className="inline h-4 w-4"
                            />
                            <span className="ml-1">{scorer.assistor}</span>
                          </>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No scorers for {match.awayClubId.name}.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchDisplay;
