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
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-4">Match Details</h1>
      <div className="mb-4">
        <p className="text-lg font-semibold"><strong>Date:</strong> {new Date(match.matchDate).toLocaleDateString()}</p>
      </div>
      <div className="mb-4 flex gap-3 border-t border-gray-200 pt-4">
        <p className="text-xl font-semibold mb-2"><strong>Home Club:</strong> {match.homeClubId.name} ({match.homeGoals} goals)</p>
        <p className="text-xl font-semibold mb-2"><strong>Away Club:</strong> {match.awayClubId.name} ({match.awayGoals} goals)</p>
      </div>
      <div className="mb-4 border-t border-gray-200 pt-4">
        <p className="text-lg font-semibold mb-2"><strong>Home Scorers:</strong></p>
        {match.homeScorers.length ? (
          <ul className="list-disc list-inside pl-5">
            {match.homeScorers.map(scorer => (
              <li key={scorer.scorer} className="mb-1">
                {scorer.scorer} (Assisted by: {scorer.assistor})
              </li>
            ))}
          </ul>
        ) : (
          <p>No scorers for home team.</p>
        )}
      </div>
      <div className="border-t border-gray-200 pt-4">
        <p className="text-lg font-semibold mb-2"><strong>Away Scorers:</strong></p>
        {match.awayScorers.length ? (
          <ul className="list-disc list-inside pl-5">
            {match.awayScorers.map(scorer => (
              <li key={scorer.scorer} className="mb-1">
                {scorer.scorer} (Assisted by: {scorer.assistor})
              </li>
            ))}
          </ul>
        ) : (
          <p>No scorers for away team.</p>
        )}
      </div>
    </div>
  );
};

export default MatchDisplay;
