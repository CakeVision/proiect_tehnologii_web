import React from "react";

interface CreatorFilterDropdownProps {
    value: string;
    onChange: (value: string) => void;
    creators: { id: string; name: string }[];
}

const CreatorFilterDropdown: React.FC<CreatorFilterDropdownProps> = ({
    value,
    onChange,
    creators,
}) => {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="bg-[#242424] text-gray-300 rounded px-3 mr-2 h-7 text-sm flex items-center font-normal border border-gray-600 hover:bg-gray-700"
        >
            <option value="all">All Tasks</option>
            {creators.map((creator) => (
                <option key={creator.id} value={creator.id}>
                    {creator.name}
                </option>
            ))}
        </select>
    );
};

export default CreatorFilterDropdown;
