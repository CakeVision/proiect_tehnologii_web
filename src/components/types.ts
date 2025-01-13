export interface Task {
        id: string;
        title: string;
        description: string;
        status: string;
        priority: string;
        deadline: string;
        idCreator: string;
        idExecutor: string;
    }
    
    export interface TaskListProps {
        tasks: Task[];
        viewType: "list" | "grid";
        error: string | null;
        onToggleComplete: (taskId: string) => void;
        onTaskClick: (task: Task) => void;
    }
    
    export interface TaskCardProps {
        task: Task;
        viewType: "list" | "grid";
        onToggleComplete: (taskId: string) => void;
        onTaskClick: (task: Task) => void;
    }