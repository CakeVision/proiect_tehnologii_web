import React, { useState, useEffect } from 'react';

interface Employee {
    id: string;
    name: string;
}

interface ManageEmployeesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (selectedEmployees: string[]) => void;
    creators: { id: string; name: string }[];
}

const ManageEmployeesModal = ({ isOpen, onClose, onSave, creators }: ManageEmployeesModalProps) => {
    if (!isOpen) return null;

    const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

    const handleSave = () => {
        onSave(selectedEmployees);
        onClose();
    };

    const handleEmployeeToggle = (employeeId: string) => {
        setSelectedEmployees(prev => {
            if (prev.includes(employeeId)) {
                return prev.filter(id => id !== employeeId);
            } else {
                return [...prev, employeeId];
            }
        });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-[#232323] rounded-lg p-6 max-w-2xl w-full mx-4 border order-gray-300">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-200">Manage Employees</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-200 hover:text-gray-100 bg-black border border-white px-2 py-1"
                    >
                        ✕
                    </button>
                </div>
                <div className="space-y-4">
                    <div className="max-h-96 overflow-y-auto">
                        {creators.map(employee => (
                            <div
                                key={employee.id}
                                className="flex items-center p-2 hover:bg-[#333333] rounded-md"
                            >
                                <input
                                    type="checkbox"
                                    id={`employee-${employee.id}`}
                                    checked={selectedEmployees.includes(employee.id)}
                                    onChange={() => handleEmployeeToggle(employee.id)}
                                    className="mr-3"
                                />
                                <label
                                    htmlFor={`employee-${employee.id}`}
                                    className="text-gray-200 cursor-pointer flex justify-between items-center w-full"
                                >
                                    <span>{employee.name}</span>
                                    <span className="text-gray-400">ID: {employee.id}</span>
                                </label>
                            </div>
                        ))}
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
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ManageEmployeesModal;
