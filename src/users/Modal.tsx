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
    onDelete: (user: User) => void;
}

const Modal = ({ isOpen, onClose, user, onSave, onDelete }: ModalProps) => {
    if (!isOpen || !user) return null;

    const [editedName, setEditedName] = useState(user.name);
    const [selectedUserType, setSelectedUserType] = useState(user.userType);
    const [deleteConfirmEmail, setDeleteConfirmEmail] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const userTypes = ['Administrator', 'Executor', 'Manager'];

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedName(e.target.value);
    };

    const handleUserTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedUserType(e.target.value);
    };

    const handleDeleteEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDeleteConfirmEmail(e.target.value);
    };

    const isDeleteEnabled = deleteConfirmEmail === user.email;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-[#232323] rounded-lg p-6 max-w-md w-full mx-4 border border-gray-300">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-200">User Details</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-200 hover:text-gray-100 bg-black border border-white"
                    >
                        ✕
                    </button>
                </div>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                        <div className="font-semibold text-gray-200">Name:</div>
                        <div className="text-gray-300">
                            <input
                                type="text"
                                value={editedName}
                                onChange={handleNameChange}
                                className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="font-semibold text-gray-200">Email:</div>
                        <div className="text-gray-300">{user.email}</div>

                        <div className="font-semibold text-gray-200">User Type:</div>
                        <div className="text-gray-300">
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

                        <div className="font-semibold text-gray-200">ID:</div>
                        <div className="text-gray-300">{user.id}</div>
                    </div>

                    {showDeleteConfirm && (
                        <div className="mt-4 p-4 bg-[#232323] rounded-md border border-gray-300">
                            <p className="text-sm text-red-600 mb-2">
                                To delete this user, please type their email address to confirm:
                            </p>
                            <input
                                type="email"
                                value={deleteConfirmEmail}
                                onChange={handleDeleteEmailChange}
                                placeholder="Enter email to confirm delete"
                                className="w-full border border-red-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-red-500 mb-2"
                            />
                            <button
                                onClick={() => {
                                    if (isDeleteEnabled) {
                                        onDelete(user);
                                        onClose();
                                    }
                                }}
                                disabled={!isDeleteEnabled}
                                className={`w-full px-4 py-2 rounded-md text-white transition-colors ${isDeleteEnabled
                                    ? 'bg-red-500 hover:bg-red-600'
                                    : 'bg-red-300 cursor-not-allowed'
                                    }`}
                            >
                                Delete User
                            </button>
                        </div>
                    )}
                </div>
                <div className="mt-6 flex justify-end space-x-2">
                    {!showDeleteConfirm && (
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                        >
                            Delete
                        </button>
                    )}
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
                                name: editedName,
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