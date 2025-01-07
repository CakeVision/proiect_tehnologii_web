import React from "react";

interface SearchBarProps {
        searchQuery: string;
        onSearchChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, onSearchChange }) => (
        <div className="flex items-center px-2 mr-2">
                <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="bg-[#242424] text-gray-300 rounded px-2 h-7 border border-gray-600 outline-none"
                />
                <span className="text-blue-500 cursor-pointer p-1">🔍</span>
        </div>
);

export default SearchBar;
