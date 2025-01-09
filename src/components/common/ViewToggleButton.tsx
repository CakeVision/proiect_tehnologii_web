import React from "react";

interface ViewToggleProps {
        viewType: "list" | "grid";
        onToggle: (viewType: "list" | "grid") => void;
}

const ViewToggleButton: React.FC<ViewToggleProps> = ({ viewType, onToggle }) => (
        <button
                onClick={() => onToggle(viewType === "list" ? "grid" : "list")}
                className="bg-[#242424] text-gray-300 rounded px-3 mr-2 h-7 text-sm flex items-center font-normal border border-gray-600 hover:bg-gray-700 hover:text-gray-300"
        >
                {viewType === "list" ? "Grid View" : "List View"}
        </button>
);
export default ViewToggleButton;
