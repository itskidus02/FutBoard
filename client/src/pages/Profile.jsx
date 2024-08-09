// Profile.jsx

import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOut,
} from "../redux/user/userSlice";
import { Link } from "react-router-dom";
import whistle from "../assets/whistle.svg"
import pen from "../assets/pen.svg"

export default function Profile() {
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [userTables, setUserTables] = useState([]);
  const [deleteError, setDeleteError] = useState("");
  const [imageSize, setImageSize] = useState(100); // Initial size percentage

  const { currentUser, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);

  useEffect(() => {
    fetchUserTables();
  }, [currentUser]);

  const fetchUserTables = async () => {
    try {
      const res = await fetch(`/api/table/user/${currentUser._id}`);
      const data = await res.json();
      setUserTables(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileUpload = async (image) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
      },
      (error) => {
        setImageError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, profilePicture: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  };

  const handleDeleteAccount = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/signout");
      dispatch(signOut());
    } catch (error) {
      console.log(error);
    }
  };

  const handleTableDelete = async (tableId) => {
    setDeleteError(""); // Clear previous error messages
    if (window.confirm("Are you sure you want to delete this table?")) {
      try {
        const res = await fetch(`/api/table/delete/${tableId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to delete table");
        }
        // Remove deleted table from state
        setUserTables(userTables.filter((table) => table._id !== tableId));
      } catch (error) {
        setDeleteError(error.message);
      }
    }
  };

  return (
    <div className="bg-white px-4 lg:px-6 py-2.5">
      <div className="flex flex-col ring lg:flex-row justify-center items-start mx-auto max-w-screen-xl">
        <div className="w-full lg:w-1/3 flex flex-col items-center">
          <input
            type="file"
            ref={fileRef}
            hidden
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
          <img
            src={formData.profilePicture || currentUser.profilePicture}
            alt="profile"
            className="cursor-pointer w-[250px] rounded-full object-cover mb-4"
            onClick={() => fileRef.current.click()}
          />
          <h2>Joined date</h2>
          <p className="text-sm text-center">
            {imageError ? (
              <span className="text-red-700">
                Error uploading image (file size must be less than 2 MB)
              </span>
            ) : imagePercent > 0 && imagePercent < 100 ? (
              <span className="text-slate-700">{`Uploading: ${imagePercent} %`}</span>
            ) : imagePercent === 100 ? (
              <span className="text-green-700">
                Image uploaded successfully
              </span>
            ) : (
              ""
            )}
          </p>
        </div>
  
        <form
          onSubmit={handleSubmit}
          className="w-full lg:w-1/3 flex flex-col gap-4"
        >
          <input
            defaultValue={currentUser.username}
            type="text"
            id="username"
            placeholder="Username"
            className="bg-slate-100 rounded-lg p-3"
            onChange={handleChange}
          />
          <input
            defaultValue={currentUser.email}
            type="email"
            id="email"
            placeholder="Email"
            className="bg-slate-100 rounded-lg p-3"
            onChange={handleChange}
          />
          <input
            type="password"
            id="password"
            placeholder="Password"
            className="bg-slate-100 rounded-lg p-3"
            onChange={handleChange}
          />
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
            {loading ? "Loading..." : "Update profile"}
          </button>
  
          <div className="flex justify-between gap-4 mt-4">
            <span
              onClick={handleDeleteAccount}
              className="text-red-700 cursor-pointer border-b border-red-700 hover:text-red-900"
            >
              Delete Account
            </span>
            <span
              onClick={handleSignOut}
              className="text-red-700 cursor-pointer border-b border-red-700 hover:text-red-900"
            >
              Sign out
            </span>
          </div>
        </form>
      </div>
  
      <p className="text-red-700 mt-5">{error && "Something went wrong!"}</p>
      <p className="text-green-700 mt-5">
        {updateSuccess && "User is updated successfully!"}
      </p>
  
      {/* New Div for Create Table Button and Table List */}
      <div className="mt-6 max-w-screen-xl ring py-4 p-3 mx-auto">
        <button className="ring-2 mr-3 ring-green-700 text-blue-700 hover:bg-blue-700 hover:text-white font-bold py-2 px-4 rounded">
          Your Table
        </button>
        <button className="ring-2 ring-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white font-bold py-2 px-4 rounded">
          <Link to="/create-table-team">Create Table</Link>
        </button>
  
        {userTables.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {userTables.map((table) => (
              <div
                key={table._id}
                className="bg-slate-100 w-full sm:w-[48%] lg:w-[48%] flex justify-between items-center p-3 rounded-lg"
              >
                <div>
                  <div className="flex justify-center bg-green-500 py-1">
                    <h3 className="text-xl font-semibold">{table.name}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {table.clubs.map((club) => (
                      <div key={club.clubId._id} className="flex items-center">
                        {club.clubId.logoUrl && (
                          <img
                            src={club.clubId.logoUrl}
                            alt={`${club.clubId.name} logo`}
                            className="w-8 h-8 mr-2"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button className="flex items-center gap-3 py-2 px-3 bg-red-400 rounded">
                    <Link to={`/manage-matches/${table._id}`}>
                      <p className="text-blue-500 cursor-pointer">
                        Manage matches
                      </p>
                    </Link>
                    <img src={whistle} className="w-8 h-8" alt="" />
                  </button>
                  <button className="flex items-center gap-3 py-2 px-3 bg-red-400 rounded">
                    <Link to={`/update-table/${table._id}`}>
                      <p className="text-green-500 cursor-pointer">
                        Update table
                      </p>
                    </Link>
                    <img src={pen} className="w-8 h-8" alt="" />
                  </button>
                  <button
                    onClick={() => handleTableDelete(table._id)}
                    className="flex items-center gap-3 py-2 px-3 bg-green-400 rounded"
                  >
                    <p className="text-red-700">Delete Table</p>
                    <img src={pen} className="w-8 h-8" alt="" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center">You haven't created any tables yet.</p>
        )}
        {deleteError && <p className="text-red-700 mt-5">{deleteError}</p>}
      </div>
    </div>
  );
  
  
}
