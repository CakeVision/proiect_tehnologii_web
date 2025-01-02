import React, { useEffect, useState } from "react";

interface Task {
    taskId: number; // Ensure this matches the backend task ID structure
    title: string;
}

const HomePage: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("No token found. Please log in again.");
                }

                const response = await fetch("http://localhost:3000/tasks/allOwned", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Failed to fetch tasks: ${errorText}`);
                }

                const data = await response.json();
                setTasks(data.tasks || []); // Ensure `data.tasks` exists and is an array
            } catch (err: any) {
                setError(err.message || "An error occurred while fetching tasks.");
            }
        };

        fetchTasks();
    }, []);

    if (error) {
        return <p style={{ color: "red", padding: "20px" }}>{error}</p>;
    }

    return (
        <div style={{ padding: "20px" }}>
            <h1>Your Tasks</h1>
            {tasks.length > 0 ? (
                <ul>
                    {tasks.map((task) => (
                        <li key={task.taskId}>
                            <strong>{task.title}</strong>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No tasks found.</p>
            )}
        </div>
    );
};

export default HomePage;
