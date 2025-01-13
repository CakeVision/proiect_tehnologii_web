import React, { useState, useEffect } from 'react';

interface Task {
    id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    deadline: string;
    idCreator: string;
    idExecutor: string;
}

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (newTask: Omit<Task, 'id'>) => void;
    creators: { id: string; name: string }[];
}

const CreateTaskModal = ({ isOpen, onClose, onSave, creators }: CreateTaskModalProps) => {
    if (!isOpen) return null;

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('TODO');
    const [priority, setPriority] = useState('Medium');
    const [deadline, setDeadline] = useState('');
    const [assignee, setAssignee] = useState('');
    
    const statuses = ['TODO', 'IN_PROGRESS', 'DONE', 'ARCHIVED'];
    const priorities = ['Low', 'Medium', 'High'];

    const handleSave = () => {
        const creatorId = localStorage.getItem('userId') || '';
        const newTask = {
            title,
            description,
            status,
            priority,
            deadline,
            idCreator: creatorId,
            idExecutor: assignee // This is already the ID from the select value
        };
        onSave(newTask);
        onClose();
    };

    const renderField = (label: string, content: React.ReactNode) => (
        <>
            <div className="font-semibold text-gray-200">{label}:</div>
            <div className="text-gray-300">{content}</div>
        </>
    );

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-[#232323] rounded-lg p-6 max-w-full w-auto mx-4 border border-gray-300">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-200">Create New Task</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-200 hover:text-gray-100 bg-black border border-white"
                    >
                        ✕
                    </button>
                </div>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                        {renderField("Title",
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-2 py-1 bg-[#333333] focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        )}

                        {renderField("Description",
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-2 py-1 bg-[#333333] focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={3}
                            />
                        )}

                        {renderField("Status",
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-2 py-1 bg-[#333333] focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {statuses.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        )}

                        {renderField("Priority",
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-2 py-1 bg-[#333333] focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {priorities.map(p => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        )}

                        {renderField("Deadline",
                            <input
                                type="datetime-local"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-2 py-1 bg-[#333333] focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        )}

                        {renderField("Assignee",
                            <select
                                value={assignee}
                                onChange={(e) => setAssignee(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-2 py-1 bg-[#333333] focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Assignee</option>
                                {creators.map(creator => (
                                    <option key={creator.id} value={creator.id}>
                                        {creator.name} (ID: {creator.id})
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                        Create Task
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateTaskModal;