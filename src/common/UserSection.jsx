import React from 'react';
import { Link } from 'react-router-dom';

/**
 * A welcome component for logged-in users.
 * @param {{ user: { name: string } }} props - The component expects a user object prop.
 */
const UserSection = ({ user }) => {
  return (
    <div className="bg-slate-50 border-y dark:border-gray-700 my-10 sm:my-20">
      <div className="py-12 px-6 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-black  sm:text-4xl">
            {/* Using the personalized greeting from your original code */}
            Welcome back, {user?.name || 'Reader'}!
          </h2>
          <p className="mx-auto mt-4 sm:mt-6 max-w-xl text-md sm:text-lg sm:leading-relaxed text-gray-600 ">
            {/* Using the descriptive text from your original code */}
            Ready to dive into a new book? Here are some quick links to get you started.
          </p>
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6">
            
            {/* Applying the new design's primary button style to the "Browse Books" link */}
            <Link
              to="/books"
              className="flex items-center justify-center w-full sm:w-auto min-w-[160px] px-8 py-3 rounded-full font-semibold tracking-wide border transition ease-in-out duration-150 bg-black  text-white  border-transparent"
            >
              Browse Books
            </Link>
            
            {/* Applying a secondary style for the "View My Orders" link */}
            <Link
              to="/orders"
              className="flex items-center justify-center w-full sm:w-auto min-w-[160px] px-8 py-3 rounded-full font-semibold tracking-wide border transition ease-in-out duration-150 bg-gray-200 hover:bg-gray-300   text-gray-800  border-transparent"
            >
              View My Orders
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSection;