import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DisplayTable from "./DisplayTable";

export default function ManageMatches() {
  const { tableId } = useParams();
  const [clubs, setClubs] = useState([]);
  const [selectedClubs, setSelectedClubs] = useState({ homeClub: "", awayClub: "" });
  const [matchResult, setMatchResult] = useState({ homeGoals: 0, awayGoals: 0 });

  useEffect(() => {
    // Fetch clubs from the table
    const fetchClubs = async () => {
      try {
        const response = await fetch(`/api/table/get/${tableId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch clubs");
        }
        const table = await response.json();
        setClubs(table.clubs.map(c => c.clubId)); // Extract club information
      } catch (error) {
        console.error("Error fetching clubs:", error);
      }
    };

    fetchClubs();
  }, [tableId]);

  const handleClubChange = (type, clubId) => {
    setSelectedClubs(prevState => ({
      ...prevState,
      [type]: clubId
    }));
  };

  const handleMatchResultChange = (type, value) => {
    setMatchResult(prevState => ({
      ...prevState,
      [type]: value
    }));
  };

  const handleMatchSubmit = async (e) => {
    e.preventDefault();

    try {
      const matchData = {
        tableId,
        homeClubId: selectedClubs.homeClub,
        awayClubId: selectedClubs.awayClub,
        homeGoals: matchResult.homeGoals,
        awayGoals: matchResult.awayGoals
      };

      const response = await fetch("/api/table/update-match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(matchData),
      });

      if (!response.ok) {
        throw new Error("Failed to update match result");
      }

      const updatedTable = await response.json();
      console.log("Match result updated successfully:", updatedTable);
      // Optionally, you can redirect or show a success message
    } catch (error) {
      console.error("Error updating match result:", error);
    }
  };

  return (
    <div>
      <DisplayTable/> 
      <h1>Manage Matches</h1>
      <form onSubmit={handleMatchSubmit}>
        <select value={selectedClubs.homeClub} onChange={(e) => handleClubChange("homeClub", e.target.value)}>
          <option value="">Select Home Club</option>
          {clubs.map(club => (
            <option key={club._id} value={club._id}>
              {club.name}
            </option>
          ))}
        </select>
        <select value={selectedClubs.awayClub} onChange={(e) => handleClubChange("awayClub", e.target.value)}>
          <option value="">Select Away Club</option>
          {clubs.map(club => (
            <option key={club._id} value={club._id}>
              {club.name}
            </option>
          ))}
        </select>
        <input type="number" value={matchResult.homeGoals} onChange={(e) => handleMatchResultChange("homeGoals", e.target.value)} />
        <input type="number" value={matchResult.awayGoals} onChange={(e) => handleMatchResultChange("awayGoals", e.target.value)} />
        <button type="submit">Submit Match Result</button>
      </form>
    </div>
  );
}
