import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import Logo from '../assets/logo.png';

// A custom hook to detect clicks outside of a component
const useOutsideAlerter = (ref, callback) => {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
}

const UserMenu = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, () => setIsOpen(false));

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : '?';

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        className="overflow-hidden rounded-full border border-gray-300 shadow-inner"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="sr-only">Toggle dashboard menu</span>
        {user?.profilePicture ? (
          <img
            src={user.profilePicture} // Assuming user object has a profilePicture field
            alt="User profile"
            className="size-10 object-cover"
          />
        ) : (
          <div className="size-10 bg-blue-500 text-white flex items-center justify-center rounded-full font-bold text-lg">
            {userInitial}
          </div>
        )}
      </button>

      {isOpen && (
        <div
          className="absolute end-0 z-10 mt-2 w-56 divide-y divide-gray-100 rounded-md border border-gray-100 bg-white shadow-lg"
          role="menu"
        >
          <div className="p-2">
            <Link
              to="/profile"
              className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              My profile
            </Link>
            <Link
              to="/orders"
              className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              My Orders
            </Link>
            {/* You can add "Billing summary" and "Team settings" if they map to existing routes or are desired features */}
            {/* <a
              href="#"
              className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              role="menuitem"
            >
              Billing summary
            </a>
            <a
              href="#"
              className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              role="menuitem"
            >
              Team settings
            </a> 
            */}
          </div>

          <div className="p-2">
            <button
              type="button"
              onClick={onLogout}
              className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-700 hover:bg-red-50"
              role="menuitem"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function NavBar() {
  const { isAuthenticated, isAdmin, user } = useSelector((state) => state.auth);
  const cartItems = useSelector(state => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  // State for mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-1 md:flex md:items-center md:gap-12">
            <Link className=" text-teal-600 flex flex-row items-center justify-center text-2xl gap-2 font-bold " to="/">
              <span className="sr-only">Home</span>
              {/* You can replace this SVG with your 'BookStore' text or another logo */}
              <img src={Logo} className='w-6 h-auto' alt="logo" />
              <h1 className='text'>BookNest</h1>
            </Link>
          </div>

          <div className="md:flex md:items-center md:gap-12">
            <nav aria-label="Global" className="hidden md:block">
              <ul className="flex items-center gap-6 text-sm">
                <li>
                  <Link className="text-gray-500 transition hover:text-gray-500/75" to="/books"> Books </Link>
                </li>
                {/* You can map these "About", "Careers", etc., to actual routes or remove them if not needed */}
                <li>
                  <a className="text-gray-500 transition hover:text-gray-500/75" href="/about"> About </a>
                </li>
                <li>
                  <a className="text-gray-500 transition hover:text-gray-500/75" href="/contactUs"> Contact us </a>
                </li>
                {isAdmin && (
                  <li>
                    <Link to="/admin" className="font-semibold text-teal-600 hover:text-teal-800"> Admin Panel </Link>
                  </li>
                )}
              </ul>
            </nav>

            <div className="flex items-center gap-4">
              <Link to="/cart" className="relative text-gray-600 hover:text-teal-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">{cartItemCount}</span>
                )}
              </Link>

              {isAuthenticated ? (
                <UserMenu user={user} onLogout={handleLogout} />
              ) : (
                <div className="hidden md:flex md:gap-4">
                  <Link
                    className="rounded-md bg-gray-100 px-5 py-2.5 text-sm font-medium text-teal-600 transition hover:text-teal-600/75"
                    to="/login"
                  >
                    Login
                  </Link>
                  <Link
                    className="rounded-md bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700"
                    to="/register"
                  >
                    Register
                  </Link>
                </div>
              )}

              <div className="block md:hidden">
                <button
                  className="rounded-sm bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <span className="sr-only">Toggle menu</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <ul className="flex flex-col gap-4 py-4 text-sm">
              <li>
                <Link className="text-gray-500 transition hover:text-gray-500/75" to="/books" onClick={() => setIsMobileMenuOpen(false)}> Books </Link>
              </li>
              <li>
                <a className="text-gray-500 transition hover:text-gray-500/75" href="#" onClick={() => setIsMobileMenuOpen(false)}> About </a>
              </li>
              <li>
                <a className="text-gray-500 transition hover:text-gray-500/75" href="#" onClick={() => setIsMobileMenuOpen(false)}> Careers </a>
              </li>
              {isAdmin && (
                <li>
                  <Link to="/admin" className="font-semibold text-teal-600 hover:text-teal-800" onClick={() => setIsMobileMenuOpen(false)}> Admin Panel </Link>
                </li>
              )}
              {!isAuthenticated && (
                <>
                  <li>
                    <Link
                      className="rounded-md bg-gray-100 px-5 py-2.5 text-sm font-medium text-teal-600 transition hover:text-teal-600/75"
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="rounded-md bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700"
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}