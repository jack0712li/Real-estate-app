import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import { useEffect, useState } from 'react';


export default function Header() {
    const {currentUser} = useSelector(state => state.user);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if (searchTermFromUrl) {
        setSearchTerm(searchTermFromUrl);
        }
    }, [location.search]);

    return (
        <header className='bg-gray-800 shadow-md'>
            <div className='flex justify-between items-center max-w-6xl mx-auto p-4'>
                <Link to='/'>
                    <h1 className='font-bold text-xl sm:text-3xl flex flex-wrap'>
                        <span className='text-white'>NewBoston</span>
                        <span className='text-indigo-500'>Estate</span>
                    </h1>
                </Link>
                <form onSubmit={handleSubmit} className='bg-gray-700 p-3 rounded-lg flex items-center border border-gray-600'>
                    <input type='text' placeholder='Search' className='bg-transparent focus:outline-none w-32 sm:w-80 p-2 text-white'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} />
                    <button>
                        <FaSearch className='text-gray-300 ml-2' />
                    </button>
                </form>
                
                <ul className='flex gap-6'>
                    <Link to='/'>
                        <li className='hidden sm:inline text-gray-300 hover:text-indigo-500'>Home</li>
                    </Link>
                    <Link to='/about'>
                        <li className='hidden sm:inline text-gray-300 hover:text-indigo-500'>About</li>
                    </Link>
                    <Link to='/profile'>
                    {currentUser ? (
                        <img className='rounded-full h-8 w-8 object-cover' src={currentUser.avatar} alt='profile' />
                    ) : <li className='text-gray-300 hover:text-indigo-500'>Log in</li>
                    }
                    </Link>
                </ul>

            </div>
        </header>
    )
}


