import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { TaskCardProps } from '../types';

export const TaskCard: React.FC<TaskCardProps> = ({ 
    task, 
    viewType, 
    onToggleComplete, 
    onTaskClick 
}) => {
    const handleClick = (e: React.MouseEvent) => {
        // Prevent modal from opening when clicking checkbox
        if ((e.target as HTMLElement).closest('.checkbox-area')) {
            return;
        }
        onTaskClick(task);
    };

    // Check if task is completed based on status
    const isCompleted = task.status === 'Completed';

    if (viewType === "list") {
        return (
            <li 
                className="w-2/3 mx-auto border border-white bg-[#2C2C2C] rounded-lg cursor-pointer hover:bg-[#363636] transition-colors"
                onClick={handleClick}
            >
                <div className="flex items-center gap-4 py-4 px-4">
                    <div className="checkbox-area">
                        <Checkbox
                            checked={isCompleted}
                            onCheckedChange={() => onToggleComplete?.(task.id)}
                            className="h-5 w-5"
                        />
                    </div>
                    <div className="flex-grow">
                        <h3 className="text-lg font-medium text-white">{task.title}</h3>
                        <p className="text-sm text-gray-300">Assigned to: {task.idCreator}</p>
                        <div className="flex items-center gap-2 mt-2">
                            <span className={`text-xs px-2 py-1 rounded ${
                                task.priority === 'High' ? 'bg-red-500' :
                                task.priority === 'Medium' ? 'bg-yellow-500' :
                                'bg-green-500'
                            }`}>
                                {task.priority}
                            </span>
                            <span className="text-xs text-gray-400">
                                Due: {new Date(task.deadline).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>
            </li>
        );
    }

    return (
        <li className="h-full">
            <Card 
                className="h-full cursor-pointer hover:bg-[#363636] transition-colors" 
                onClick={handleClick}
            >
                <CardContent className="pt-6 border border-white bg-[#2C2C2C] rounded-lg">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-start justify-between">
                            <div className="checkbox-area">
                                <Checkbox
                                    checked={isCompleted}
                                    onCheckedChange={() => onToggleComplete?.(task.id)}
                                    className="h-5 w-5 mt-1"
                                />
                            </div>
                            <div className="flex-grow text-center">
                                <h3 className="text-lg font-medium text-white line-clamp-2">{task.title}</h3>
                                <p className="text-sm text-gray-300 mt-1">Assigned to: {task.idCreator}</p>
                                <div className="flex items-center justify-center gap-2 mt-2">
                                    <span className={`text-xs px-2 py-1 rounded ${
                                        task.priority === 'High' ? 'bg-red-500' :
                                        task.priority === 'Medium' ? 'bg-yellow-500' :
                                        'bg-green-500'
                                    }`}>
                                        {task.priority}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        Due: {new Date(task.deadline).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </li>
    );
};

export default TaskCard;