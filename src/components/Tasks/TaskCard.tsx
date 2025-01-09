import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { TaskCardProps } from '../types';

export const TaskCard: React.FC<TaskCardProps> = ({ task, viewType, onToggleComplete }) => {
        if (viewType === "list") {
                return (
                        <li className="w-2/3 mx-auto border border-white bg-[#2C2C2C] rounded-lg">
                                <div className="flex items-center gap-4 py-4 px-4">
                                        <Checkbox
                                                checked={task.completed}
                                                onCheckedChange={() => onToggleComplete?.(task.id)}
                                                className="h-5 w-5"
                                        />
                                        <div className="flex-grow">
                                                <h3 className="text-lg font-medium text-white">{task.title}</h3>
                                                <p className="text-sm text-gray-300">Assigned to: {task.idCreator}</p>
                                        </div>
                                </div>
                        </li>
                );
        }

        return (
                <li className="h-full">
                        <Card className="h-full" >
                                <CardContent className="pt-6 border border-white bg-[#2C2C2C] rounded-lg">
                                        <div className="flex flex-col gap-4">
                                                <div className="flex items-center justify-between">
                                                        <Checkbox
                                                                checked={task.completed}
                                                                onCheckedChange={() => onToggleComplete?.(task.id)}
                                                                className="h-5 w-5 mt-1"
                                                        />
                                                        <div className="flex-grow text-center">
                                                                <h3 className="text-lg font-medium text-white line-clamp-2">{task.title}</h3>
                                                                <p className="text-sm text-gray-300 mt-1">Assigned to: {task.idCreator}</p>
                                                        </div>

                                                </div>
                                        </div>
                                </CardContent>
                        </Card>
                </li >
        );
};
