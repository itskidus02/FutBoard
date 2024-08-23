import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ManageMatches() {
  const { tableId } = useParams();
  const [table, setTable] = useState(null);
  const [clubs, setClubs] = useState([]);
  const [manOfMatch, setManOfMatch] = useState("");

  const [selectedClubs, setSelectedClubs] = useState({
    homeClub: "",
    awayClub: "",
  });
  const [matchResult, setMatchResult] = useState({
    homeGoals: 0,
    awayGoals: 0,
  });
  const [matchDate, setMatchDate] = useState("");
  const [homeScorers, setHomeScorers] = useState([
    { scorer: "", assistor: "", time: "" },
  ]);
  const [awayScorers, setAwayScorers] = useState([
    { scorer: "", assistor: "", time: "" },
  ]);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [step, setStep] = useState(1); // Step state

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

  const handleManofMatch = (e) => {
    setManOfMatch(e.target.value);
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
    setHomeScorers(
      Array(matchResult.homeGoals).fill({ scorer: "", assistor: "", time: "" })
    );
  }, [matchResult.homeGoals]);

  useEffect(() => {
    setAwayScorers(
      Array(matchResult.awayGoals).fill({ scorer: "", assistor: "", time: "" })
    );
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
        manOfMatch: manOfMatch,
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
      setManOfMatch("");
      setHomeScorers([{ scorer: "", assistor: "", time: "" }]);
      setAwayScorers([{ scorer: "", assistor: "", time: "" }]);
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

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
              <div className="w-full sm:w-1/2">
                <div className="flex flex-col sm:flex-row items-center">
                  <select
                    id="homeClub"
                    value={selectedClubs.homeClub}
                    onChange={(e) =>
                      handleClubChange("homeClub", e.target.value)
                    }
                    className="block appearance-none w-full sm:w-3/4 bg-white border border-gray-300 text-gray-900 py-3 px-4 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-[#00684A] mb-4 sm:mb-0"
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
                    className="appearance-none block w-full sm:w-1/4 bg-white border border-gray-300 text-gray-900 py-3 px-4 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-[#00684A] ml-0 sm:ml-4"
                  />
                </div>
              </div>
              <h1 className="text-center text-xl font-bold sm:my-auto">Vs</h1>
              <div className="w-full sm:w-1/2">
                <div className="flex flex-col sm:flex-row items-center">
                  <select
                    id="awayClub"
                    value={selectedClubs.awayClub}
                    onChange={(e) =>
                      handleClubChange("awayClub", e.target.value)
                    }
                    className="block appearance-none w-full sm:w-3/4 bg-white border border-gray-300 text-gray-900 py-3 px-4 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-[#00684A]"
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
                    className="appearance-none block w-full sm:w-1/4 bg-white border border-gray-300 text-gray-900 py-3 px-4 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-[#00684A] ml-0 sm:ml-4"
                  />
                </div>
              </div>
            </div>
            <div className="mb-6">
              <label
                htmlFor="matchDate"
                className="block text-gray-700 text-sm font-medium mb-2"
              >
                Match Date:
              </label>
              <input
                type="date"
                id="matchDate"
                value={matchDate}
                onChange={handleMatchDateChange}
                className="block appearance-none w-full bg-white border border-gray-300 text-gray-900 py-3 px-4 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-[#00684A]"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <div className="mt-4">
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2 text-[#00684A] text-center">
                  Home Team Goal Details:
                </h2>
                {homeScorers.map((scorer, index) => (
                  <div key={index} className="mb-4">
                    <input
                      type="text"
                      placeholder="Scorer Name"
                      value={scorer.scorer}
                      onChange={(e) =>
                        handleScorerChange(
                          index,
                          "scorer",
                          e.target.value,
                          "home"
                        )
                      }
                      className="block appearance-none w-full bg-white border border-gray-300 text-gray-900 py-3 px-4 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-[#00684A] mb-2"
                    />
                    <input
                      type="text"
                      placeholder="Assistor Name"
                      value={scorer.assistor}
                      onChange={(e) =>
                        handleScorerChange(
                          index,
                          "assistor",
                          e.target.value,
                          "home"
                        )
                      }
                      className="block appearance-none w-full bg-white border border-gray-300 text-gray-900 py-3 px-4 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-[#00684A] mb-2"
                    />
                    <input
                      type="text"
                      placeholder="Time (in minutes)"
                      value={scorer.time}
                      onChange={(e) =>
                        handleScorerChange(
                          index,
                          "time",
                          e.target.value,
                          "home"
                        )
                      }
                      className="block appearance-none w-full bg-white border border-gray-300 text-gray-900 py-3 px-4 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-[#00684A]"
                    />
                  </div>
                ))}
              </div>
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2 text-[#00684A] text-center">
                  Away Team Goal Details:
                </h2>
                {awayScorers.map((scorer, index) => (
                  <div key={index} className="mb-4">
                    <input
                      type="text"
                      placeholder="Scorer Name"
                      value={scorer.scorer}
                      onChange={(e) =>
                        handleScorerChange(
                          index,
                          "scorer",
                          e.target.value,
                          "away"
                        )
                      }
                      className="block appearance-none w-full bg-white border border-gray-300 text-gray-900 py-3 px-4 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-[#00684A] mb-2"
                    />
                    <input
                      type="text"
                      placeholder="Assistor Name"
                      value={scorer.assistor}
                      onChange={(e) =>
                        handleScorerChange(
                          index,
                          "assistor",
                          e.target.value,
                          "away"
                        )
                      }
                      className="block appearance-none w-full bg-white border border-gray-300 text-gray-900 py-3 px-4 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-[#00684A] mb-2"
                    />
                    <input
                      type="text"
                      placeholder="Time (in minutes)"
                      value={scorer.time}
                      onChange={(e) =>
                        handleScorerChange(
                          index,
                          "time",
                          e.target.value,
                          "away"
                        )
                      }
                      className="block appearance-none w-full bg-white border border-gray-300 text-gray-900 py-3 px-4 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-[#00684A]"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <div className="mb-6">
              <label
                htmlFor="manOfMatch"
                className="block text-gray-700 text-sm font-medium mb-2"
              >
                Man of the Match:
              </label>
              <input
                type="text"
                id="manOfMatch"
                value={manOfMatch}
                onChange={handleManofMatch}
                placeholder="Enter Man of the Match"
                className="block appearance-none w-full bg-white border border-gray-300 text-gray-900 py-3 px-4 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-[#00684A]"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-8 mt-8">
      <ToastContainer />
      <h1 className="text-2xl font-bold text-center text-[#00684A] mb-8">
        Manage Match Details
      </h1>
      <form onSubmit={handleMatchSubmit} className="space-y-8">
        {renderStepContent()}
        <div className="flex justify-between mt-8">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg"
            >
              Previous
            </button>
          )}
          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="bg-[#00684A] hover:bg-[#004c35] text-white font-semibold py-2 px-4 rounded-lg"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSaving}
              className={`${
                isSaving ? "bg-gray-400" : "bg-[#00684A] hover:bg-[#004c35]"
              } text-white font-semibold py-2 px-4 rounded-lg`}
            >
              {isSaving ? "Saving..." : "Submit"}
            </button>
          )}
        </div>
      </form>
      {error && (
        <div className="text-red-500 mt-4">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
