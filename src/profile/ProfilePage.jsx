import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import ViewProfile from './ViewProfile';
import EditProfileForm from './EditProfileForm';

export default function ProfilePage() {
    const { user } = useSelector(state => state.auth); // Assuming user object is available

    // This state controls whether the user is viewing or editing their profile.
    const [isEditing, setIsEditing] = useState(false);

    return (
        <>
            {/* Source Sans Pro font import and style are usually in public/index.html or a global CSS file */}
            {/* <link href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;600;700&display=swap" rel="stylesheet" />
            <style>
                * {
                    font-family: 'Source Sans Pro';
                }
            </style> */}

            <div className="mx-4 min-h-screen max-w-screen-xl sm:mx-8 xl:mx-auto">
                <h1 className="border-b py-6 text-4xl font-semibold">ACCOUNT</h1>

                <div className="pt-3"> {/* Removed grid layout as sidebar is gone */}
                    <div className="overflow-hidden rounded-xl sm:bg-gray-50 sm:px-8 sm:shadow py-6"> {/* Card now occupies full width */}
                        <div className="flex items-center justify-between border-b pb-6">
                            {/* User Profile Image Placeholder */}
                            <div className="flex items-center">
                                <img
                                    src="https://via.placeholder.com/100" // Placeholder image URL
                                    alt="User Profile"
                                    className="h-24 w-24 rounded-full object-cover mr-4" // Suitable size
                                />
                                <h1 className="text-3xl font-bold">Your Profile</h1>
                            </div>

                            {/* The "Edit Profile" button, shown only when not editing */}
                            {!isEditing && (
                                <button
                                onClick={() => setIsEditing(true)}
                                className="px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 hover:border-gray-400 transition"
                              >
                                Edit Profile
                              </button>
                            )}
                            {/* The "View Profile" button, shown only when editing */}
                            {isEditing && (
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="text-sm font-medium text-gray-600 hover:text-gray-800"
                                >
                                    Cancel Edit
                                </button>
                            )}
                        </div>

                        <div className="pt-4">
                            {/* Based on the `isEditing` state, show either the view or the edit component. */}
                            {isEditing ? (
                                <EditProfileForm
                                    user={user}
                                    onSaveSuccess={() => setIsEditing(false)}
                                    onCancel={() => setIsEditing(false)}
                                />
                            ) : (
                                <ViewProfile user={user} onEditClick={() => setIsEditing(true)} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}