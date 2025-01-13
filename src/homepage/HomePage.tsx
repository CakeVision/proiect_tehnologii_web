import React, { useEffect, useState } from "react";
import { Task } from "../components/types";
import ContentHeader from "../components/Tasks/TaskContentHeader";
import { TaskList } from "@/components/Tasks/TaskList";
import Sidebar from "@/components/sidebar/Sidebar";
import TaskModal from "@/homepage/TaskModal";
import debug from "debug";

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
    const [userType, setUserType] = useState<string | null>(null);
    const [sidebarVisible, setSidebarVisible] = useState<boolean>(false);
    const [managedUsers, setManagedUsers] = useState<string[]>([]);
    // New state for TaskModal
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const baseApiURL = "https://proiecttehnologiiweb-production.up.railway.app";

    useEffect(() => {
        const storedUserType = localStorage.getItem("userType");
        debug.log(storedUserType);
        if (storedUserType)
            setUserType(storedUserType);
    }, []);

    //This is for managers only
    useEffect(() => {
        const fetchManagedUsers = async () => {
            const refreshToken = localStorage.getItem("refreshToken");
            const userId = localStorage.getItem("userId");
            if (userType !== "Manager" || !refreshToken || !userId) return;

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
                    throw new Error("Failed to fetch managed users.");
                }

                const data = await response.json();
                const managedUserIds = data.result.map((user: any) => user.id.toString());
                console.log("Managed users:", managedUserIds);
                setManagedUsers(managedUserIds);
            } catch (err: any) {
                setError(err.message || "An error occurred while fetching managed users.");
            }
        };

        fetchManagedUsers();
    }, [userType]);

    useEffect(() => {
        const fetchTasks = async () => {
            const refreshToken = localStorage.getItem("refreshToken");
            const storedUserType = localStorage.getItem("userType");
            const userId = localStorage.getItem("userId");
            if (!refreshToken) {
                setError("User is not logged in.");
                return;
            }

            try {
                let filteredTasks = [];
                if (storedUserType === "Administrator") {
                    const response = await fetch(baseApiURL + "/tasks/all", {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${refreshToken}`,
                            "Access-Control-Allow-Origin": "*",
                        },
                    });

                    if (!response.ok) {
                        throw new Error("Failed to fetch tasks");
                    }

                    const data = await response.json();
                    filteredTasks = data;
                }
                else if (storedUserType === "Executor") {
                    const response = await fetch(baseApiURL + `/tasks/allOwned/${userId}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${refreshToken}`,
                            "Access-Control-Allow-Origin": "*",
                        },
                    });

                    if (!response.ok) {
                        throw new Error("Failed to fetch tasks");
                    }

                    const data = await response.json();
                    filteredTasks = data;
                }
                else if (storedUserType === "Manager") {
                    const response = await fetch(baseApiURL +  `/tasks/allOwned/${userId}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${refreshToken}`,
                            "Access-Control-Allow-Origin": "*",
                        },
                    });

                    if (!response.ok) {
                        throw new Error("Failed to fetch tasks.");
                    }

                    const data = await response.json();
                    filteredTasks = data;
                    console.log(filteredTasks);
                }
                setTasks(filteredTasks);
            } catch (err: any) {
                setError(err.message || "An error occurred while fetching tasks.");
            }
        };
        if (userType) fetchTasks();
    }, [userType, managedUsers]);

    useEffect(() => {
        const fetchUsers = async () => {
            const refreshToken = localStorage.getItem("refreshToken");
            const userType = localStorage.getItem("userType");
            if (!refreshToken) {
                setError("User is not logged in.");
                return;
            }

            if (userType !== "Administrator") {
                console.log("Non-administrator user. Skipping fetchUsers.");
                return;
            }

            try {
                const response = await fetch(baseApiURL + "/users/", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${refreshToken}`,
                        "Access-Control-Allow-Origin": "*",
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

    const handleTaskClick = (task: Task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setSelectedTask(null);
        setIsModalOpen(false);
    };

    const handleTaskSave = async (updatedTask: Task) => {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
            setError("User is not logged in.");
            return;
        }

        try {
            const response = await fetch(`${baseApiURL}/tasks/alter/${updatedTask.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${refreshToken}`,
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify(updatedTask),
            });

            if (!response.ok) {
                throw new Error("Failed to update task");
            }

            setTasks(tasks.map(task => 
                task.id === updatedTask.id ? updatedTask : task
            ));
            setIsModalOpen(false);
        } catch (err: any) {
            setError(err.message || "An error occurred while updating the task.");
        }
    };

    const handleTaskDelete = async (task: Task) => {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
            setError("User is not logged in.");
            return;
        }

        try {
            const response = await fetch(`${baseApiURL}/tasks/${task.id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${refreshToken}`,
                    "Access-Control-Allow-Origin": "*",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete task");
            }

            setTasks(tasks.filter(t => t.id !== task.id));
            setIsModalOpen(false);
        } catch (err: any) {
            setError(err.message || "An error occurred while deleting the task.");
        }
    };

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
        <div className="flex min-h-screen bg-[#1E1E1E]">
            {sidebarVisible && <Sidebar />}
            <div className="w-full m-0">
                <ContentHeader
                    viewType={viewType}
                    userType={userType}
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
                    onBurgerClick={() => setSidebarVisible(!sidebarVisible)}
                />
                <TaskList
                    tasks={filteredTasks}
                    viewType={viewType}
                    error={error}
                    onToggleComplete={handleCheckboxChange}
                    onTaskClick={handleTaskClick}
                />
                <TaskModal
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    task={selectedTask}
                    onSave={handleTaskSave}
                    onDelete={handleTaskDelete}
                />
            </div>
        </div>
    );
};

export default HomePage;