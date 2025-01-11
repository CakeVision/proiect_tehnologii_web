import React, { useState } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    userType: string;
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
    onSave: (updatedUser: User) => void;
}

const Modal = ({ isOpen, onClose, user, onSave }: ModalProps) => {
    if (!isOpen || !user) return null;

    const [editedId, setEditedId] = useState(user.id);
    const [selectedUserType, setSelectedUserType] = useState(user.userType);

    const userTypes = ['Administrator', 'Executor', 'Manager'];

    const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedId(e.target.value);
    };

    const handleUserTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedUserType(e.target.value);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900">User Details</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                        <div className="font-semibold text-gray-700">Name:</div>
                        <div className="text-gray-900">{user.name}</div>
                        
                        <div className="font-semibold text-gray-700">Email:</div>
                        <div className="text-gray-900">{user.email}</div>
                        
                        <div className="font-semibold text-gray-700">User Type:</div>
                        <div className="text-gray-900">
                            <select 
                                value={selectedUserType}
                                onChange={handleUserTypeChange}
                                className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {userTypes.map(type => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="font-semibold text-gray-700">ID:</div>
                        <div className="text-gray-900">
                            <input
                                type="text"
                                value={editedId}
                                onChange={handleIdChange}
                                className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            const updatedUser = {
                                ...user,
                                id: editedId,
                                userType: selectedUserType
                            };
                            onSave(updatedUser);
                        }}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;