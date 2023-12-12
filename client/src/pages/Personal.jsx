import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ListingItem from "../components/ListingItem";
import { Link } from "react-router-dom";
import AdminPortal from "../components/Admin/AdminPortal";

export default function FavoriteListings() {
  const [favoriteListings, setFavoriteListings] = useState([]);
  const [favoriteName, setFavoriteName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const [SellerListings, setSellerListings] = useState([]);
  const [adminListings, setAdminListings] = useState([]);
  const [loadedListingsCount, setLoadedListingsCount] = useState(8);
  const [hasMoreListings, setHasMoreListings] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  const fetchAdminListings = async () => {
    try {
      const res = await fetch(`/api/listing/getAll?limit=8`);
      const data = await res.json();
      setAdminListings(data);
    } catch (error) {
      console.error("Error fetching admin listings:", error);
    }
  };

  const fetchAllusers = async () => {
    try {
      const res = await fetch(`/api/user`);
      const data = await res.json();
      setAllUsers(data);
    } catch (error) {
      console.error("Error fetching admin listings:", error);
    }
  };

  useEffect(() => {
    const fetchListings = async () => {
      if (!currentUser) return;
      setLoading(true);

      try {
        if (currentUser.type === "buyer") {
          // Fetch favorites for buyer
          const res = await fetch(`/api/user/favorite/${currentUser._id}`);
          const data = await res.json();
          setFavoriteListings(data.favoriteListings || []);
          if (!data.favoriteListings || data.favoriteListings.length === 0) {
            setError("You have not added anything to your favorite list yet!");
          } else {
            setFavoriteName(data.name);
          }
        } else if (currentUser.type === "seller") {
          // Fetch listings for seller
          const res = await fetch(`/api/user/listings/${currentUser._id}`);
          const data = await res.json();
          setSellerListings(data || []);
          if (!data || data.length === 0) {
            setError("You have no listings. Start by creating one!");
          }
        } else if (currentUser.type === "admin") {
          fetchAdminListings();
          fetchAllusers();
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [currentUser]);

  if (loading)
    return (
      <h1 className="text-4xl font-bold mt-4 mb-6 text-slate-700 ml-4">
        Loading...
      </h1>
    );
  if (error)
    return (
      <h1 className="text-4xl font-bold mt-4 mb-6 text-slate-700 ml-4">
        {error}
      </h1>
    );

  const handleDelete = async (listingId) => {
    try {
      const response = await fetch("/api/user/favorite/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: currentUser._id, listingId }),
      });

      const data = await response.json();
      if (response.ok) {
        setFavoriteListings((prevListings) =>
          prevListings.filter((listing) => listing._id !== listingId)
        );
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Failed to remove favorite listing", error);
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

      setSellerListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  const loadMoreListings = async () => {
    try {
      // Fetch the total number of listings
      const totalRes = await fetch("/api/listing/count");
      const { count: totalListingsCount } = await totalRes.json();

      const nextStart = adminListings.length;
      const limit = totalListingsCount - nextStart;
      if (limit <= 0) {
        setHasMoreListings(false);
        return;
      }

      const res = await fetch(
        `/api/listing/getAll?start=${nextStart}&limit=${limit}`
      );
      const newData = await res.json();

      // Check if newData is empty (no more listings to load)
      if (newData.length === 0) {
        setHasMoreListings(false);
        return;
      }

      // Append new listings to the existing ones
      setAdminListings((prevListings) => [...prevListings, ...newData]);

      // Update the count of loaded listings
      setLoadedListingsCount((prevCount) => prevCount + newData.length);
    } catch (error) {
      console.error("Error loading more listings:", error);
    }
  };

  const handleAdminListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.error(data.message);
        return;
      }

      // Re-fetch listings to update the state
      await fetchAdminListings();
    } catch (error) {
      console.error("Error deleting listing:", error);
    }
  };

  if (currentUser.type === "buyer") {
    return (
      <div>
        <div className="ml-4">
          <h1 className="text-4xl font-bold mt-4 mb-6 text-slate-500">
            {favoriteName}
          </h1>
          <div className="flex flex-wrap gap-4">
            {favoriteListings.map((listing) => (
              <div key={listing?._id || Math.random()} className="mb-4">
                {listing ? (
                  <ListingItem listing={listing} />
                ) : (
                  <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]">
                    <div className="h-[320px] sm:h-[220px] w-full object-cover bg-gray-300"></div>
                    <div className="p-3 flex flex-col gap-2 w-full">
                      <p className="text-lg font-semibold text-slate-700">
                        This estate is no longer available.
                      </p>
                    </div>
                  </div>
                )}
                <button
                  onClick={() => handleDelete(listing?._id)}
                  className="w-full bg-red-700 text-white p-2 rounded-lg hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  if (currentUser.type === "seller") {
    return (
      <div className="ml-4">
        <h1 className="text-4xl font-bold mt-4 mb-6 text-slate-500">
          Your Listings
        </h1>
        <div className="flex flex-wrap gap-4">
          {SellerListings.map((listing) => (
            <div key={listing._id} className="mb-4">
              <ListingItem listing={listing} />

              <div className="flex justify-between mt-2">
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex-1">
                    Edit
                  </button>
                </Link>
                <div className="flex-grow-0 mx-2"></div>
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex-1"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (currentUser.type === "admin") {
    return (
      <div>
        <h1 className="text-4xl font-bold mt-4 mb-6 text-slate-500 ml-4">
          Manage Users
        </h1>
        <div className="mx-4">
          <AdminPortal allUsers={allUsers} onUserDeleted={fetchAdminListings} />
        </div>
        <div>
          <h1 className="text-4xl font-bold mt-4 mb-6 text-slate-500 ml-4">
            Manage All Listings
          </h1>
          <div className="flex flex-wrap gap-4 mx-4">
            {adminListings.map((listing) => (
              <div key={listing._id} className="mb-4 w-full sm:w-[330px]">
                <ListingItem listing={listing} />
                <div className="flex justify-between mt-2">
                  <Link to={`/update-listing/${listing._id}`}>
                    <button className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex-1">
                      Edit
                    </button>
                  </Link>
                  <div className="flex-grow-0 mx-2"></div>
                  <button
                    onClick={() => handleAdminListingDelete(listing._id)}
                    className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          {hasMoreListings && adminListings.length >= loadedListingsCount && (
            <div className="mx-4">
              <button
                onClick={loadMoreListings}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-400"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}
