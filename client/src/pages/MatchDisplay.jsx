import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import football from "../assets/football.svg";
import boots from "../assets/boots.svg";

const MatchDisplay = () => {
  const { matchId } = useParams();
  const [match, setMatch] = useState(null);
  const [tableName, setTableName] = useState(null);  // State for table name
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const response = await axios.get(`/api/table/match/${matchId}`);
        setMatch(response.data.match);
        setTableName(response.data.tableName);  // Set the table name
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
    <div className="max-w-4xl mx-auto ring bg-white shadow-lg rounded-lg p-6">
      {/* Display the table name at the top */}
      <div className="text-center text-3xl font-bold text-gray-800 mb-4">
        {tableName}
      </div>
      <div className="flex ring-2 ring-red-400 justify-between items-center p-4 border-b border-gray-300">
        <div className="flex items-center">
          <img
            src={match.homeClubId.logoUrl}
            alt={match.homeClubId.name}
            className="h-16 w-16 mr-4"
          />
          <span className="text-2xl font-bold">{match.homeClubId.name}</span>
        </div>
        <div className="text-2xl font-semibold text-gray-800">
          {match.homeGoals} - {match.awayGoals}
        </div>
        <div className="flex items-center">
          <span className="text-2xl font-bold text-gray-800 mr-4">
            {match.awayClubId.name}
          </span>
          <img
            src={match.awayClubId.logoUrl}
            alt={match.awayClubId.name}
            className="h-16 w-16"
          />
        </div>
      </div>
      <div className="px-6 ring-2 ring-green-300 mt-4 flex justify-between py-6">
        <div className="border-t border-gray-200 pt-4 w-1/2">
          {match.homeScorers.length ? (
            <ul className="list-none">
              {match.homeScorers.map((scorer, index) => (
                <li key={index} className="mb-2">
                  <span className="flex items-center gap-2 font-bold">
                    {scorer.time}'{" "}
                    <img src={football} alt="football" className="h-4 w-4" />
                  </span>{" "}
                  {scorer.scorer} <br />
                  <span className="flex items-center gap-1 font-bold">
                    <img src={boots} alt="football" className="h-4 w-4" />
                    {scorer.assistor ? `${scorer.assistor}` : null}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No scorers for {match.homeClubId.name}.</p>
          )}
        </div>
        <div className="border-t  border-gray-200 pt-4">
          {match.awayScorers.length ? (
            <ul className="list-none">
              {match.awayScorers.map((scorer, index) => (
                <li key={index} className="mb-2">
                  <span className="flex items-center gap-2 font-bold">
                    {scorer.time}'{" "}
                    <img src={football} alt="football" className="h-4 w-4" />
                  </span>{" "}
                  {scorer.scorer} <br />{" "}
                  <span className="flex items-center gap-1 font-bold">
                    <img src={boots} alt="football" className="h-4 w-4" />
                    {scorer.assistor ? `${scorer.assistor}` : null}
                  </span>{" "}
                </li>
              ))}
            </ul>
          ) : (
            <p>No scorers for {match.awayClubId.name}.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchDisplay;
