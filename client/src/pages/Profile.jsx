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
import whistle from "../assets/whistle.svg";
import pen from "../assets/pen.svg";
import deletee from "../assets/delete.svg";
import userpen from "../assets/userpen.svg";
import userdel from "../assets/userdel.svg";
import signout from "../assets/signout.svg";
import pensq from "../assets/pensq.svg";


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
  const [showPopover, setShowPopover] = useState(null); // For managing popover visibility

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
  };
  
  const togglePopover = (tableId) => {
    if (showPopover === tableId) {
      setShowPopover(null); // Close popover if already open
    } else {
      setShowPopover(tableId); // Open popover for this table
    }
  };

  return (
    <div className="bg-white px-4 lg:px-6 py-2.5">
      <div className="flex flex-col lg:flex-row justify-center items-start mx-auto max-w-screen-xl">
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
            className="cursor-pointer lg:w-[250px] md:w-[200px] rounded-full object-cover mb-4"
            onClick={() => fileRef.current.click()}
          />
          <p className="font-poppins font-semibold">
            <span className="font-poppins font-semibold">joined on </span>
            {new Date(currentUser.createdAt).toLocaleDateString("en-US", {
              weekday: "short",
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
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
            className="bg-white ring-2 ring-[#00684A]  font-poppins font-semibold text-center rounded-lg p-3"
            onChange={handleChange}
          />
          <input
            defaultValue={currentUser.email}
            type="email"
            id="email"
            placeholder="Email"
            className="bg-white ring-2 ring-[#00684A]  font-poppins font-semibold text-center rounded-lg p-3"
            onChange={handleChange}
          />
          <input
            type="password"
            id="password"
            placeholder="Password"
            className="bg-white ring-2 ring-[#00684A]  font-poppins font-semibold text-center rounded-lg p-3"
            onChange={handleChange}
          />
          <button className=" bg-[#00684A] flex justify-center gap-3 text-white font-poppins font-semibold p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
            {loading ? "Loading..." : "Update profile"}
            <img src={userpen} className="w-6 h-6 fill-white" alt="" />
          </button>

          <div className="flex justify-between gap-4">
            <span
              onClick={handleDeleteAccount}
              className=" cursor-pointer font-poppins font-semibold flex gap-3 ring ring-red-600 rounded-md p-2"
            >
              Delete Account
              <img src={userdel} className="w-6 h-6" alt="" />
            </span>
            <span
              onClick={handleSignOut}
              className="ring justify-center items-center font-poppins font-semibold px-3 flex gap-3 cursor-pointer ring-[#00684A] rounded-md"
            >
              Sign out
              <img src={signout} className="w-6 h-6" alt="" />
            </span>
          </div>
        </form>
      </div>

      <p className="text-red-700 mt-5">{error && "Something went wrong!"}</p>
      <p className="text-green-700 mt-5">
        {updateSuccess && "User is updated successfully!"}
      </p>

      {/* New Div for Create Table Button and Table List */}
      <div className="mt-6 max-w-screen-xl  py-4 p-3 mx-auto">
        <div className="flex space-x-3">
          <button className="ring-2 font-poppins ring-[#00684A] text-black font-bold lg:py-2 lg:px-4 py-1 px-2 rounded">
            Your Tables
          </button>
          <button className="text-white  bg-[#00684A] font-bold gap-2 lg:py-2 lg:px-9 py-1 px-6 flex rounded">
            <Link to="/create-table-team">Create Table</Link>
            <img src={pensq} className="w-6 h-6" alt="" />
          </button>
        </div>

        {userTables.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {userTables.map((table) => (
              <div
                key={table._id}
                className="ring-2 ring-[#00684A] w-full sm:w-[48%] lg:w-[48%] flex justify-between items-center p-3 rounded-lg"
              >
                <div>
                <Link to={`/display-table/${table._id}`}>

                  <div className="flex justify-center items-center text-white bg-[#00684A] font-bold rounded-md font-poppins py-1 w-32">
                    <h3 className="text-lg lg:text-xl font-semibold text-center">
                      {table.name.substring(0, 4)}
                      {table.name.length > 4 ? "..." : ""}
                    </h3>
                  </div>
                  </Link>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {table.clubs.slice(0, 3).map((club) => (
                      <div key={club.clubId._id} className="flex items-center">
                        {club.clubId.logoUrl && (
                          <img
                            src={club.clubId.logoUrl}
                            alt={`${club.clubId.name} logo`}
                            className="lg:w-6 lg:h-6 w-4 h-4 mr-2"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <button className="flex items-center justify-between gap-3 py-1 lg:px-3 bg-white ring-2 ring-[#00684A] rounded min-w-full flex-1 text-center">
                    <Link to={`/manage-matches/${table._id}`}>
                      <p className="font-poppins cursor-pointer">
                        Manage matches
                      </p>
                    </Link>
                    <img
                      src={whistle}
                      className="lg:w-6 lg:h-6 w-4 h-4"
                      alt=""
                    />
                  </button>
                  <button className="flex items-center justify-between  gap-3 py-1 lg:px-3 px-1 text-white bg-[#00684A] font-bold rounded-md font-poppins min-w-full flex-1 text-center">
                    <Link to={`/update-table/${table._id}`}>
                      <p className="cursor-pointer">Update table</p>
                    </Link>
                    <img src={pen} className="lg:w-6 lg:h-6 w-4 h-4" alt="" />
                  </button>
                  <button
                onClick={() => togglePopover(table._id)}
                className="flex items-center justify-between  gap-3 py-1 px-3 bg-red-600 rounded min-w-full flex-1 text-center"
                  >
                    <p className="text-white font-poppins">Delete Table</p>
                    <img
                      src={deletee}
                      className="lg:w-6 lg:h-6 w-4 h-4"
                      alt=""
                    />
                  </button>
                  {showPopover === table._id && (
                <div className="absolute bg-[#00684A] shadow-lg p-3 rounded-lg z-50">
                  <p className="text-white font-poppins">Are you sure you want to delete this table?</p>
                  <div className="flex justify-end mt-3 gap-2">
                    <button
                      onClick={() => handleTableDelete(table._id)}
                      className="bg-red-500 hover:bg-red-800  text-white font-poppins p-2 rounded-lg"
                    >
                      Yes, Delete
                    </button>
                    <button
                      onClick={() => togglePopover(null)}
                      className="bg-white hover:bg-slate-300 text-black font-poppins p-2 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center mt-9 font-fraunces text-xl">You haven't created any tables yet.</p>
        )}
        {deleteError && <p className="text-red-700 mt-5">{deleteError}</p>}
      </div>
    </div>
  );
}
