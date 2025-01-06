import React from "react";
import { TaskListProps } from "../types";
import { TaskCard } from "./TaskCard";

export const TaskList: React.FC<TaskListProps> = ({ tasks, viewType, error, onToggleComplete }) => (
        <div className="max-w-screen-xl mx-auto p-4">
                <h2 className="text-2xl font-bold mb-6">Assigned Tasks</h2>

                {error && (
                        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4">
                                {error}
                        </div>
                )}

                {tasks.length === 0 && !error && (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                                <p className="text-gray-500">No tasks found matching your criteria.</p>
                        </div>
                )}

                <ul className={
                        viewType === "grid"
                                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                                : "divide-y divide-gray-200 bg-white rounded-lg shadow"
                }>
                        {tasks.map((task) => (
                                <TaskCard
                                        key={task.id}
                                        task={task}
                                        viewType={viewType}
                                        onToggleComplete={onToggleComplete}
                                />
                        ))}
                </ul>
        </div>
);
