import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ManageMatches() {
  const { tableId } = useParams();
  const [table, setTable] = useState(null);
  const [clubs, setClubs] = useState([]);
  const [selectedClubs, setSelectedClubs] = useState({
    homeClub: "",
    awayClub: "",
  });
  const [matchResult, setMatchResult] = useState({
    homeGoals: 0,
    awayGoals: 0,
  });
  const [matchDate, setMatchDate] = useState("");
  const [homeScorers, setHomeScorers] = useState([{ scorer: "", assistor: "" }]);
  const [awayScorers, setAwayScorers] = useState([{ scorer: "", assistor: "" }]);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchTableDetails = async () => {
      try {
        const response = await fetch(`/api/table/get/${tableId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch table details");
        }
        const tableData = await response.json();
        setTable(tableData);
        setClubs(tableData.clubs.map((c) => c.clubId));
      } catch (error) {
        setError("Error fetching table details: " + error.message);
      }
    };

    fetchTableDetails();
  }, [tableId]);

  const handleClubChange = (type, clubId) => {
    setSelectedClubs((prevState) => ({
      ...prevState,
      [type]: clubId,
    }));
  };

  const handleMatchResultChange = (type, value) => {
    setMatchResult((prevState) => ({
      ...prevState,
      [type]: parseInt(value) || 0,
    }));
  };

  const handleMatchDateChange = (e) => {
    setMatchDate(e.target.value);
  };

  const handleScorerChange = (index, type, value, team) => {
    if (team === "home") {
      setHomeScorers((prevScorers) => {
        const updatedScorers = [...prevScorers];
        updatedScorers[index] = { ...updatedScorers[index], [type]: value };
        return updatedScorers;
      });
    } else if (team === "away") {
      setAwayScorers((prevScorers) => {
        const updatedScorers = [...prevScorers];
        updatedScorers[index] = { ...updatedScorers[index], [type]: value };
        return updatedScorers;
      });
    }
  };

  useEffect(() => {
    setHomeScorers(Array(matchResult.homeGoals).fill({ scorer: "", assistor: "" }));
  }, [matchResult.homeGoals]);

  useEffect(() => {
    setAwayScorers(Array(matchResult.awayGoals).fill({ scorer: "", assistor: "" }));
  }, [matchResult.awayGoals]);

  const handleMatchSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSaving(true);

    try {
      const matchData = {
        tableId,
        homeClubId: selectedClubs.homeClub,
        awayClubId: selectedClubs.awayClub,
        homeGoals: matchResult.homeGoals,
        awayGoals: matchResult.awayGoals,
        matchDate: matchDate,
        homeScorers: homeScorers,
        awayScorers: awayScorers,
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
        throw new Error(
          responseBody.message || "Failed to update match result"
        );
      }

      setSelectedClubs({
        homeClub: "",
        awayClub: "",
      });
      setMatchResult({
        homeGoals: 0,
        awayGoals: 0,
      });
      setMatchDate("");
      setHomeScorers([{ scorer: "", assistor: "" }]);
      setAwayScorers([{ scorer: "", assistor: "" }]);
      toast.success("Match result updated successfully!");
    } catch (error) {
      setError("Error updating match result: " + error.message);
      toast.error("Error updating match result: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredHomeClubs = clubs.filter(
    (club) => club._id !== selectedClubs.awayClub
  );
  const filteredAwayClubs = clubs.filter(
    (club) => club._id !== selectedClubs.homeClub
  );

  return (
    <div className="w-full sm:w-3/4 mx-auto p-6 my-7">
      {table && (
        <h1 className="text-2xl text-[#00684A] font-fraunces sm:text-3xl font-semibold text-center mb-6 sm:mb-8">
          Create matches under {table.name}
        </h1>
      )}
      <form
        onSubmit={handleMatchSubmit}
        className="mt-8 w-full sm:w-3/4 lg:w-2/4 mx-auto ring-2 ring-[#00684A] rounded px-4 sm:px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4 flex flex-col sm:flex-row justify-between">
          <div className="w-full sm:w-1/2 sm:pr-2 mb-4 sm:mb-0">
            <div className="flex flex-col sm:flex-row items-center">
              <select
                id="homeClub"
                value={selectedClubs.homeClub}
                onChange={(e) => handleClubChange("homeClub", e.target.value)}
                className="block appearance-none w-full sm:w-3/4 ring-2 ring-[#00684A] font-poppins border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 mb-4 sm:mb-0"
              >
                <option value="">Select Home Club</option>
                {filteredHomeClubs.map((club) => (
                  <option key={club._id} value={club._id}>
                    {club.name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                id="homeGoals"
                min={0}
                value={matchResult.homeGoals}
                onChange={(e) =>
                  handleMatchResultChange("homeGoals", e.target.value)
                }
                className="appearance-none block ring-2 ring-[#00684A] font-poppins w-full sm:w-1/4 ml-0 sm:ml-2 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              />
              <h1 className="text-center pl-3 font-poppins font-bold">Vs</h1>
            </div>
          </div>
          <div className="w-full sm:w-1/2 sm:pl-2">
            <div className="flex flex-col gap-3 sm:flex-row items-center">
              <select
                id="awayClub"
                value={selectedClubs.awayClub}
                onChange={(e) => handleClubChange("awayClub", e.target.value)}
                className="block appearance-none w-full sm:w-3/4 ring-2 ring-[#00684A] font-poppins py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              >
                <option value="">Select Away Club</option>
                {filteredAwayClubs.map((club) => (
                  <option key={club._id} value={club._id}>
                    {club.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                id="awayGoals"
                value={matchResult.awayGoals}
                min={0}
                onChange={(e) =>
                  handleMatchResultChange("awayGoals", e.target.value)
                }
                className="appearance-none block w-full sm:w-1/4 ml-0 sm:ml-2 ring-2 ring-[#00684A] font-poppins rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 mb-4 sm:mb-0"
              />
            </div>
          </div>
        </div>

        {/* Home Scorers and Assistors */}
        {homeScorers.map((scorer, index) => (
          <div key={index} className="mb-4">
            <h2 className="font-bold mb-2">Home Goal {index + 1}</h2>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                placeholder="Scorer"
                value={scorer.scorer}
                onChange={(e) =>
                  handleScorerChange(index, "scorer", e.target.value, "home")
                }
                className="block w-full ring-2 ring-[#00684A] font-poppins rounded py-2 px-3 focus:outline-none focus:bg-white focus:border-gray-500"
              />
              <input
                type="text"
                placeholder="Assistor"
                value={scorer.assistor}
                onChange={(e) =>
                  handleScorerChange(index, "assistor", e.target.value, "home")
                }
                className="block w-full ring-2 ring-[#00684A] font-poppins rounded py-2 px-3 focus:outline-none focus:bg-white focus:border-gray-500"
              />
            </div>
          </div>
        ))}

        {/* Away Scorers and Assistors */}
        {awayScorers.map((scorer, index) => (
          <div key={index} className="mb-4">
            <h2 className="font-bold mb-2">Away Goal {index + 1}</h2>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                placeholder="Scorer"
                value={scorer.scorer}
                onChange={(e) =>
                  handleScorerChange(index, "scorer", e.target.value, "away")
                }
                className="block w-full ring-2 ring-[#00684A] font-poppins rounded py-2 px-3 focus:outline-none focus:bg-white focus:border-gray-500"
              />
              <input
                type="text"
                placeholder="Assistor"
                value={scorer.assistor}
                onChange={(e) =>
                  handleScorerChange(index, "assistor", e.target.value, "away")
                }
                className="block w-full ring-2 ring-[#00684A] font-poppins rounded py-2 px-3 focus:outline-none focus:bg-white focus:border-gray-500"
              />
            </div>
          </div>
        ))}

        <div className="mb-4 flex flex-col items-center">
          <label
            className="block text-gray-700 font-poppins text-sm font-bold mb-2"
            htmlFor="matchDate"
          >
            Pick a match Date
          </label>
          <input
            type="date"
            id="matchDate"
            value={matchDate}
            onChange={handleMatchDateChange}
            className="appearance-none block w-1/2 bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            required
          />
        </div>
        {error && <p className="text-red-500 text-xs italic">{error}</p>}

        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className={`bg-[#00684A] hover:text-[#00684A] hover:bg-white hover:ring-2 hover:ring-[#00684A] transition-all text-white font-semibold py-2 px-4 rounded-lg ${
              isSaving ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSaving ? "Saving..." : "Save Match Result"}
          </button>
        </div>
      </form>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}
