import React, { useState } from 'react';

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

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    task: Task | null;
    onSave: (updatedTask: Task) => void;
    onDelete: (task: Task) => void;
}

const TaskModal = ({ isOpen, onClose, task, onSave, onDelete }: TaskModalProps) => {
    if (!isOpen || !task) return null;

    const [editedTitle, setEditedTitle] = useState(task.title);
    const [editedDescription, setEditedDescription] = useState(task.description);
    const [editedStatus, setEditedStatus] = useState(task.status);
    const [editedPriority, setEditedPriority] = useState(task.priority);
    const [editedDeadline, setEditedDeadline] = useState(task.deadline);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteConfirmTitle, setDeleteConfirmTitle] = useState('');

    const statuses = ['Not Started', 'In Progress', 'Completed'];
    const priorities = ['Low', 'Medium', 'High'];

    const isDeleteEnabled = deleteConfirmTitle === task.title;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-[#232323] rounded-lg p-6 max-w-full w-auto mx-4 border border-gray-300">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-200">Task Details</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-200 hover:text-gray-100 bg-black border border-white"
                    >
                        ✕
                    </button>
                </div>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                        <div className="font-semibold text-gray-200">Title:</div>
                        <div className="text-gray-300">
                            <input
                                type="text"
                                value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-2 py-1 bg-[#333333] focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="font-semibold text-gray-200">Description:</div>
                        <div className="text-gray-300">
                            <textarea
                                value={editedDescription}
                                onChange={(e) => setEditedDescription(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-2 py-1 bg-[#333333] focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={3}
                            />
                        </div>

                        <div className="font-semibold text-gray-200">Status:</div>
                        <div className="text-gray-300">
                            <select
                                value={editedStatus}
                                onChange={(e) => setEditedStatus(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-2 py-1 bg-[#333333] focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {statuses.map(status => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="font-semibold text-gray-200">Priority:</div>
                        <div className="text-gray-300">
                            <select
                                value={editedPriority}
                                onChange={(e) => setEditedPriority(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-2 py-1 bg-[#333333] focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {priorities.map(priority => (
                                    <option key={priority} value={priority}>
                                        {priority}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="font-semibold text-gray-200">Deadline:</div>
                        <div className="text-gray-300">
                            <input
                                type="datetime-local"
                                value={editedDeadline}
                                onChange={(e) => setEditedDeadline(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-2 py-1 bg-[#333333] focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="font-semibold text-gray-200">ID:</div>
                        <div className="text-gray-300">{task.id}</div>
                    </div>

                    {showDeleteConfirm && (
                        <div className="mt-4 p-4 bg-[#232323] rounded-md border border-gray-300">
                            <p className="text-sm text-red-600 mb-2">
                                To delete this task, please type its title to confirm:
                            </p>
                            <input
                                type="text"
                                value={deleteConfirmTitle}
                                onChange={(e) => setDeleteConfirmTitle(e.target.value)}
                                placeholder="Enter task title to confirm delete"
                                className="w-full border border-red-300 rounded-md px-2 py-1 bg-[#333333] focus:outline-none focus:ring-2 focus:ring-red-500 mb-2"
                            />
                            <button
                                onClick={() => {
                                    if (isDeleteEnabled) {
                                        onDelete(task);
                                        onClose();
                                    }
                                }}
                                disabled={!isDeleteEnabled}
                                className={`w-full px-4 py-2 rounded-md text-white transition-colors ${isDeleteEnabled
                                    ? 'bg-red-500 hover:bg-red-600'
                                    : 'bg-red-300 cursor-not-allowed'
                                    }`}
                            >
                                Delete Task
                            </button>
                        </div>
                    )}
                </div>
                <div className="mt-6 flex justify-end space-x-2">
                    {!showDeleteConfirm && (
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                        >
                            Delete
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            const updatedTask = {
                                ...task,
                                title: editedTitle,
                                description: editedDescription,
                                status: editedStatus,
                                priority: editedPriority,
                                deadline: editedDeadline
                            };
                            onSave(updatedTask);
                        }}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskModal;