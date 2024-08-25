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
  const [selectedClubNames, setSelectedClubNames] = useState({
    homeClubName: "",
    awayClubName: "",
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
    const selectedClub = clubs.find((club) => club._id === clubId);
    setSelectedClubs((prevState) => ({
      ...prevState,
      [type]: clubId,
    }));
    if (type === "homeClub") {
      setSelectedClubNames((prevState) => ({
        ...prevState,
        homeClubName: selectedClub ? selectedClub.name : "",
      }));
    } else if (type === "awayClub") {
      setSelectedClubNames((prevState) => ({
        ...prevState,
        awayClubName: selectedClub ? selectedClub.name : "",
      }));
    }
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
  const handleNextStep = () => {
    if (step === 1 && (!selectedClubs.homeClub || !selectedClubs.awayClub)) {
      toast.error("Please select both home and away clubs before proceeding.");
      return;
    }
    setStep(step + 1);
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


    if (!manOfMatch) {
      toast.error("There has to be a Player of the Match");
      return; // Prevent form submission if manOfMatch is not set
    }
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
                className="block font-poppins text-gray-700 text-sm font-medium mb-2"
              >
                Match Date:
              </label>
              <input
                type="date"
                id="matchDate"
                value={matchDate}
                onChange={handleMatchDateChange}
                className="block appearance-none w-full bg-white border border-gray-300 text-gray-900 py-3 px-4 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-[#00684A]"
                required
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex justify-between mb-6">
            {/* Home Club Section */}
            <div className="w-1/2 mr-2">
              <h2 className="text-lg font-bold mb-4 text-center bg-[#00684A] text-white py-2 rounded">
                {selectedClubNames.homeClubName}
              </h2>
              {homeScorers.map((scorer, index) => (
                <div key={index} className="mb-4">
                  {/* Goal Label */}
                  <label className="block font-medium text-lg font-poppins text-gray-700 mb-2">
                    Goal {index + 1}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Scorer"
                      value={scorer.scorer}
                      maxLength={10}
                      minLength={3}
                      onChange={(e) => {
                        const value = e.target.value.replace(
                          /[^a-zA-Z\s]/g,
                          ""
                        ); // Allows only letters and spaces
                        handleScorerChange(index, "scorer", value, "home");
                      }}
                      className="border border-gray-300 py-2 px-3 rounded focus:outline-none focus:ring-2 focus:ring-[#00684A]"
                    />

                    <input
                      type="text"
                      placeholder="Assistor"
                      value={scorer.assistor}
                      maxLength={10}
                      minLength={3}
                      onChange={(e) => {
                        const value = e.target.value.replace(
                          /[^a-zA-Z\s]/g,
                          ""
                        ); // Allows only letters and spaces
                        handleScorerChange(index, "assistor", value, "home");
                      }}
                      className="border border-gray-300 py-2 px-3 rounded focus:outline-none focus:ring-2 focus:ring-[#00684A]"
                    />

                    <input
                      type="number"
                      placeholder="min"
                      min={0}
                      max={120}
                      value={scorer.time}
                      onChange={(e) =>
                        handleScorerChange(
                          index,
                          "time",
                          e.target.value,
                          "home"
                        )
                      }
                      className="border border-gray-300 py-2 px-3 rounded focus:outline-none focus:ring-2 focus:ring-[#00684A]"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Away Club Section */}
            <div className="w-1/2 ml-2">
              <h2 className="text-lg font-bold mb-4 text-center bg-[#00684A] text-white py-2 rounded">
                {selectedClubNames.awayClubName}
              </h2>
              {awayScorers.map((scorer, index) => (
                <div key={index} className="mb-4">
                  {/* Goal Label */}
                  <label className="block text-lg font-poppins  font-medium text-gray-700 mb-2">
                    Goal {index + 1}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Scorer"
                      value={scorer.scorer}
                      maxLength={10}
                      minLength={3}
                      onChange={(e) => {
                        const value = e.target.value.replace(
                          /[^a-zA-Z\s]/g,
                          ""
                        ); // Allows only letters and spaces
                        handleScorerChange(index, "scorer", value, "away");
                      }}
                      className="border border-gray-300 py-2 px-3 rounded  focus:outline-none focus:ring-2 focus:ring-[#00684A]"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Assistor"
                      value={scorer.assistor}
                      maxLength={10}
                      minLength={3}
                      onChange={(e) => {
                        const value = e.target.value.replace(
                          /[^a-zA-Z\s]/g,
                          ""
                        ); // Allows only letters and spaces
                        handleScorerChange(index, "assistor", value, "away");
                      }}
                      className="border border-gray-300 py-2 px-3 rounded focus:outline-none focus:ring-2 focus:ring-[#00684A]"
                    />

                    <input
                      type="number"
                      placeholder="min"
                      min={0}
                      max={120}
                      value={scorer.time}
                      onChange={(e) =>
                        handleScorerChange(
                          index,
                          "time",
                          e.target.value,
                          "away"
                        )
                      }
                      className="border border-gray-300 py-2 px-3 rounded focus:outline-none focus:ring-2 focus:ring-[#00684A]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="mb-6 mt-6 gap-4 flex flex-col items-center justify-center">
            <label
              htmlFor="manOfMatch"
              className=" text-[#00684A] uppercase text-2xl font-poppins font-medium mb-2"
            >
              Player of the Match
            </label>
            <input
              type="text"
              id="manOfMatch"
              maxLength={10}
              minLength={3}
              value={manOfMatch}
              onChange={handleManofMatch}
              className=" appearance-none w-1/3 items-center bg-white border border-gray-300 text-gray-900 py-3 px-4 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-[#00684A]"
            />
          </div>
          
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl ring mx-auto p-4 ">
      {table && (
        <h1 className="text-2xl flex gap-4 text-[#00684A] font-fraunces sm:text-3xl font-semibold mb-6 sm:mb-8">
          Create matches under
          <span className="ring-[#00684A] ring-2 hover:text-[#00684A] hover:bg-white bg-[#00684A] text-white font-fraunces rounded-lg py-1 px-11 text-xl transition-all duration-300">
            {table.name}
          </span>
        </h1>
      )}
      <ToastContainer />
      {/*  */}
      <div className="mb-8 flex pointer-events-none justify-between">
        {["1", "2", "3"].map((item, index) => (
          <div
            key={index}
            className={`flex items-center ${
              index < 2 ? "" : ""
            } cursor-pointer`}
            onClick={() => setStep(index + 1)}
          >
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                step === index + 1
                  ? "bg-[#00684A] text-white"
                  : "bg-gray-300 text-gray-800"
              }`}
            >
              <h1 className="text-2xl font-bold font-fraunces">{item}</h1>
            </div>
            {index < 2 && (
              <div
                className={`w-[18rem] h-[2px] ml-6 transition-all duration-500 ease-in-out ${
                  step > index + 1 ? "bg-[#00684A]" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleMatchSubmit}>
        {renderStepContent()}

        <div className="flex justify-between">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="bg-[#EDE4E4] text-gray-700 py-1 px-11 text-xl font-medium font-poppins rounded-lg"
            >
              Back
            </button>
          )}
          {step < 3 && (
            <button
              type="button"
              onClick={() => {
                if (step === 1) {
                  if (!selectedClubs.homeClub || !selectedClubs.awayClub) {
                    toast.error(
                      "Please select both home and away clubs before proceeding."
                    );
                  } else if (!matchDate) {
                    toast.error(
                      "Please select a match date before proceeding."
                    );
                  } else if (
                    matchResult.homeGoals === 0 &&
                    matchResult.awayGoals === 0
                  ) {
                    setStep(3); // Skip to the man of the match step
                  } else {
                    setStep(2); // Proceed to the second step
                  }
                } else if (step === 2) {
                  const allScorersFilled =
                    homeScorers.every(
                      (scorer) =>
                        scorer.scorer && scorer.assistor && scorer.time
                    ) &&
                    awayScorers.every(
                      (scorer) =>
                        scorer.scorer && scorer.assistor && scorer.time
                    );

                  if (!allScorersFilled) {
                    toast.error(
                      "Please fill out the scorer, assistor, and time for each goal."
                    );
                  } else {
                    setStep(3); // Proceed to the man of the match step
                  }
                } else {
                  setStep(step + 1);
                }
              }}
              className="bg-[#00684A] text-white py-1 px-11 text-xl font-poppins rounded-lg"
            >
              Next
            </button>
          )}
          {step === 3 && (
            <button
              type="submit"
              className="bg-[#00684A] text-white py-1 px-11 text-xl font-poppins rounded-lg"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
