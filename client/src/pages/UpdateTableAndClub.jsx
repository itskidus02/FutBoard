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
import plus from "../assets/plus.svg"

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
          }).catch((error) => reject(error));
        }
      );
    });
  };

  return (
    <main className="p-3 max-w-6xl mx-auto">
    <h1 className="text-3xl flex ml-4 items-center gap-3 font-semibold text-center my-7">
      <div className="bg-[#00684A] rounded-lg h-14">.</div>
      <span className="lg:text-[28.125px] md:text-[20.125px] font-fraunces text-[#00684A] text-[20.125px]">
        Update {tableName}
      </span>
    </h1>
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex gap-3 flex-col lg:w-1/2 w-full">
          <span className="mt-4 font-poppins font-semibold lg:text-2xl">
            Table Name
          </span>
          <input
            type="text"
            placeholder="Table Name"
            className="border ring-2 ring-[#00684A] p-3 font-poppins font-light rounded-lg"
            value={tableName}
            onChange={handleTableNameChange}
            required
            maxLength={10}
            minLength={3}
          />
        </div>
        <div className="flex flex-col gap-3 lg:w-1/2 w-full">
          <span className="mt-4 lg:text-2xl font-poppins font-semibold">
            Number of Teams
          </span>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              placeholder="Number of Teams"
              className="border ring-2 ring-[#00684A] p-3 rounded-lg flex-grow"
              value={numTeams}
              disabled
              required
              min={2}

            />
            <button
              type="button"
              onClick={handleAddTeam}
              className="px-3 py-4 bg-[#00684A] rounded-lg  flex-shrink-0"
            >
              
              <img
              className="w-5 h-5"
              src={plus}
              />
            </button>

            {/* // if remove button is needed */}
            {/* <button
              type="button"
              onClick={handleAddTeam}
              className="px-3 py-4 bg-[#00684A] rounded-lg text-white  flex-shrink-0"
            >
              Add
            </button> */}
          </div>
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
minLength={3}
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
      {error && <p className="text-red-700 text-sm">{error}</p>}
      <button
        type="submit"
        className="self-end px-8 py-2 bg-[#00684A] ring-2 hover:ring-[#00684A] hover:bg-white font-semibold font-poppins text-white hover:text-[#00684A] rounded-lg uppercase hover:opacity-95 mt-4 transition-all"
      >
        Update Table
      </button>
    </form>
  </main>
  
  
  );
}
