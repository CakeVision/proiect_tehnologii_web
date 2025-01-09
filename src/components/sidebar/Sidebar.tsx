import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Optional if you're using React Router

// const backend_url = import.meta.env.BACKEND_URL
const baseApiURL = "https://proiecttehnologiiweb-production.up.railway.app"

const Sidebar: React.FC = () => {
    const [loggedInUser, setLoggedInUser] = useState<{ name: string; userType: string } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
    const [userName, setUserName] = useState<string | null>(null);
    const [userType, setUserType] = useState<string | null>(null);

    useEffect(() => {
        const storedName = localStorage.getItem("userName");
        const storedUserType = localStorage.getItem("userType");
        if (storedName) setUserName(storedName);
        if (storedUserType) setUserType(storedUserType);
    }, []);

    // useEffect(() => {
    //     const fetchUsers = async () => {
    //         const refreshToken = localStorage.getItem("refreshToken");
    //         if (!refreshToken) {
    //             setError("User is not logged in.");
    //             return;
    //         }

    //         try {
    //             const response = await fetch(baseApiURL + "/users/", {
    //                 method: "GET",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                     Authorization: `Bearer ${refreshToken}`,
    //                     "Access-Control-Allow-Origin": "*",
    //                 },
    //             });

    //             if (!response.ok) {
    //                 throw new Error("Failed to fetch users");
    //             }

    //             const data = await response.json();
    //             setUsers(data);

    //             const storedEmail = localStorage.getItem("userEmail");
    //             const loggedInUser = data.find((user: any) => user.email === storedEmail);

    //             if (loggedInUser) {
    //                 setLoggedInUser({
    //                     name: loggedInUser.name,
    //                     userType: loggedInUser.userType,
    //                 });
    //             }
    //         } catch (err: any) {
    //             setError(err.message || "An error occurred while fetching users.");
    //         }
    //     };

    //     fetchUsers();
    // }, []);

    return (
        <div className="w-48 bg-gray-600 text-white h-100 p-4 border-r-4 border-r-gray-300">
            {/* {loggedInUser && (
                <div className="p-4 text-white mb-6">
                    <p className="md:font-bold text-lg">{loggedInUser.name}</p>
                    <p className="text-sm"> {loggedInUser.userType}</p>
                </div>
            )} */}
            <div className="p-4 text-white mb-6">
                <p className="md:font-bold text-lg">{userName}</p>
                <p className="text-sm"> {userType ? ` (${userType})` : " (userType not set)"}</p>
            </div>
            <div className="flex flex-col space-y-4">
                <Link
                    to="/"
                    className="bg-[#242424] text-gray-300 rounded px-3 mr-2 h-7 text-sm grid place-items-center font-normal border border-gray-600 hover:bg-gray-700"
                >
                    Login Page
                </Link>
                <Link
                    to="/homepage"
                    className="bg-[#242424] text-gray-300 rounded px-3 mr-2 h-7 text-sm grid place-items-center font-normal border border-gray-600 hover:bg-gray-700"
                >
                    Home Page
                </Link>

                {userType === "Administrator" && (
                    <Link
                        to="/users"
                        className="bg-[#242424] text-gray-300 rounded px-3 mr-2 h-7 text-sm grid place-items-center font-normal border border-gray-600 hover:bg-gray-700"
                    >
                        Users Page
                    </Link>
                )}

                {userType === "Administrator" && (
                    <Link
                        to="/admin"
                        className="bg-[#242424] text-gray-300 rounded px-3 mr-2 h-7 text-sm grid place-items-center font-normal border border-gray-600 hover:bg-gray-700"
                    >
                        Admin Page
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
