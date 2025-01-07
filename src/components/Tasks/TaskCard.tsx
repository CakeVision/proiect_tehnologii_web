import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { TaskCardProps } from '../types';

export const TaskCard: React.FC<TaskCardProps> = ({ task, viewType, onToggleComplete }) => {
        if (viewType === "list") {
                return (
                        <li className="border-b border-gray-200 last:border-b-0 bg-white">
                                <div className="flex items-center gap-4 py-3 px-4 hover:bg-gray-50 transition-colors">
                                        <Checkbox
                                                checked={task.completed}
                                                onCheckedChange={() => onToggleComplete?.(task.id)}
                                                className="h-5 w-5"
                                        />
                                        <div className="flex-grow">
                                                <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                                                <p className="text-sm text-gray-500">Assigned to: {task.idCreator}</p>
                                        </div>
                                </div>
                        </li>
                );
        }

        return (
                <li className="h-full">
                        <Card className="h-full">
                                <CardContent className="pt-6">
                                        <div className="flex flex-col gap-4 ">
                                                <div className="flex items-center justify-between">
                                                        <Checkbox
                                                                checked={task.completed}
                                                                onCheckedChange={() => onToggleComplete?.(task.id)}
                                                                className="h-5 w-5 mt-1"
                                                        />
                                                        <div className="flex-grow">
                                                                <h3 className="text-lg font-medium text-gray-900 line-clamp-2">{task.title}</h3>
                                                                <p className="text-sm text-gray-500 mt-1">Assigned to: {task.idCreator}</p>
                                                        </div>

                                                </div>
                                        </div>
                                </CardContent>
                        </Card>
                </li>
        );
};
