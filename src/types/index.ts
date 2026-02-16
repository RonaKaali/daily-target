export type Priority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'Todo' | 'In Progress' | 'Completed';

export interface SubTask {
    id: string;
    title: string;
    completed: boolean;
}

export interface Task {
    id: string;
    title: string;
    status: TaskStatus;
    priority: Priority;
    category: string;
    xpValue: number;
    createdAt: Date;
    completedAt?: Date;
    dueDate?: Date;
    subTasks: SubTask[];
    tags?: string[];
    relatedEventId?: string;
}

export interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    category: string;
    description?: string;
    status: TaskStatus;
    relatedTaskId?: string;
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlockedAt?: Date;
    category: 'productivity' | 'streak' | 'social' | 'special';
}

export interface UserStats {
    level: number;
    xp: number;
    xpToNextLevel: number;
    tasksCompleted: number;
    streak: number;
    badges: Badge[];
    totalXp: number;
}

export interface AppState {
    tasks: Task[];
    events: CalendarEvent[];
    userStats: UserStats;
    theme: 'light' | 'dark';
    language: string;
}
