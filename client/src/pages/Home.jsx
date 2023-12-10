import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useSelector } from "react-redux";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";
import SellerRecentListing from "../components/Home/sellerRecentListing";

export default function Home() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [offerListings, setOfferListings] = useState([]);
  const [recentListings, setRecentListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [adminListings, setAdminListings] = useState([]);
  const [loadedListingsCount, setLoadedListingsCount] = useState(8);
  const [hasMoreListings, setHasMoreListings] = useState(true);

  SwiperCore.use([Navigation]);
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch("/api/listing/get?offer=true&limit=3");
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=rent&limit=3");
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=sale&limit=3");
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
  }, []);

  const getListingsByUserId = async () => {
    const LISTING_ENDPOINT = "/api/listing/getByUser";
    const getListingsByUserIdURL = `${LISTING_ENDPOINT}?userId=${currentUser._id}&limit=2&sort=desc&sortBy=update`;
    try {
      const res = await fetch(getListingsByUserIdURL);
      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (currentUser && currentUser.type === "seller") {
      getListingsByUserId().then((data) => {
        setRecentListings(data);
      });
    }
  }, []);

  const fetchAdminListings = async () => {
    if (!currentUser || currentUser.type !== 'admin') return;
  
    try {
      const res = await fetch(`/api/listing/getAll?limit=8`); // Using getListings endpoint
      const data = await res.json();
      setAdminListings(data);
    } catch (error) {
      console.error('Error fetching admin listings:', error);
    }
  };
  
  useEffect(() => {
    if (currentUser && currentUser.type === "admin") {
      fetchAdminListings();
    }
  }, [currentUser]);

  const loadMoreListings = async () => {
    try {
      // Fetch the total number of listings
      const totalRes = await fetch('/api/listing/count');
      const { count: totalListingsCount } = await totalRes.json();
  
      const nextStart = adminListings.length;
      const limit = totalListingsCount - nextStart;
      if (limit <= 0) {
        setHasMoreListings(false);
        return;
      }
  
      const res = await fetch(`/api/listing/getAll?start=${nextStart}&limit=${limit}`);
      const newData = await res.json();
      console.log(newData);
  
      // Check if newData is empty (no more listings to load)
      if (newData.length === 0) {
        setHasMoreListings(false);
        return;
      }
  
      // Append new listings to the existing ones
      setAdminListings(prevListings => [...prevListings, ...newData]);
  
      // Update the count of loaded listings
      setLoadedListingsCount(prevCount => prevCount + newData.length);
    } catch (error) {
      console.error('Error loading more listings:', error);
    }
  };
  
  

  return (
    <div>
      {/* top */}
      {/* render recent added listing from all users if role is admin*/}
      {currentUser && currentUser.type === 'admin' && (
        <div>
          <h2>Admin Panel - All Listings</h2>
          <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
            {adminListings.map(listing => (
              <div key={listing._id}>
                <ListingItem listing={listing} />
                {/* Add Edit and Delete buttons here */}
              </div>
            ))}
          </div>
          {hasMoreListings && adminListings.length >= loadedListingsCount && (
            <button onClick={loadMoreListings}>Load More</button>
          )}
        </div>
      )}

      {(!currentUser || currentUser.type !== 'admin') && (
      <div>
        <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
          <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
            Find your next <span className="text-slate-500">perfect</span>
            <br />
            place with ease
          </h1>
          <div className="text-gray-400 text-xs sm:text-sm">
            Sahand Estate is the best place to find your next perfect place to
            live.
            <br />
            We have a wide range of properties for you to choose from.
          </div>
          <Link
            to={"/search"}
            className="text-xs sm:text-sm text-blue-800 font-bold hover:underline"
          >
            Let's get started...
          </Link>
        </div>

        {/* swiper */}
        <Swiper navigation>
          {offerListings &&
            offerListings.length > 0 &&
            offerListings.map((listing) => (
              <SwiperSlide key={listing._id}>
                <div
                  style={{
                    background: `url(${listing.imageUrls[0]}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                  className="h-[500px]"
                  key={listing._id}
                ></div>
              </SwiperSlide>
            ))}
        </Swiper>

        {/* listing results for offer, sale and rent */}

        {/* render recent listing of current user if role is seller*/}
        {currentUser && currentUser.type === "seller" && (
          <SellerRecentListing recentListings={recentListings} />
        )}

        <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
          {offerListings && offerListings.length > 0 && (
            <div className="">
              <div className="my-3">
                <h2 className="text-2xl font-semibold text-slate-600">
                  Recent offers
                </h2>
                <Link
                  className="text-sm text-blue-800 hover:underline"
                  to={"/search?offer=true"}
                >
                  Show more offers
                </Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {offerListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
          )}
          {rentListings && rentListings.length > 0 && (
            <div className="">
              <div className="my-3">
                <h2 className="text-2xl font-semibold text-slate-600">
                  Recent places for rent
                </h2>
                <Link
                  className="text-sm text-blue-800 hover:underline"
                  to={"/search?type=rent"}
                >
                  Show more places for rent
                </Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {rentListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
          )}
          {saleListings && saleListings.length > 0 && (
            <div className="">
              <div className="my-3">
                <h2 className="text-2xl font-semibold text-slate-600">
                  Recent places for sale
                </h2>
                <Link
                  className="text-sm text-blue-800 hover:underline"
                  to={"/search?type=sale"}
                >
                  Show more places for sale
                </Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {saleListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
          )}
        </div>
        </div>
      )}
    </div>
  );
}
