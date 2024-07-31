import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DisplayTable from "./DisplayTable";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function ManageMatches() {
  const { tableId } = useParams();
  const [clubs, setClubs] = useState([]);
  const [selectedClubs, setSelectedClubs] = useState({ homeClub: "", awayClub: "" });
  const [matchResult, setMatchResult] = useState({ homeGoals: 0, awayGoals: 0 });
  const [matchDate, setMatchDate] = useState("");
  const [error, setError] = useState("");

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
        setError("Error fetching clubs: " + error.message);
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

  const handleMatchDateChange = (e) => {
    setMatchDate(e.target.value);
  };

  const handleMatchSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const matchData = {
        tableId,
        homeClubId: selectedClubs.homeClub,
        awayClubId: selectedClubs.awayClub,
        homeGoals: matchResult.homeGoals,
        awayGoals: matchResult.awayGoals,
        matchDate: matchDate
      };

      const response = await fetch("/api/table/update-match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(matchData),
      });

      if (!response.ok) {
        const responseBody = await response.json();
        throw new Error(responseBody.message || "Failed to update match result");
      }

      const updatedTable = await response.json();
      toast.success("Match result updated successfully!");
    } catch (error) {
      setError("Error updating match result: " + error.message);
      toast.error("Error updating match result: " + error.message);
    }
  };

  const filteredHomeClubs = clubs.filter(club => club._id !== selectedClubs.awayClub);
  const filteredAwayClubs = clubs.filter(club => club._id !== selectedClubs.homeClub);

  return (
    <div className="w-3/4 mx-auto p-6 my-7">
      <h1 className="text-3xl font-semibold text-center mb-8">Manage Matches</h1>
      <DisplayTable />
      <form onSubmit={handleMatchSubmit} className="mt-8 w-2/4 mx-auto ring-2 ring-blue-600 rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4 flex justify-between">
          <div className="w-1/2 pr-2">
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
              {filteredHomeClubs.map(club => (
                <option key={club._id} value={club._id}>
                  {club.name}
                </option>
              ))}
            </select>
          </div>
          <div className="w-1/2 pl-2">
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
              {filteredAwayClubs.map(club => (
                <option key={club._id} value={club._id}>
                  {club.name}
                </option>
              ))}
            </select>
          </div>
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
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="awayGoals">
            Away Goals
          </label>
          <input
            type="number"
            id="awayGoals"
            value={matchResult.awayGoals}
            onChange={(e) => handleMatchResultChange("awayGoals", e.target.value)}
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="matchDate">
            Match Date
          </label>
          <input
            type="date"
            id="matchDate"
            value={matchDate}
            onChange={handleMatchDateChange}
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          />
        </div>
        {error && <p className="text-red-500 text-xs italic">{error}</p>}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Save Match Result
          </button>
        </div>
      </form>
      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
}
