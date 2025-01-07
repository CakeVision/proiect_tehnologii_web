import React from 'react';
import ViewToggleButton from '../common/ViewToggleButton';
import CreatorFilterDropdown from "../common/CreatorFilterDropdown";
import SearchBar from '../common/SearchBar';

export interface ContentHeaderProps {
        viewType: "list" | "grid";
        userTypeFilter: string;
        filter: string;
        searchQuery: string;
        onViewToggle: (viewType: "list" | "grid") => void;
        onUserTypeChange: (value: string) => void;
        onFilterChange: (value: string) => void;
        onSearchChange: (value: string) => void;
        creatorFilter: string;
        onCreatorFilterChange: (value: string) => void;
        creators: { id: string; name: string }[];
        totalTasks: number; // Total number of tasks
        userTasks: number;  // Number of tasks for the selected user
        activeTasks: number; // Number of active tasks
}

const ContentHeader: React.FC<ContentHeaderProps> = ({
        viewType,
        //   userTypeFilter,
        filter,
        creatorFilter,
        searchQuery,
        onViewToggle,
        //       onUserTypeChange,
        onFilterChange,
        onCreatorFilterChange,
        onSearchChange,
        creators,
        totalTasks,
        userTasks,
        activeTasks,
}) => (
        <div className="w-full px-6 mt-[5vh]">
                <div className="max-w-screen-xl mx-auto">
                        <div className="mb-8">
                                <h1 className="text-2xl font-bold text-gray-300 dark:text-gray-200">Task Management</h1>
                                <p className="text-sm text-gray-300 dark:text-gray-400 mt-1">Manage and track your team's tasks</p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                                {/* Header Content */}
                                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-300">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                                {/* Left side stats/info */}
                                                <div className="flex items-center gap-4">
                                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                                                <span className="font-medium">Total Tasks: </span>{totalTasks}
                                                        </div>
                                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                                                <span className="font-medium">User Tasks:</span>{userTasks}
                                                        </div>
                                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                                                <span className="font-medium">Active Tasks:</span>{activeTasks}
                                                        </div>
                                                </div>

                                                {/* Right side controls */}
                                                <div className="flex flex-wrap items-center gap-3 ml-auto">
                                                        <ViewToggleButton viewType={viewType} onToggle={onViewToggle} />

                                                        <CreatorFilterDropdown
                                                                value={creatorFilter}
                                                                onChange={onCreatorFilterChange}
                                                                creators={creators}
                                                        />

                                                        <SearchBar
                                                                searchQuery={searchQuery}
                                                                onSearchChange={onSearchChange}
                                                        />
                                                </div>
                                        </div>
                                </div>
                        </div>
                </div>
        </div>
);

export default ContentHeader;
