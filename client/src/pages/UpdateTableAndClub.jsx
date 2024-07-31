import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

export default function UpdateTableAndClub() {
  const [numTeams, setNumTeams] = useState(0);
  const [tableName, setTableName] = useState("");
  const [teamNames, setTeamNames] = useState([]);
  const [teamLogos, setTeamLogos] = useState([]);
  const [existingTeamLogos, setExistingTeamLogos] = useState([]);
  const [clubIds, setClubIds] = useState([]);
  const [error, setError] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { tableId } = useParams();

  useEffect(() => {
    // Fetch the existing table and clubs data
    const fetchTableData = async () => {
      try {
        const response = await fetch(`/api/table/get/${tableId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch table data");
        }
        const tableData = await response.json();
        setTableName(tableData.name);
        setNumTeams(tableData.clubs.length);
        setTeamNames(tableData.clubs.map((club) => club.clubId.name));
        setExistingTeamLogos(tableData.clubs.map((club) => club.clubId.logoUrl));
        setTeamLogos(new Array(tableData.clubs.length).fill(null)); // Initialize logos as null
        setClubIds(tableData.clubs.map((club) => club.clubId._id)); // Store club IDs
      } catch (error) {
        console.error("Error fetching table data:", error);
        setError("Failed to load table data");
      }
    };
    fetchTableData();
  }, [tableId]);

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

  const handleAddTeam = () => {
    setTeamNames([...teamNames, ""]);
    setTeamLogos([...teamLogos, null]);
    setExistingTeamLogos([...existingTeamLogos, null]);
    setNumTeams(numTeams + 1);
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

    try {
      // Update the table first
      const tableRes = await fetch(`/api/table/update/${tableId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: tableName, userRef: currentUser.username, userId: currentUser._id }),
      });

      if (!tableRes.ok) {
        throw new Error("Failed to update table");
      }

      // Update the clubs and add them to the table
      const clubs = teamNames.map((name, index) => ({
        clubId: clubIds[index],
        name,
        logoUrl: existingTeamLogos[index], // Keep existing logo URL if no new logo is provided
        logoFile: teamLogos[index], // Pass the logo file
      }));

      const uploadPromises = clubs.map(async (club) => {
        if (club.logoFile) {
          club.logoUrl = await storeImage(club.logoFile);
        }
        return club;
      });

      const resolvedClubs = await Promise.all(uploadPromises);

      const clubsRes = await fetch("/api/table/update-clubs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tableId, clubs: resolvedClubs }),
      });

      if (!clubsRes.ok) {
        throw new Error("Failed to update clubs");
      }

      const updatedTable = await clubsRes.json();
      console.log("Table and clubs updated successfully:", updatedTable);

      navigate(`/manage-matches/${tableId}`);
    } catch (error) {
      setError(error.message);
      console.error("Error updating table and clubs:", error);
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
        Update Table and Clubs
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
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
            disabled
            required
          />
          {teamNames.map((teamName, index) => (
            <div key={index} className="flex gap-4 items-center">
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
          <button
            type="button"
            onClick={handleAddTeam}
            className="p-2 bg-green-500 text-white rounded-lg"
          >
            Add Team
          </button>
        </div>
        {error && <p className="text-red-700 text-sm">{error}</p>}
        <button
          type="submit"
          className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95"
        >
          Update Table
        </button>
      </form>
    </main>
  );
}
