import React, { useEffect, useState } from "react";
import { Task } from "../components/types";
import ContentHeader from "../components/Tasks/TaskContentHeader";
import { TaskList } from "@/components/Tasks/TaskList";

const HomePage: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filter, setFilter] = useState<string>("all");
    const [viewType, setViewType] = useState<"list" | "grid">("list");
    const [userTypeFilter, setUserTypeFilter] = useState<string>("all");

    useEffect(() => {
        const fetchTasks = async () => {
            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) {
                setError("User is not logged in.");
                return;
            }

            try {
                const response = await fetch("http://localhost:3000/tasks/allOwned", {
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

    const filteredTasks = tasks.filter((task) => {
        if (filter !== "all" && task.idCreator.toString() !== filter) return false;
        return task.title.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (

        <div className="w-full m-0">
            <ContentHeader
                viewType={viewType}
                userTypeFilter={userTypeFilter}
                filter={filter}
                searchQuery={searchQuery}
                onViewToggle={setViewType}
                onUserTypeChange={setUserTypeFilter}
                onFilterChange={setFilter}
                onSearchChange={setSearchQuery}
            />
            <TaskList
                tasks={filteredTasks}
                viewType={viewType}
                error={error}
            />
        </div>
        // <div style={{ width: "100%", margin: "0" }}>
        //     {/* Top Navbar */}
        //     <div
        //         style={{
        //             display: "flex",
        //             justifyContent: "flex-end",
        //             alignItems: "center",
        //             backgroundColor: "#242424",
        //             borderBottom: "1px solid #444",
        //             color: "#fff",
        //             padding: "10px 20px",
        //             borderRadius: "5px",
        //         }}
        //     >

        //         {/* View Toggle Button */}
        //         <button
        //             onClick={() =>
        //                 setViewType((prev) => (prev === "list" ? "grid" : "list"))
        //             }
        //             style={{
        //                 backgroundColor: "#242424",
        //                 color: "#ddd",
        //                 borderRadius: "5px",
        //                 marginRight: "10px",
        //                 cursor: "pointer",
        //                 height: "28px",
        //                 fontSize: "14px",
        //                 display: "flex",
        //                 alignItems: "center",
        //                 fontWeight: "regular",
        //                 border: "1px solid #555",
        //             }}
        //         >
        //             {viewType === "list" ? "Grid View" : "List View"}
        //         </button>

        //         {/* Filter Dropdown */}
        //         <div style={{ position: "relative" }}>
        //             <select
        //                 value={userTypeFilter}
        //                 onChange={(e) => setUserTypeFilter(e.target.value)}
        //                 style={{
        //                     backgroundColor: "#242424",
        //                     color: "#ddd",
        //                     borderRadius: "5px",
        //                     marginRight: "10px",
        //                     padding: "5px 15px",
        //                     cursor: "pointer",
        //                     border: "1px solid #555",
        //                 }}
        //             >
        //                 <option value="all">Administrator</option>
        //                 {/* Add more filters dynamically if needed */}
        //                 <option value="1">Manager</option>
        //                 <option value="2">User</option>
        //             </select>
        //         </div>

        //         {/* Filter Dropdown */}
        //         <div style={{ position: "relative" }}>
        //             <select
        //                 value={filter}
        //                 onChange={(e) => setFilter(e.target.value)}
        //                 style={{
        //                     backgroundColor: "#242424",
        //                     color: "#ddd",
        //                     borderRadius: "5px",
        //                     padding: "5px 15px",
        //                     cursor: "pointer",
        //                     border: "1px solid #555",
        //                 }}
        //             >
        //                 <option value="all">All Tasks</option>
        //                 {/* Add more filters dynamically if needed */}
        //                 <option value="1">Creator 1</option>
        //                 <option value="2">Creator 2</option>
        //             </select>
        //         </div>

        //         {/* Search Bar */}
        //         <div
        //             style={{
        //                 display: "flex",
        //                 alignItems: "center",
        //                 padding: "5px 10px",
        //                 marginRight: "10px",
        //             }}
        //         >
        //             <input
        //                 type="text"
        //                 placeholder="Search tasks..."
        //                 value={searchQuery}
        //                 onChange={(e) => setSearchQuery(e.target.value)}
        //                 style={{
        //                     outline: "none",
        //                     borderRadius: "5px",
        //                     padding: "5px 10px",
        //                     backgroundColor: "#242424",
        //                     border: "1px solid #555",
        //                 }}
        //             />
        //             <span
        //                 style={{
        //                     color: "#007bff",
        //                     cursor: "pointer",
        //                     padding: "5px",
        //                 }}
        //             >
        //                 🔍
        //             </span>
        //         </div>
        //     </div>

        //     {/* Task List */}
        //     <div style={{ maxWidth: "300px", margin: "auto", padding: "20px" }}>
        //         <h2>Assigned Tasks</h2>
        //         {error && <p style={{ color: "red" }}>{error}</p>}
        //         {/* {tasks.length === 0 && !error && <p>No tasks assigned.</p>} */}
        //         {filteredTasks.length === 0 && !error && <p>No tasks found matching your criteria.</p>}

        //         {/* <ul style={{ listStyleType: "none", padding: 0 }}>
        //             {tasks.map((task) => (
        //                 <li
        //                     key={task.id}
        //                     style={{
        //                         border: "1px solid #ddd",
        //                         padding: "10px",
        //                         marginBottom: "10px",
        //                         borderRadius: "5px",
        //                     }}
        //                 >
        //                     <h3>{task.title}</h3>
        //                     <p><strong>Created By:</strong> {task.idCreator}</p>
        //                     <p><strong>Created At:</strong> {new Date(task.createdAt).toLocaleString()}</p>
        //                     <p><strong>Updated At:</strong> {new Date(task.updatedAt).toLocaleString()}</p>
        //                 </li>
        //             ))}
        //         </ul> */}

        //         <ul
        //             style={{
        //                 listStyleType: "none",
        //                 padding: 0,
        //                 display: viewType === "grid" ? "grid" : "block",
        //                 gridTemplateColumns: viewType === "grid" ? "repeat(auto-fit, minmax(200px, 1fr))" : undefined,
        //                 gap: viewType === "grid" ? "10px" : undefined,
        //             }}
        //         >
        //             {filteredTasks.map((task) => (
        //                 <li
        //                     key={task.id}
        //                     style={{
        //                         border: "1px solid #ddd",
        //                         padding: "10px",
        //                         marginBottom: viewType === "list" ? "10px" : "0",
        //                         borderRadius: "5px",
        //                     }}
        //                 >
        //                     <h3>{task.title}</h3>
        //                     <p>
        //                         <strong>Created By:</strong> {task.idCreator}
        //                     </p>
        //                     <p>
        //                         <strong>Created At:</strong>{" "}
        //                         {new Date(task.createdAt).toLocaleString()}
        //                     </p>
        //                     <p>
        //                         <strong>Updated At:</strong>{" "}
        //                         {new Date(task.updatedAt).toLocaleString()}
        //                     </p>
        //                 </li>
        //             ))}
        //         </ul>
        //     </div>
        // </div>
    );
};

export default HomePage;
