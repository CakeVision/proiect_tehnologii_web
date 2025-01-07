import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "@/components/sidebar/Sidebar";

const AdminPage: React.FC = () => {

    return (
        <div className="flex min-h-screen bg-gray-600">
            <Sidebar />
        </div>
    );
};

export default AdminPage;
