export interface Task {
        id: string;
        title: string;
        idCreator: string;
        createdAt: string;
        updatedAt: string;
        completed?: boolean;
}
export interface TaskCardProps {
        task: Task;
        viewType: "list" | "grid";
        onToggleComplete?: (id: string) => void;
}

export interface TaskListProps {
        tasks: Task[];
        viewType: "list" | "grid";
        error: string | null;
        onToggleComplete?: (id: string) => void;
}


