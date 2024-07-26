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
      console.log("Match result updated successfully:");
      // Optionally, you can redirect or show a success message
    } catch (error) {
      console.error("Error updating match result:", error);
    }
  };

  return (
    <div className="w-3/4 mx-auto p-6 my-7">
      <h1 className="text-3xl font-semibold text-center mb-8">Manage Matches</h1>
      <DisplayTable />
      <form onSubmit={handleMatchSubmit} className="mt-8 ring-2 ring-blue-600 rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="homeClub">
            Home Club
          </label>
          <select
            id="homeClub"
            value={selectedClubs.homeClub}
            onChange={(e) => handleClubChange("homeClub", e.target.value)}
            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          >
            <option value="">Select Home Club</option>
            {clubs.map(club => (
              <option key={club._id} value={club._id}>
                {club.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="awayClub">
            Away Club
          </label>
          <select
            id="awayClub"
            value={selectedClubs.awayClub}
            onChange={(e) => handleClubChange("awayClub", e.target.value)}
            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          >
            <option value="">Select Away Club</option>
            {clubs.map(club => (
              <option key={club._id} value={club._id}>
                {club.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="homeGoals">
            Home Goals
          </label>
          <input
            type="number"
            id="homeGoals"
            value={matchResult.homeGoals}
            onChange={(e) => handleMatchResultChange("homeGoals", e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="awayGoals">
            Away Goals
          </label>
          <input
            type="number"
            id="awayGoals"
            value={matchResult.awayGoals}
            onChange={(e) => handleMatchResultChange("awayGoals", e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Submit Match Result
          </button>
        </div>
      </form>
    </div>
  );
}
