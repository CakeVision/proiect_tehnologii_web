import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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

    return (
        <div className="w-48 bg-[#1E1E1E] text-white h-100 p-4 border-r-2 border-r-[#373737]">
            <div className=" text-white mb-10">
                <p className="md:font-bold text-lg">{userName}</p>
                <p className="text-sm"> {userType ? ` (${userType})` : " (userType not set)"}</p>
            </div>
            <div className="flex flex-col space-y-4">
                <Link
                    to="/"
                    className="bg-[#242424] text-gray-300 rounded px-3 mr-2 h-7 text-sm grid place-items-center font-normal border border-gray-600 hover:bg-gray-700 hover:text-gray-300"
                >
                    Login Page
                </Link>
                <Link
                    to="/homepage"
                    className="bg-[#242424] text-gray-300 rounded px-3 mr-2 h-7 text-sm grid place-items-center font-normal border border-gray-600 hover:bg-gray-700 hover:text-gray-300"
                >
                    Home Page
                </Link>

                {userType === "Administrator" && (
                    <Link
                        to="/users"
                        className="bg-[#242424] text-gray-300 rounded px-3 mr-2 h-7 text-sm grid place-items-center font-normal border border-gray-600 hover:bg-gray-700 hover:text-gray-300"
                    >
                        Users Page
                    </Link>
                )}
                {userType === "Manager" && (
                    <Link
                        to="/manager"
                        className="bg-[#242424] text-gray-300 rounded px-3 mr-2 h-7 text-sm grid place-items-center font-normal border border-gray-600 hover:bg-gray-700 hover:text-gray-300"
                    >
                        Manager Page
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
