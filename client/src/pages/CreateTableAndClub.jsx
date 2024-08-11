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
        body: JSON.stringify({
          name: tableName,
          userRef: currentUser.username,
          userId: currentUser._id,
        }),
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
    <main className="p-3 max-w-6xl mx-auto">
    <h1 className="text-3xl flex ml-4 items-center gap-3 font-semibold text-center my-7">
      <div className="bg-[#00684A] rounded-lg h-14">.</div>
      <span className="lg:text-[28.125px] md:text-[20.125px] font-fraunces text-[#00684A] text-[20.125px]">
        Create Table and Clubs
      </span>
    </h1>
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex gap-4">
        <div className="flex gap-3 flex-col w-1/2">
          <span className="mt-4 font-poppins font-semibold lg:text-2xl">
            Table Name
          </span>
          <input
  type="text"
  placeholder="Table Name"
  className="border ring-2 ring-[#00684A] p-3 font-poppins font-light rounded-lg"
  value={tableName}
  onChange={handleTableNameChange}
  maxLength={9}
  required
/>

        </div>
        <div className="flex flex-col gap-3 w-1/2">
          <span className="mt-4 lg:text-2xl font-poppins font-semibold">
            Number of Teams
          </span>
          <input
            type="number"
            placeholder="Number of Teams"
            className="border ring-2 ring-[#00684A] p-3 rounded-lg"
            value={numTeams}
            onChange={handleNumTeamsChange}
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teamNames.map((teamName, index) => (
          <div
            key={index}
            className="flex flex-col bg-white ring-1 ring-gray-100 gap-2 items-center border p-3 rounded-lg"
          >
            <input
              type="text"
              placeholder={`Team ${index + 1} Name`}
              className="border p-3 font-poppins ring-2 ring-[#00684A] font-light rounded-lg w-full"
              value={teamName}
              onChange={(e) => handleTeamNameChange(index, e)}
              required
              maxLength={9}

            />
  
            <div className="relative flex w-full max-w-sm flex-col gap-1">
             
              <input
                id={`fileInput-${index}`}
                type="file"
                accept="image/*"
                className="w-full max-w-md rounded-lg text-black font-poppins file:mr-4 file:cursor-pointer file:border-none file:bg-[#00684A] hover:file:bg-white file:px-4 file:py-2 file:font-semibold file:text-white hover:file:text-[#00684A]  file:font-poppins ring-2 ring-[#00684A] transition-all "
                onChange={(e) => handleLogoChange(index, e)}
              />
            </div>
          </div>
        ))}
      </div>
      <button
        type="submit"
        className="self-end px-8 py-2 bg-[#00684A] ring-2 hover:ring-[#00684A] hover:bg-white font-semibold font-poppins text-white hover:text-[#00684A] rounded-lg uppercase hover:opacity-95 mt-4 transition-all"
      >
        Create Table
      </button>
      {error && <p className="text-red-700 text-sm">{error}</p>}
    </form>
  </main>
  
  );
}
