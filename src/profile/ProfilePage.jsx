import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import ViewProfile from './ViewProfile';
import EditProfileForm from './EditProfileForm';

export default function ProfilePage() {
    const { user } = useSelector(state => state.auth); 
      const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : '?';

    const [isEditing, setIsEditing] = useState(false);

    return (
        <>


            <div className="mx-4 min-h-screen max-w-screen-xl sm:mx-8 xl:mx-auto">
                <h1 className="border-b py-6 text-4xl font-semibold">ACCOUNT</h1>

                <div className="pt-3"> 
                    <div className="overflow-hidden rounded-xl sm:bg-gray-50 sm:px-8 sm:shadow py-6"> 
                        <div className="flex items-center justify-between border-b pb-6">
                            <div className="flex items-center">
                                <img
                                    src={`https://placehold.co/100/e0b8a4/4a4e4d?text=${userInitial}`} 
                                    alt="User Profile"
                                    className="h-24 w-24 rounded-full object-cover mr-4" 
                                />
                            
                                <h1 className="text-3xl font-bold">Your Profile</h1>
                            </div>

                            {!isEditing && (
                                <button
                                onClick={() => setIsEditing(true)}
                                className="px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 hover:border-gray-400 transition"
                              >
                                Edit Profile
                              </button>
                            )}
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