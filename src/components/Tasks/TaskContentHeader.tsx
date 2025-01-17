import React, { useState } from 'react';
import ViewToggleButton from '../common/ViewToggleButton';
import CreatorFilterDropdown from "../common/CreatorFilterDropdown";
import SearchBar from '../common/SearchBar';
import ManageEmployeesModal from '../../homepage/ManagerEmployeeModal';

export interface ContentHeaderProps {
    viewType: "list" | "grid";
    userType: string | null;
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
    totalTasks: number;
    userTasks: number;
    activeTasks: number;
    onBurgerClick: () => void;
    onCreateTask: () => void;
    onManageEmployees?: (selectedEmployees: string[]) => void;
}

const ContentHeader: React.FC<ContentHeaderProps> = ({
    viewType,
    userType,
    filter,
    creatorFilter,
    searchQuery,
    onViewToggle,
    onFilterChange,
    onCreatorFilterChange,
    onSearchChange,
    creators,
    totalTasks,
    userTasks,
    activeTasks,
    onBurgerClick,
    onCreateTask,
    onManageEmployees,
}) => {
    const [isManageModalOpen, setIsManageModalOpen] = useState(false);

    const handleManageEmployees = (selectedEmployees: string[]) => {
        if (onManageEmployees) {
            onManageEmployees(selectedEmployees);
        }
    };

    //FIXME: PENTRU DEBUG AM PUS CA BUTONUL SA SE VADA SI PENTRU ADMINI
    //DA REMOVE LA LINIA 87 LA || 'Administrator' ca sa faci sa apara doar pentru manageri
    return (
        <div className="w-full">
            <div className="max-w-screen mx-auto">
                <div className="rounded-lg shadow">
                    <div className="p-4 bg-[#121212]">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <button
                                className="text-white bg-[#121212]"
                                onClick={onBurgerClick}
                                aria-label="Toggle Sidebar"
                            >
                                ☰
                            </button>
                            <div className="flex items-center gap-4">
                                <div className="text-sm text-gray-200">
                                    <span className="font-medium">Total Tasks: </span>{totalTasks}
                                </div>
                                <div className="text-sm text-gray-200">
                                    <span className="font-medium">User Tasks: </span>{userTasks}
                                </div>
                                <div className="text-sm text-gray-200">
                                    <span className="font-medium">Active Tasks: </span>{activeTasks}
                                </div>
                                {(userType === "Administrator" || userType === "Manager") && (
                                    <button
                                        onClick={onCreateTask}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                                    >
                                        Create Task
                                    </button>
                                )}
                                {(userType === "Manager") && (
                                    <button
                                        onClick={() => setIsManageModalOpen(true)}
                                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                                    >
                                        Manage Employees
                                    </button>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center gap-3 ml-auto">
                                <ViewToggleButton viewType={viewType} onToggle={onViewToggle} />

                                {userType === "Administrator" && (
                                    <CreatorFilterDropdown
                                        value={creatorFilter}
                                        onChange={onCreatorFilterChange}
                                        creators={creators}
                                    />
                                )}

                                <SearchBar
                                    searchQuery={searchQuery}
                                    onSearchChange={onSearchChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ManageEmployeesModal
                isOpen={isManageModalOpen}
                onClose={() => setIsManageModalOpen(false)}
                onSave={handleManageEmployees}
                creators={creators}
            />
        </div>
    );
};

export default ContentHeader;
