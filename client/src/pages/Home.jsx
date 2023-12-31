import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useSelector } from "react-redux";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";
import RecentActivity from "../components/Home/RecentActivity";

export default function Home() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [offerListings, setOfferListings] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);

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

  const getFavoriteByUserId = async () => {
    const FAVORITE_ENDPOINT = `/api/user/favorite/${currentUser._id}`;
    const getFavoriteByUserIdURL = `${FAVORITE_ENDPOINT}?limit=2&sort=desc&sortBy=update`;
    try {
      const res = await fetch(getFavoriteByUserIdURL);
      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (currentUser && currentUser.type === "seller") {
      getListingsByUserId().then((data) => {
        setRecentActivity(data);
      });
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && currentUser.type === "buyer") {
      getFavoriteByUserId().then((data) => {
        setRecentActivity(data);
      });
    }
  }, [currentUser]);

  return (
    <div>
      {/* top */}

      <div>
        <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
          <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
            {currentUser ? `Hi, ${currentUser.username} 👋 ` : ""}
            {currentUser ? <br /> : ""}
            
            Discover Your <span className="text-slate-500">Dream Home</span>
            <br />
            with <span className='text-gray-50 ml-2'>NewBoston </span>
                        <span className='text-indigo-500'>Estate</span>
          </h1>
          <div className="text-gray-400 text-xs sm:text-sm">
            Explore a curated selection of residences with NewBoston Estate — your partner in finding the ideal space to call home.
            <br />
            Browse our extensive portfolio of properties tailored to suit every lifestyle.
          </div>
          <Link
            to={"/search"}
            className="text-xs sm:text-sm text-blue-800 font-bold hover:underline"
          >
            Begin your journey...
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

        {currentUser && currentUser.type == "admin" && (
          <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
            <div className="grid place-content-center rounded bg-gray-100 p-6 sm:p-8">
              <div className="mx-auto max-w-md text-center lg:text-center">
                <header>
                  <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">
                    Manage users and listings here
                  </h2>

                  <p className="mt-4 text-gray-500">
                    Always be responsible for our users and listings!
                  </p>
                </header>

                <Link
                  to={"/personal"}
                  className="mt-8 inline-block rounded border border-gray-900 bg-gray-900 px-12 py-3 text-sm font-medium text-white transition hover:shadow focus:outline-none focus:ring"
                >
                  Admin Portal
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* render recent listing of current user if role is not admin*/}
        {currentUser && currentUser.type !== "admin" && (
          <RecentActivity
            recentActivity={recentActivity}
            role={currentUser.type}
          />
        )}

        {/* listing results for offer, sale and rent */}
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
    </div>
  );
}
