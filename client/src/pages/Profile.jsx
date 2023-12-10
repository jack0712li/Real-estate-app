import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const dispatch = useDispatch();
  const params = useParams();

  // firebase storage
  // allow read;
  // allow write: if
  // request.resource.size < 2 * 1024 * 1024 &&
  // request.resource.contentType.matches('image/.*')

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  useEffect(() => {
    if (params.id) {
      getUserInfo(params.id);
    }
  }, [params.id]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const getUserInfo = async (userId) => {
    try {
      const res = await fetch(`/api/user/${userId}`);
      const data = await res.json();
      if (data.success === false) {
        return;
      }
      setUserInfo(data);
    } catch (error) {
      console.log(error.message);
    }
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
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(data.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  /**
   * Renders the user information section.
   *
   * @returns {JSX.Element} The user information section component.
   */
  const userInfoSection = (
    <section className="pt-16 bg-blueGray-50">
      <div className="md:w-6/12 lg:w-6/12 px-4 mx-auto">
        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg mt-16">
          <div className="px-6">
            <div className="flex flex-wrap justify-center">
              <div className="w-full px-4 flex justify-center mb-20">
                <div className="relative w-52">
                  <img
                    src={userInfo.avatar}
                    alt="profile"
                    className="shadow-xl -mt-28 sm:-mt-28 absolute rounded-full h-auto align-middle border-none"
                  />
                </div>
              </div>
            </div>
            <div className="text-center mt-12">
              <h3 className="text-xl font-semibold leading-normal text-blueGray-700 mb-2">
                {(userInfo.firstname || "Elon") +
                  " " +
                  (userInfo.lastname || "Musk")}
              </h3>
              <div className="flex justify-center mb-2 text-slate-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 mx-1"
                >
                  <path
                    strokeLinecap="round"
                    d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 10-2.636 6.364M16.5 12V8.25"
                  />
                </svg>
                {userInfo.username}
              </div>
              <div className="flex justify-center text-sm  leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 mx-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  />
                </svg>
                {userInfo.location || "Outter Space 🪐"}
              </div>
            </div>
            <div className="mt-10 py-10 border-t border-blueGray-200">
              <div className="flex flex-wrap justify-center">
                <div className="w-full lg:w-9/12 px-4">
                  <p className="mb-4 text-lg text-blueGray-700">
                    {userInfo.description ||
                      "I hacked this guy's profile since they didn't share any information. I am fortunate to have significant wealth🤑, including ownership of a Tesla and SpaceX.🚀 "}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  /**
   * Renders the profile edit section.
   *
   * @returns {JSX.Element} The profile edit section.
   */
  const editProfileSection = (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image successfully uploaded!</span>
          ) : (
            ""
          )}
        </p>
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            {" "}
            username{" "}
          </label>
          <input
            type="text"
            id="username"
            placeholder="username"
            defaultValue={currentUser.username}
            className="mt-1  p-3 w-full rounded-md border-gray-200 shadow-sm"
            onChange={handleChange}
          />
        </div>
        <div>
          <label
            htmlFor="firstname"
            className="block text-sm font-medium text-gray-700"
          >
            {" "}
            firstname{" "}
          </label>
          <input
            type="text"
            id="firstname"
            placeholder="firstname"
            defaultValue={currentUser.firstname || ""}
            className="mt-1  p-3 w-full rounded-md border-gray-200 shadow-sm"
            onChange={handleChange}
          />
        </div>
        <div>
          <label
            htmlFor="lastname"
            className="block text-sm font-medium text-gray-700"
          >
            {" "}
            lastname{" "}
          </label>
          <input
            type="text"
            id="lastname"
            placeholder="lastname"
            defaultValue={currentUser.lastname || ""}
            className="mt-1  p-3 w-full rounded-md border-gray-200 shadow-sm"
            onChange={handleChange}
          />
        </div>
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            {" "}
            location{" "}
          </label>
          <input
            type="text"
            id="location"
            placeholder="City, State"
            defaultValue={currentUser.location || ""}
            className="mt-1 p-3 w-full rounded-md border-gray-200 shadow-sm"
            onChange={handleChange}
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            {" "}
            email{" "}
          </label>
          <input
            type="email"
            id="email"
            placeholder="email"
            defaultValue={currentUser.email || ""}
            className="mt-1  p-3 w-full rounded-md border-gray-200 shadow-sm"
            onChange={handleChange}
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            {" "}
            password{" "}
          </label>
          <input
            type="password"
            id="password"
            className="mt-1  p-3 w-full rounded-md border-gray-200 shadow-sm"
            onChange={handleChange}
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            {" "}
            description{" "}
          </label>

          <textarea
            id="description"
            className="mt-2 p-3 w-full rounded-lg border-gray-200 shadow-sm h-72"
            defaultValue={currentUser.description || ""}
            placeholder="Introduce yourself!"
            onChange={handleChange}
          ></textarea>
        </div>
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
          to={`/profile/${currentUser._id}`}
        >
          View My Profile
        </Link>
        {currentUser.type === "seller" && (
          <Link
            className="bg-blue-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
            to={"/create-listing"}
          >
            Create Listing
          </Link>
        )}
        {currentUser.type === "seller" && (
          <Link
            className="bg-yellow-500 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
            to={"/personal"}
          >
            Show Your Listing
          </Link>
        )}
        {currentUser.type === "buyer" && (
          <Link
            className="bg-red-500 text-white p-3 rounded-lg uppercase text-center hover:opacity-95 flex items-center gap-2 justify-center"
            to={"/personal"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
            Show Your Favourite List
          </Link>
        )}
        {currentUser.type === "admin" && (
          <Link
            className="bg-red-500 text-white p-3 rounded-lg uppercase text-center hover:opacity-95 flex items-center gap-2 justify-center"
            to={"/#"}
          >
            Admin Portal
          </Link>
        )}
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign out
        </span>
      </div>

      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <p className="text-green-700 mt-5">
        {updateSuccess ? "User is updated successfully!" : ""}
      </p>
      {/* {currentUser.type === "seller" && (
        <button onClick={handleShowListings} className="text-green-700 w-full">
          Show Listings
        </button>
      )} */}
      {/* <p className="text-red-700 mt-5">
        {showListingsError ? "Error showing listings" : ""}
      </p> */}

      {/* {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg p-3 flex justify-between items-center gap-4"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                  className="h-16 w-16 object-contain"
                />
              </Link>
              <Link
                className="text-slate-700 font-semibold  hover:underline truncate flex-1"
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className="flex flex-col item-center">
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className="text-red-700 uppercase"
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-700 uppercase">Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )} */}
    </div>
  );

  return params.id ? userInfoSection : editProfileSection;
}
