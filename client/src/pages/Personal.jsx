import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ListingItem from '../components/ListingItem';
import { Link } from 'react-router-dom';

export default function FavoriteListings() {
    const [favoriteListings, setFavoriteListings] = useState([]);
    const [favoriteName, setFavoriteName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { currentUser } = useSelector((state) => state.user);
    const [SellerListings, setSellerListings] = useState([]);

    useEffect(() => {
        const fetchListings = async () => {
            if (!currentUser) return;
            setLoading(true);

            try {
                if (currentUser.type === 'buyer') {
                    const res = await fetch(`/api/user/favorite/${currentUser._id}`);
                    const data = await res.json();
                    if (data.favoriteListings) {
                        setFavoriteListings(data.favoriteListings);
                        setFavoriteName(data.name);
                    } else {
                        setError('No favorite listings found');
                    }
                } else if (currentUser.type === 'seller') {
                    const res = await fetch(`/api/user/listings/${currentUser._id}`);
                    const data = await res.json();
                    console.log(data);
                    if (!data) {
                        setError('Failed to fetch seller listings');
                    } else {
                        setSellerListings(data);
                    }
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, [currentUser]);


    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;


    const handleDelete = async (listingId) => {
        try {
            const response = await fetch('/api/user/favorite/remove', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: currentUser._id, listingId }),
            });

            const data = await response.json();
            if (response.ok) {
                setFavoriteListings(prevListings => prevListings.filter(listing => listing._id !== listingId));
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error('Failed to remove favorite listing', error);
        }
    };

    const handleListingDelete = async (listingId) => {
        try {
            const res = await fetch(`/api/listing/delete/${listingId}`, {
                method: 'DELETE',
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

    if (currentUser.type === 'buyer') {
        return (
            <div>
                <div className='ml-4'>
                    <h1 className="text-4xl font-bold mt-4 mb-6 text-slate-500">
                        {favoriteName}
                    </h1>
                    <div className='flex flex-wrap gap-4'>
                        {favoriteListings.map(listing => (
                            <div key={listing?._id || Math.random()} className="mb-4">
                                {listing ? (
                                    <ListingItem listing={listing} />
                                ) : (
                                    <div className='bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]'>
                                        <div className='h-[320px] sm:h-[220px] w-full object-cover bg-gray-300'></div>
                                        <div className='p-3 flex flex-col gap-2 w-full'>
                                            <p className='text-lg font-semibold text-slate-700'>
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
    if (currentUser.type === 'seller') {
        return (
          <div className='ml-4'>
            <h1 className="text-4xl font-bold mt-4 mb-6 text-slate-500">
              Your Listings
            </h1>
            <div className='flex flex-wrap gap-4'>
              {SellerListings.map((listing) => (
                <div key={listing._id} className="mb-4">
                  <ListingItem listing={listing} />
      
                  <div className="flex justify-between mt-2">
                    <Link to={`/update-listing/${listing._id}`}>
                      <button
                        className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex-1"
                      >
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
      if (currentUser.type === 'admin') {
      }
      
      
}
