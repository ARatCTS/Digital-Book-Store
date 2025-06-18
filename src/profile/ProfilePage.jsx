import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserProfile } from '../store/authSlice';

// This is a simulated component as a dedicated API endpoint is required.
const ChangePasswordForm = () => {
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: 'error', text: 'This feature is not connected to the backend yet.' });
    }

    return (
        <form onSubmit={handleSubmit} className="mt-6 border-t pt-6 space-y-4">
            <h3 className="font-bold text-lg">Change Password</h3>
            <input name="currentPassword" type="password" placeholder="Current Password" required className="w-full p-2 border rounded" />
            <input name="newPassword" type="password" placeholder="New Password" required className="w-full p-2 border rounded" />
            <input name="confirmPassword" type="password" placeholder="Confirm New Password" required className="w-full p-2 border rounded" />
            {message && <p className={message.type === 'error' ? 'text-red-500 text-sm' : 'text-green-500 text-sm'}>{message.text}</p>}
            <button type="submit" className="px-4 py-2 text-sm bg-gray-200 rounded-lg hover:bg-gray-300">Update Password</button>
        </form>
    );
}

export default function ProfilePage() {
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({ name: user?.name || '', email: user?.email || '' });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        const result = await dispatch(updateUserProfile({ id: user.id, ...formData }));
        if (updateUserProfile.fulfilled.match(result)) {
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } else {
            setMessage({ type: 'error', text: 'Failed to update profile.' });
        }
    };

    return (
         <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input name="name" value={formData.name} onChange={handleChange} required className="w-full p-2 border rounded mt-1"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input name="email" type="email" value={formData.email} onChange={handleChange} required className="w-full p-2 border rounded mt-1"/>
                </div>
                {message && <p className={message.type === 'error' ? 'text-red-500 text-sm' : 'text-green-500 text-sm'}>{message.text}</p>}
                <button type="submit" className="px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600">Save Profile</button>
            </form>
            <ChangePasswordForm />
        </div>
    );
}
