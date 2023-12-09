import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
  FaHeart,
  FaRegHeart
} from 'react-icons/fa';
import { Link } from 'react-router-dom'
import Contact from '../components/Contact';
import { list } from 'firebase/storage';

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [isFavorited, setIsFavorited] = useState(false);
  const [listingOwner, setListingOwner] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
        fetchListingOwner(data.userRef); 
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    
    const fetchListingOwner = async (userRef) => {
      try {
        const res = await fetch(`/api/user/${userRef}`);
        const ownerData = await res.json();
        if (ownerData.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListingOwner(ownerData);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    const checkIfFavorited = async () => {
      if (!currentUser) {
        console.error('No user is logged in.');
        return;
      }
      let id = currentUser._id;

      const response = await fetch(`/api/user/favorite/check/${id}/${params.listingId}`);
      const data = await response.json();
      if (response.ok) {
        setIsFavorited(data.isFavorited);
      }
    };

    if (currentUser) {
      checkIfFavorited();
    }
    fetchListing();
    console.log(listing);
    console.log(listingOwner);
  }, [params.listingId, currentUser]);


  const handleFavoriteClick = async () => {
    if (!currentUser) {
      console.error('No user is logged in.');
      return;
    }
    const endpoint = isFavorited ? '/api/user/favorite/remove' : '/api/user/favorite/add';
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: currentUser._id, listingId: params.listingId }),
    });
    const data = await response.json();
    if (data.ok == false) {
      console.log(data.message);
      return;
    }
    setIsFavorited(!isFavorited);
  };

  return (
    <main>
      {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
      {error && (
        <p className='text-center my-7 text-2xl'>Something went wrong!</p>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className='h-[550px]'
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
            <FaShare
              className='text-slate-500'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
              Link copied!
            </p>
          )}
          <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>

            <div className="flex justify-between items-center">
              <p className="text-2xl font-semibold">
                {listing.name} - ${' '}
                {listing.offer
                  ? listing.discountPrice.toLocaleString('en-US')
                  : listing.regularPrice.toLocaleString('en-US')}
                {listing.type === 'rent' && ' / month'}
              </p>

              <div className="flex items-center">
                {/* 收藏图标，仅当用户角色为'buyer'时显示 */}
                {currentUser && currentUser.type === 'buyer' && (
                  <button
                    onClick={handleFavoriteClick}
                    className="mr-8"
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    {isFavorited ?
                      <FaHeart className="text-red-500 text-3xl" /> :
                      <FaRegHeart className="text-3xl" />}
                  </button>
                )}

                {/* 创建者头像 */}
                {listing.userRef && (
                  <Link to={`/`}>
                    <img
                      src={listingOwner?.avatar || '/default-avatar.png'}
                      alt="Creator's Avatar"
                      className="rounded-full"
                      style={{ width: '3em', height: '3em', objectFit: 'cover' }}
                    />
                  </Link>
                )}
              </div>
            </div>

            <p className='flex items-center mt-6 gap-2 text-slate-600  text-sm'>
              <FaMapMarkerAlt className='text-green-700' />
              {listing.address}
            </p>
            <div className='flex gap-4'>
              <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
              </p>
              {listing.offer && (
                <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                  ${+listing.regularPrice - +listing.discountPrice} OFF
                </p>
              )}
            </div>
            <p className='text-slate-800'>
              <span className='font-semibold text-black'>Description - </span>
              {listing.description}
            </p>
            <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBed className='text-lg' />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds `
                  : `${listing.bedrooms} bed `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBath className='text-lg' />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths `
                  : `${listing.bathrooms} bath `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaParking className='text-lg' />
                {listing.parking ? 'Parking spot' : 'No Parking'}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaChair className='text-lg' />
                {listing.furnished ? 'Furnished' : 'Unfurnished'}
              </li>
            </ul>
            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3'
              >
                Contact landlord
              </button>
            )}
            {contact && <Contact listing={listing} />}
          </div>
        </div>
      )}
    </main>
  );
}