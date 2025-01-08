import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "@/components/sidebar/Sidebar";
import dotenv from 'dotenv';

dotenv.config();


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

    useEffect(() => {
        const name = localStorage.getItem("userName");
        if (name) {
            setUserName(name);
        }

        const fetchUsers = async () => {
            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) {
                setError("User is not logged in.");
                return;
            }

            try {
                const response = await fetch(process.env.BACKEND_URL + "/users/", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${refreshToken}`,
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

        fetchUsers();
    }, []);

    const groupUsersByType = (users: User[]) => {
        return users.reduce((grouped, user) => {
            if (!grouped[user.userType]) {
                grouped[user.userType] = [];
            }
            grouped[user.userType].push(user);
            return grouped;
        }, {} as Record<string, User[]>);
    };

    const groupedUsers = groupUsersByType(users);

    return (
        <div className="flex min-h-screen bg-gray-600">
            <Sidebar />
            <div className="max-w-screen-xl mx-auto p-6">
                <h1 className="text-3xl font-semibold text-gray-900 mb-6">Users</h1>

                {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

                    {Object.keys(groupedUsers).length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                            <p className="text-gray-500">No users found.</p>
                        </div>
                    ) : (
                        Object.keys(groupedUsers).map((userType) => (
                            <div key={userType} className="mb-8">
                                <h2 className="text-xl font-semibold text-gray-300">{userType}</h2>
                                <ul className="divide-y divide-gray-200 bg-white rounded-lg shadow mt-4">
                                    {groupedUsers[userType].map((user) => (
                                        <li key={user.id} className="px-4 py-3 flex justify-between items-center">
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
            </div>
        </div>
    );
};

export default UsersPage;
