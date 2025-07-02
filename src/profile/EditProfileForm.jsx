import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateUserProfile } from '../store/authSlice';

export default function EditProfileForm({ user, onSaveSuccess, onCancel }) {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({ id: user?.id, name: user?.name || '', email: user?.email || '' });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        const result = await dispatch(updateUserProfile(formData));
        if (updateUserProfile.fulfilled.match(result)) {
            onSaveSuccess();
        } else {
            setMessage({ type: 'error', text: result.payload?.message || 'Failed to update profile.' });
        }
    };

    return (
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
            <div className="flex items-center space-x-4 pt-4">
                <button type="submit" className="px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 hover:border-gray-400 transition">Save Changes</button>
                <button type="button" onClick={onCancel} className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
            </div>
        </form>
    );
}