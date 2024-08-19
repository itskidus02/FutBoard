// MatchDisplay.jsx
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Match Details</h1>
      <p><strong>Date:</strong> {new Date(match.matchDate).toLocaleDateString()}</p>
      <p><strong>Home Club:</strong> {match.homeClubId.name} ({match.homeGoals} goals)</p>
      <p><strong>Away Club:</strong> {match.awayClubId.name} ({match.awayGoals} goals)</p>
    </div>
  );
};

export default MatchDisplay;
