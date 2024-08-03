import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

export default function CreateTableAndClub() {
  const [numTeams, setNumTeams] = useState(0);
  const [tableName, setTableName] = useState("");
  const [teamNames, setTeamNames] = useState([]);
  const [teamLogos, setTeamLogos] = useState([]); // State for team logos
  const [error, setError] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleNumTeamsChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 0) {
      setNumTeams(value);
      setTeamNames(new Array(value).fill(""));
      setTeamLogos(new Array(value).fill(null)); // Initialize logos as null
    }
  };

  const handleTableNameChange = (e) => {
    setTableName(e.target.value);
  };

  const handleTeamNameChange = (index, e) => {
    const newTeamNames = [...teamNames];
    newTeamNames[index] = e.target.value;
    setTeamNames(newTeamNames);
  };

  const handleLogoChange = (index, e) => {
    const newTeamLogos = [...teamLogos];
    newTeamLogos[index] = e.target.files[0];
    setTeamLogos(newTeamLogos);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tableName) {
      setError("Table name is required");
      return;
    }

    if (teamNames.some((name) => !name)) {
      setError("All team names are required");
      return;
    }

    setError("");

    // Create the table first
    try {
      const tableRes = await fetch("/api/table/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: tableName, userRef: currentUser.username, userId: currentUser._id }),
      });

      if (!tableRes.ok) {
        throw new Error("Failed to create table");
      }

      const tableData = await tableRes.json();
      const tableId = tableData._id;

      // Create the clubs and add them to the table
      const clubs = teamNames.map((name, index) => ({
        name,
        logoUrl: "", // Initialize logoUrl as empty string
        logoFile: teamLogos[index], // Pass the logo file
      }));
      
      // Assuming you have a function to handle image uploads similar to storeImage in CreateListing.jsx
      const uploadPromises = clubs.map(async (club) => {
        if (club.logoFile) {
          club.logoUrl = await storeImage(club.logoFile);
        }
        return club;
      });

      const resolvedClubs = await Promise.all(uploadPromises);

      const clubsRes = await fetch("/api/table/add-clubs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tableId, clubs: resolvedClubs }),
      });

      if (!clubsRes.ok) {
        throw new Error("Failed to add clubs to the table");
      }

      const updatedTable = await clubsRes.json();
      console.log("Table and clubs created successfully:", updatedTable);

      // Reset form
      setNumTeams(0);
      setTableName("");
      setTeamNames([]);
      setTeamLogos([]);
      navigate(`/manage-matches/${tableId}`);
    } catch (error) {
      setError(error.message);
      console.error("Error creating table and clubs:", error);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create Table and Clubs
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex justify-between gap-4">
          <div className="flex flex-col gap-4 w-2/4">
            <input
              type="text"
              placeholder="Table Name"
              className="border p-3 rounded-lg"
              value={tableName}
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
              <div key={index} className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder={`Team ${index + 1} Name`}
                  className="border p-3 rounded-lg"
                  value={teamName}
                  onChange={(e) => handleTeamNameChange(index, e)}
                  required
                />
                <input
                  type="file"
                  accept="image/*"
                  className="border p-3 rounded-lg"
                  onChange={(e) => handleLogoChange(index, e)}
                />
              </div>
            ))}
          </div>
          <div className="flex items-center">
            <button
              type="submit"
              className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95"
            >
              Create Table
            </button>
          </div>
        </div>
        {error && <p className="text-red-700 text-sm">{error}</p>}
      </form>
    </main>
  );
  
}
