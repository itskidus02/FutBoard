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
import Spinner from "@/components/Spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CreateTableAndClub() {
  const [numTeams, setNumTeams] = useState(0);
  const [tableName, setTableName] = useState("");
  const [teamNames, setTeamNames] = useState([]);
  const [teamLogos, setTeamLogos] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({});
  const [isCreating, setIsCreating] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleNumTeamsChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 0) {
      setNumTeams(value);
      setTeamNames(new Array(value).fill(""));
      setTeamLogos(new Array(value).fill(null));
      setPreviewImages(new Array(value).fill(null));
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
    const file = e.target.files[0];
    const newTeamLogos = [...teamLogos];
    newTeamLogos[index] = file;
    setTeamLogos(newTeamLogos);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const newPreviewImages = [...previewImages];
        newPreviewImages[index] = reader.result;
        setPreviewImages(newPreviewImages);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
  };

  const handleClosePreview = () => {
    setSelectedImageIndex(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsCreating(true);

    if (!tableName) {
      toast.error("Table name is required");
      setIsCreating(false);
      return;
    }

    if (teamNames.some((name) => !name)) {
      toast.error("All team names are required");
      setIsCreating(false);
      return;
    }

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

      const clubs = teamNames.map((name, index) => ({
        name,
        logoUrl: "",
        logoFile: teamLogos[index],
      }));

      const uploadPromises = clubs.map(async (club, index) => {
        if (club.logoFile) {
          club.logoUrl = await storeImage(club.logoFile, index);
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

      toast.success("Table and clubs created successfully");
      setNumTeams(0);
      setTableName("");
      setTeamNames([]);
      setTeamLogos([]);
      setPreviewImages([]);
      navigate(`/manage-matches/${tableId}`);
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  const storeImage = (file, index) => {
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
          setUploadProgress((prevProgress) => ({
            ...prevProgress,
            [index]: progress,
          }));
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
      <ToastContainer />
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
              maxLength={10}
              minLength={3}
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
              min={2}
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
                minLength={3}
              />
              <div className="relative flex w-full max-w-sm flex-col gap-2">
                <input
                  id={`fileInput-${index}`}
                  type="file"
                  accept="image/*"
                  className="w-full max-w-md rounded-lg text-black font-poppins file:mr-4 file:cursor-pointer file:border-none file:bg-[#00684A] hover:file:bg-white file:px-4 file:py-2 file:font-semibold file:text-white hover:file:text-[#00684A]  file:font-poppins ring-2 ring-[#00684A] transition-all "
                  onChange={(e) => handleLogoChange(index, e)}
                  required
                />
                {previewImages[index] && (
                  <img
                    src={previewImages[index]}
                    alt={`Team ${index + 1} Logo Preview`}
                    className="mt-2 w-10 h-10 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => handleImageClick(index)}
                  />
                )}
                {uploadProgress[index] !== undefined && (
                  <div className="w-full mt-2">
                    <div
                      className="bg-[#00684A] h-1 rounded"
                      style={{ width: `${uploadProgress[index]}%` }}
                    />
                    <span className="text-sm text-center mt-1">{`${
                      Math.round(uploadProgress[index])
                    }%`}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <button
          type="submit"
          className={`self-end px-8 py-2 ${
            isCreating
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#00684A] hover:bg-white hover:text-[#00684A]"
          } ring-2 hover:ring-[#00684A] font-semibold font-poppins text-white rounded-lg uppercase hover:opacity-95 mt-4 transition-all`}
          disabled={isCreating}
        >
          {isCreating ? <Spinner /> : "Create Table"}
        </button>
      </form>
      {selectedImageIndex !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleClosePreview}
        >
          <img
            src={previewImages[selectedImageIndex]}
            alt="Large Preview"
            className="max-w-full max-h-full rounded-lg transition-transform transform scale-90 opacity-0 animate-open-modal"
          />
        </div>
      )}
    </main>
  );
}

// Add the animation styles in your CSS or Tailwind config:

