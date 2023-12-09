import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ListingItem from '../components/ListingItem';

export default function FavoriteListings() {
    const [favoriteListings, setFavoriteListings] = useState([]);
    const [favoriteName, setFavoriteName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        const fetchFavoriteListings = async () => {
            if (!currentUser) return;
            setLoading(true);

            try {
                const res = await fetch(`/api/user/favorite/${currentUser._id}`);
                const data = await res.json();
                if (data.favoriteListings) {
                    setFavoriteListings(data.favoriteListings);
                    setFavoriteName(data.name);
                } else {
                    setError('No favorite listings found');
                }
            } catch (err) {
                setError('Failed to fetch favorite listings');
            } finally {
                setLoading(false);
            }
        };
        if (currentUser.type === 'buyer') {
            fetchFavoriteListings();
        }
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
            <div>

            </div>
        );
    }
}
