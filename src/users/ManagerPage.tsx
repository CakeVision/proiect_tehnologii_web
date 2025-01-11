import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "@/components/sidebar/Sidebar";

const ManagerPage: React.FC = () => {
    const [managedUsers, setManagedUsers] = useState([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const baseApiURL = "https://proiecttehnologiiweb-production.up.railway.app";

    useEffect(() => {
        const fetchManagedUsers = async () => {
            const refreshToken = localStorage.getItem("refreshToken");
            const userId = localStorage.getItem("userId");
            const userType = localStorage.getItem("userType");

            if (!refreshToken || !userId || userType !== "Manager") {
                setError("You are not authorized to view this page.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${baseApiURL}/users/managed/${userId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${refreshToken}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch managed users. Status: ${response.status}`);
                }

                const data = await response.json();
                setManagedUsers(data.result);
            } catch (err: any) {
                setError(err.message || "An error occurred while fetching users.");
            } finally {
                setLoading(false);
            }
        };

        fetchManagedUsers();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="flex min-h-screen bg-[#1E1E1E]">
            <Sidebar />
            <div className="max-w-screen-xl mx-auto p-6">
                <h1 className="text-3xl font-semibold text-gray-200 mb-4 mt-8">Managed users</h1>

                {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4">
                        {error}
                    </div>
                )}

                <div className="grid">
                    {managedUsers.length === 0 ? (
                        <div className="text-center py-12 bg-gray-200 rounded-lg">
                            <p className="text-black">No users found.</p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-300 bg-gray-200 rounded-lg shadow mt-4">
                            {managedUsers.map((user: any) => (
                                <li
                                    key={user.id}
                                    className="px-4 py-3 flex justify-between items-center hover:bg-gray-100 cursor-pointer transition-colors duration-200"
                                >
                                    <div>
                                        <p className="font-medium text-gray-900 text-left">{user.name}</p>
                                        <p className="text-sm text-gray-500"> {user.email}</p>
                                    </div>
                                    <span className="text-sm text-gray-500">ID: {user.id}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManagerPage;