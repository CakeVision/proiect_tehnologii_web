import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "@/components/sidebar/Sidebar";
import Modal from "./Modal";

const baseApiURL = "https://proiecttehnologiiweb-production.up.railway.app";

interface User {
    id: string;
    name: string;
    email: string;
    userType: string;
}

const UsersPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [userName, setUserName] = useState<string>("");
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchUsers = async () => {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
            setError("User is not logged in.");
            return;
        }

        try {
            const response = await fetch(baseApiURL + "/users/", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${refreshToken}`,
                    "Access-Control-Allow-Origin": "*",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch users");
            }

            const data = await response.json();
            setUsers(data);
        } catch (err: any) {
            setError(err.message || "An error occurred while fetching users.");
        }
    };

    useEffect(() => {
        const name = localStorage.getItem("userName");
        if (name) {
            setUserName(name);
        }
        fetchUsers();
    }, []);

    const handleUpdateUser = async (updatedUser: User) => {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
            setError("User is not logged in.");
            return;
        }

        try {
            const response = await fetch(`${baseApiURL}/users/${updatedUser.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${refreshToken}`,
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify(updatedUser)
            });

            if (!response.ok) {
                throw new Error("Failed to update user");
            }

            await fetchUsers();
            handleCloseModal();
        } catch (err: any) {
            setError(err.message || "An error occurred while updating user.");
        }
    };

    const handleDeleteUser = async (updatedUser: User) => {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
            setError("User is not logged in.");
            return;
        }

        try {
            const response = await fetch(`${baseApiURL}/users/${updatedUser.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${refreshToken}`,
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify(updatedUser)
            });

            if (!response.ok) {
                throw new Error("Failed to update user");
            }

            await fetchUsers();
            handleCloseModal();
        } catch (err: any) {
            setError(err.message || "An error occurred while updating user.");
        }
    }

    const groupUsersByType = (users: User[]) => {
        return users.reduce((grouped, user) => {
            if (!grouped[user.userType]) {
                grouped[user.userType] = [];
            }
            grouped[user.userType].push(user);
            return grouped;
        }, {} as Record<string, User[]>);
    };

    const handleUserClick = (user: User) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                handleCloseModal();
            }
        };

        if (isModalOpen) {
            document.addEventListener('keydown', handleEscKey);
        }

        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [isModalOpen]);

    const groupedUsers = groupUsersByType(users);

    return (
        <div className="flex min-h-screen bg-[#1E1E1E]">
            <Sidebar />
            <div className="max-w-screen-xl mx-auto p-6">
                <h1 className="text-3xl font-semibold text-gray-200 mb-6">Users</h1>

                {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Object.keys(groupedUsers).length === 0 ? (
                        <div className="text-center py-12 bg-gray-200 rounded-lg">
                            <p className="text-black">No users found.</p>
                        </div>
                    ) : (
                        Object.keys(groupedUsers).map((userType) => (
                            <div key={userType} className="mb-8">
                                <h2 className="text-xl font-semibold text-gray-300">{userType}</h2>
                                <ul className="divide-y divide-gray-200 bg-gray-200 rounded-lg shadow mt-4">
                                    {groupedUsers[userType].map((user) => (
                                        <li 
                                            key={user.id} 
                                            className="px-4 py-3 flex justify-between items-center hover:bg-gray-100 cursor-pointer transition-colors duration-200"
                                            onClick={() => handleUserClick(user)}
                                        >
                                            <div>
                                                <p className="font-medium text-gray-900 text-left">{user.name}</p>
                                                <p className="text-sm text-gray-500">{user.email}</p>
                                            </div>
                                            <span className="text-sm text-gray-500">ID: {user.id}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))
                    )}
                </div>

                <Modal 
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    user={selectedUser}
                    onSave={handleUpdateUser}
                    onDelete={handleDeleteUser}
                />
            </div>
        </div>
    );
};

export default UsersPage;