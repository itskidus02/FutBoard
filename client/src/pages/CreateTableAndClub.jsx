import { useState } from "react";

export default function CreateTableAndClub() {
  const [numTeams, setNumTeams] = useState(0);
  const [tableName, setTableName] = useState("");
  const [teamNames, setTeamNames] = useState([]);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    userId: "",
    clubs: [
      {
        clubId: "",
        played: 0,
        won: 0,
        lost: 0,
        drawn: 0,
        goalsScored: 0,
        goalsConceded: 0,
        goalDifference: 0,
        points: 0,
      },
    ],
  });

  const handleNumTeamsChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 0) {
      setNumTeams(value);
      setTeamNames(new Array(value).fill(""));
    }
  };

  const handleTableNameChange = (e) => {
    setFormData({
      ...formData,
      name: e.target.value,
    });
  };

  const handleTeamNameChange = (index, e) => {
    const newTeamNames = [...teamNames];
    newTeamNames[index] = e.target.value;
    setTeamNames(newTeamNames);

    const newClubs = [...formData.clubs];
    newClubs[index] = {
      ...newClubs[index],
      clubId: e.target.value, // Assuming clubId should be set to the team name
    };

    setFormData({
      ...formData,
      clubs: newClubs,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name) {
      setError("Table name is required");
      return;
    }

    if (teamNames.some((name) => !name)) {
      setError("All team names are required");
      return;
    }

    setError("");

    try {
      const res = await fetch("/api/table/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to create table");
      }

      // Handle response as needed
      const responseData = await res.json();
      console.log("Table created successfully:", responseData);

      // Reset form
      setNumTeams(0);
      setTableName("");
      setTeamNames([]);
      setFormData({
        name: "",
        userId: "",
        clubs: [
          {
            clubId: "",
            played: 0,
            won: 0,
            lost: 0,
            drawn: 0,
            goalsScored: 0,
            goalsConceded: 0,
            goalDifference: 0,
            points: 0,
          },
        ],
      });
    } catch (error) {
      setError(error.message);
      console.error("Error creating table:", error);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create Table and Clubs
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Table Name"
            className="border p-3 rounded-lg"
            value={formData.name}
            onChange={handleTableNameChange}
            required
          />
          <input
            type="number"
            placeholder="Number of Teams"
            className="border p-3 rounded-lg"
            value={numTeams}
            onChange={handleNumTeamsChange}
            required
          />
          {teamNames.map((teamName, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Team ${index + 1} Name`}
              className="border p-3 rounded-lg"
              value={teamName}
              onChange={(e) => handleTeamNameChange(index, e)}
              required
            />
          ))}
        </div>
        {error && <p className="text-red-700 text-sm">{error}</p>}
        <button
          type="submit"
          className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95"
        >
          Create Table
        </button>
      </form>
    </main>
  );
}
