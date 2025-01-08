import React, { useEffect, useState } from "react";
import { Task } from "../components/types";
import ContentHeader from "../components/Tasks/TaskContentHeader";
import { TaskList } from "@/components/Tasks/TaskList";
import Sidebar from "@/components/sidebar/Sidebar";

const backend_url = import.meta.env.BACKEND_URL

const HomePage: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filter, setFilter] = useState<string>("all");
    const [viewType, setViewType] = useState<"list" | "grid">("list");
    const [userTypeFilter, setUserTypeFilter] = useState<string>("all");
    const [creatorFilter, setCreatorFilter] = useState<string>("all");
    const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
    const [checkedTasks, setCheckedTasks] = useState<Set<string>>(new Set());

    useEffect(() => {
        const fetchTasks = async () => {
            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) {
                setError("User is not logged in.");
                return;
            }

            try {
                const response = await fetch(backend_url + "/tasks/allOwned", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${refreshToken}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch tasks");
                }

                const data = await response.json();
                setTasks(data);
            } catch (err: any) {
                setError(err.message || "An error occurred while fetching tasks.");
            }
        };


        fetchTasks();
    }, []);

    useEffect(() => {
        // Fetch users
        const fetchUsers = async () => {
            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) {
                setError("User is not logged in.");
                return;
            }

            try {
                const response = await fetch(backend_url + "/users/", {
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
                setUsers(
                    data.map((user: any) => ({
                        id: user.id.toString(),
                        name: user.name,
                    }))
                );
            } catch (err: any) {
                setError(err.message || "An error occurred while fetching users.");
            }
        };

        fetchUsers();
    }, []);

    const handleCheckboxChange = (taskId: string) => {
        setCheckedTasks((prevCheckedTasks) => {
            const updatedCheckedTasks = new Set(prevCheckedTasks);
            if (updatedCheckedTasks.has(taskId)) {
                updatedCheckedTasks.delete(taskId);
            } else {
                updatedCheckedTasks.add(taskId);
            }
            return updatedCheckedTasks;
        });
    };



    const filteredTasks = tasks.filter((task) => {
        if (filter !== "all" && task.idCreator.toString() !== filter) return false;
        if (creatorFilter !== "all" && task.idCreator.toString() !== creatorFilter) return false;
        return task.title.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const tasksForSelectedUser = creatorFilter === "all" ? tasks.length : tasks.filter(task => task.idCreator.toString() === creatorFilter).length;
    const activeTasksCount = checkedTasks.size;

    return (
        <div className="flex min-h-screen bg-gray-600">
            <Sidebar />
            <div className="w-full m-0">
                <ContentHeader
                    viewType={viewType}
                    userTypeFilter={userTypeFilter}
                    filter={filter}
                    creatorFilter={creatorFilter}
                    searchQuery={searchQuery}
                    onViewToggle={setViewType}
                    onUserTypeChange={setUserTypeFilter}
                    onFilterChange={setFilter}
                    onCreatorFilterChange={setCreatorFilter}
                    onSearchChange={setSearchQuery}
                    creators={users}
                    totalTasks={tasks.length}
                    userTasks={tasksForSelectedUser}
                    activeTasks={activeTasksCount}
                />
                <TaskList
                    tasks={filteredTasks}
                    viewType={viewType}
                    error={error}
                    onToggleComplete={handleCheckboxChange}
                />
            </div>
        </div>
    );
};

export default HomePage;
