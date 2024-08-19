import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const MatchDisplay = () => {
  const { matchId } = useParams();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const response = await axios.get(`/api/table/match/${matchId}`);
        setMatch(response.data);
      } catch (err) {
        setError(err.response ? err.response.data.message : "Error fetching match details");
      } finally {
        setLoading(false);
      }
    };

    fetchMatch();
  }, [matchId]);

  if (loading) return <div className="text-center text-gray-500">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <div className="flex items-center justify-between p-6 ring">
        <div className="flex items-center">
          <img src={match.homeClubId.logoUrl} alt={match.homeClubId.name} className="h-16 w-16 mr-4" />
          <span className="text-2xl font-bold text-white">{match.homeClubId.name}</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-5xl font-bold ring p-2 m-2 text-purple-900">{match.homeGoals} - {match.awayGoals}</div>
          <div className="text-md text-white">Half Time: {match.halfTimeScore}</div>
        </div>
        <div className="flex items-center">
          <span className="text-2xl font-bold text-gray-800 mr-4">{match.awayClubId.name}</span>
          <img src={match.awayClubId.logoUrl} alt={match.awayClubId.name} className="h-16 w-16" />
        </div>
      </div>
      <div className="flex justify-center items-center py-4">
        <div className="text-lg font-semibold text-purple-900">
          FT
        </div>
      </div>
      <div className="px-6 flex justify-between pb-6">
        <div className="border-t border-gray-200 pt-4">
          {match.homeScorers.length ? (
            <ul className="list-none">
              {match.homeScorers.map((scorer, index) => (
                <li key={index} className="mb-2">
                  <span className="font-bold">{scorer.time}'</span> - {scorer.scorer} {scorer.assistor ? `(Assist: ${scorer.assistor})` : null}
                </li>
              ))}
            </ul>
          ) : (
            <p>No scorers for {match.homeClubId.name}.</p>
          )}
        </div>
        <div className="border-t border-gray-200 pt-4">
          {match.awayScorers.length ? (
            <ul className="list-none">
              {match.awayScorers.map((scorer, index) => (
                <li key={index} className="mb-2">
                  <span className="font-bold">{scorer.time}'</span> - {scorer.scorer} {scorer.assistor ? `(Assist: ${scorer.assistor})` : null}
                </li>
              ))}
            </ul>
          ) : (
            <p>.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchDisplay;
