// src/components/common/HomePage.js (within the HomePage component)

export default function UserSection ( user ) {
    <div className="bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600 mt-2">Ready to dive into a new book? Here are some quick links to get you started.</p>
        <div className="mt-6 flex space-x-4">
            <Link to="/books" className="px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600">Browse Books</Link>
            <Link to="/orders" className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">View My Orders</Link>
        </div>
    </div>
}
