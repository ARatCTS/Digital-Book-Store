import React from 'react';

export default function ViewProfile({ user }) {
    // This component is now purely for displaying user information.
    // The "Edit" button is handled by the parent ProfilePage.
    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-500">Full Name</label>
                <p className="text-lg text-gray-800 mt-1">{user?.name}</p>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-500">Email Address</label>
                <p className="text-lg text-gray-800 mt-1">{user?.email}</p>
            </div>
        </div>
    );
}