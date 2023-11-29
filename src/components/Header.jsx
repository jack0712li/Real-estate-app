import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';


export default function Header() {
    return (
        <header className='bg-gray-800 shadow-md'>
            <div className='flex justify-between items-center max-w-6xl mx-auto p-4'>
                <Link to='/'>
                    <h1 className='font-bold text-xl sm:text-3xl flex flex-wrap'>
                        <span className='text-white'>NewBoston</span>
                        <span className='text-indigo-500'>Estate</span>
                    </h1>
                </Link>
                <form className='bg-gray-700 p-3 rounded-lg flex items-center border border-gray-600'>
                    <input type='text' placeholder='Search' className='bg-transparent focus:outline-none w-32 sm:w-80 p-2 text-white' />
                    <FaSearch className='text-gray-300 ml-2' />
                </form>

                <ul className='flex gap-6'>
                    <Link to='/'>
                        <li className='hidden sm:inline text-gray-300 hover:text-indigo-500'>Home</li>
                    </Link>
                    <Link to='/about'>
                        <li className='hidden sm:inline text-gray-300 hover:text-indigo-500'>About</li>
                    </Link>
                    <Link to='/sign-in'>
                        <li className='text-gray-300 hover:text-indigo-500'>Sign in</li>
                    </Link>
                </ul>

            </div>
        </header>
    )
}


