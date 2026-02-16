"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, CalendarEvent, UserStats, AppState, Badge, SubTask } from '@/types';

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'success' | 'info' | 'warning' | 'level-up';
    timestamp: Date;
    read: boolean;
}

interface AppContextType extends AppState {
    addTask: (task: Omit<Task, 'id' | 'createdAt' | 'subTasks'> & { subTasks?: string[] }) => void;
    updateTask: (id: string, updates: Partial<Task>) => void;
    deleteTask: (id: string) => void;
    addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
    updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
    deleteEvent: (id: string) => void;
    updateStats: (xpGain: number) => void;
    toggleSubTask: (taskId: string, subTaskId: string) => void;
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
    markNotificationAsRead: (id: string) => void;
    clearNotifications: () => void;
    setSearchQuery: (query: string) => void;
    notifications: Notification[];
    searchQuery: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_BADGES: Badge[] = [
    { id: '1', name: 'First Step', description: 'Complete your first task', icon: '🎯', category: 'productivity' },
    { id: '2', name: 'Task Master', description: 'Complete 10 tasks', icon: '🔥', category: 'productivity' },
    { id: '3', name: 'Consistent', description: 'Maintain a 3-day streak', icon: '⚡', category: 'streak' },
    { id: '4', name: 'Focus Legend', description: 'Complete 5 focus sessions', icon: '🧠', category: 'special' },
];

const INITIAL_STATS: UserStats = {
    level: 1,
    xp: 0,
    xpToNextLevel: 1000,
    tasksCompleted: 0,
    streak: 0,
    badges: [],
    totalXp: 0,
};

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [userStats, setUserStats] = useState<UserStats>(INITIAL_STATS);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isMounted, setIsMounted] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const savedTasks = localStorage.getItem('tasks');
        const savedEvents = localStorage.getItem('events');
        const savedStats = localStorage.getItem('userStats');
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
        const savedNotifications = localStorage.getItem('notifications');

        if (savedTasks) {
            const parsed = JSON.parse(savedTasks);
            setTasks(parsed.map((t: any) => ({ ...t, createdAt: new Date(t.createdAt) })));
        }
        if (savedEvents) setEvents(JSON.parse(savedEvents).map((e: any) => ({ ...e, start: new Date(e.start), end: new Date(e.end) })));
        if (savedStats) setUserStats(JSON.parse(savedStats));
        if (savedNotifications) {
            const parsed = JSON.parse(savedNotifications);
            setNotifications(parsed.map((n: any) => ({ ...n, timestamp: new Date(n.timestamp) })));
        }
        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.classList.toggle('dark', savedTheme === 'dark');
        }

        setIsMounted(true);
    }, []);

    // Sync to localStorage on change
    useEffect(() => {
        if (!isMounted) return;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        localStorage.setItem('events', JSON.stringify(events));
        localStorage.setItem('userStats', JSON.stringify(userStats));
        localStorage.setItem('notifications', JSON.stringify(notifications));
        localStorage.setItem('theme', theme);
    }, [tasks, events, userStats, notifications, theme, isMounted]);

    const addTask = (taskData: any) => {
        const taskId = Math.random().toString(36).substr(2, 9);
        const subTasks: SubTask[] = (taskData.subTasks || []).map((title: string) => ({
            id: Math.random().toString(36).substr(2, 9),
            title,
            completed: false
        }));

        const newTask: Task = {
            ...taskData,
            id: taskId,
            createdAt: new Date(),
            subTasks,
            status: taskData.status || 'Todo',
            priority: taskData.priority || 'Medium',
            category: taskData.category || 'Personal',
            xpValue: taskData.xpValue || 50
        };

        // If task has a due date, create a corresponding calendar event
        if (newTask.dueDate && !newTask.relatedEventId) {
            const eventId = Math.random().toString(36).substr(2, 9);
            const start = new Date(newTask.dueDate);
            start.setHours(9, 0, 0, 0); // Default to 9 AM
            const end = new Date(start.getTime() + 60 * 60 * 1000);

            const newEvent: CalendarEvent = {
                id: eventId,
                title: newTask.title,
                start,
                end,
                category: newTask.category,
                status: newTask.status,
                relatedTaskId: taskId
            };
            newTask.relatedEventId = eventId;
            setEvents(prev => [...prev, newEvent]);
        }

        setTasks(prev => [...prev, newTask]);
    };

    const updateTask = (id: string, updates: Partial<Task>) => {
        setTasks(prev => prev.map(t => {
            if (t.id === id) {
                if (updates.status === 'Completed' && t.status !== 'Completed') {
                    updateStats(t.xpValue);
                }
                const updatedTask = { ...t, ...updates };

                // Sync to related event if exists
                if (updatedTask.relatedEventId) {
                    setEvents(prevEvents => prevEvents.map(e => {
                        if (e.id === updatedTask.relatedEventId) {
                            return {
                                ...e,
                                title: updatedTask.title,
                                status: updatedTask.status,
                                category: updatedTask.category
                            };
                        }
                        return e;
                    }));
                }
                return updatedTask;
            }
            return t;
        }));
    };

    const deleteTask = (id: string) => {
        const taskToDelete = tasks.find(t => t.id === id);
        if (taskToDelete?.relatedEventId) {
            setEvents(prev => prev.filter(e => e.id !== taskToDelete.relatedEventId));
        }
        setTasks(prev => prev.filter(t => t.id !== id));
    };

    const toggleSubTask = (taskId: string, subTaskId: string) => {
        setTasks(prev => prev.map(t => {
            if (t.id === taskId) {
                const newSubTasks = t.subTasks.map(st =>
                    st.id === subTaskId ? { ...st, completed: !st.completed } : st
                );
                return { ...t, subTasks: newSubTasks };
            }
            return t;
        }));
    };

    const addEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
        const eventId = Math.random().toString(36).substr(2, 9);
        const taskId = Math.random().toString(36).substr(2, 9);

        const newEvent: CalendarEvent = {
            ...eventData,
            id: eventId,
            status: eventData.status || 'Todo',
            relatedTaskId: taskId
        };

        // Create a corresponding task
        const newTask: Task = {
            id: taskId,
            title: newEvent.title,
            status: newEvent.status,
            priority: 'Medium',
            category: newEvent.category,
            xpValue: 100, // Events are high value
            createdAt: new Date(),
            dueDate: newEvent.start,
            subTasks: [],
            relatedEventId: eventId
        };

        setEvents(prev => [...prev, newEvent]);
        setTasks(prev => [...prev, newTask]);
    };

    const updateEvent = (id: string, updates: Partial<CalendarEvent>) => {
        setEvents(prev => prev.map(e => {
            if (e.id === id) {
                const updatedEvent = { ...e, ...updates };
                // Sync to task
                if (updatedEvent.relatedTaskId) {
                    setTasks(prevTasks => prevTasks.map(t => {
                        if (t.id === updatedEvent.relatedTaskId) {
                            // If status changed to completed, update stats
                            if (updates.status === 'Completed' && t.status !== 'Completed') {
                                updateStats(t.xpValue);
                            }
                            return {
                                ...t,
                                title: updatedEvent.title,
                                status: updatedEvent.status,
                                category: updatedEvent.category
                            };
                        }
                        return t;
                    }));
                }
                return updatedEvent;
            }
            return e;
        }));
    };

    const deleteEvent = (id: string) => {
        const eventToDelete = events.find(e => e.id === id);
        if (eventToDelete?.relatedTaskId) {
            setTasks(prev => prev.filter(t => t.id !== eventToDelete.relatedTaskId));
        }
        setEvents(prev => prev.filter(e => e.id !== id));
    };

    const addNotification = (n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
        const newNotification: Notification = {
            ...n,
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date(),
            read: false
        };
        setNotifications(prev => [newNotification, ...prev].slice(0, 20)); // Keep last 20
    };

    const markNotificationAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const clearNotifications = () => {
        setNotifications([]);
    };

    const updateStats = (xpGain: number) => {
        setUserStats(prev => {
            let newXp = prev.xp + xpGain;
            let newLevel = prev.level;
            let newXpToNextLevel = prev.xpToNextLevel;
            let newTasksCompleted = prev.tasksCompleted + 1;
            let newTotalXp = (prev.totalXp || 0) + xpGain;

            if (newXp >= newXpToNextLevel) {
                newLevel += 1;
                newXp -= newXpToNextLevel;
                newXpToNextLevel = Math.floor(newXpToNextLevel * 1.2);

                addNotification({
                    title: 'Level Up!',
                    message: `Congratulations! You reached Level ${newLevel}.`,
                    type: 'level-up'
                });
            }

            // Achievement logic
            const newBadges = [...prev.badges];

            // First Task Achievement
            if (newTasksCompleted === 1 && !newBadges.find(b => b.id === '1')) {
                const badge = INITIAL_BADGES[0];
                newBadges.push({ ...badge, unlockedAt: new Date() });
                addNotification({
                    title: 'New Achievement!',
                    message: `Unlocked: ${badge.name}`,
                    type: 'success'
                });
            }

            // Task Master Achievement
            if (newTasksCompleted === 10 && !newBadges.find(b => b.id === '2')) {
                const badge = INITIAL_BADGES[1];
                newBadges.push({ ...badge, unlockedAt: new Date() });
                addNotification({
                    title: 'New Achievement!',
                    message: `Unlocked: ${badge.name}`,
                    type: 'success'
                });
            }

            return {
                ...prev,
                xp: newXp,
                level: newLevel,
                xpToNextLevel: newXpToNextLevel,
                tasksCompleted: newTasksCompleted,
                badges: newBadges,
                totalXp: newTotalXp
            };
        });
    };

    return (
        <AppContext.Provider value={{
            tasks,
            events,
            userStats,
            theme,
            language: 'en',
            notifications,
            searchQuery,
            setSearchQuery,
            addTask,
            updateTask,
            deleteTask,
            addEvent,
            updateEvent,
            deleteEvent,
            updateStats,
            toggleSubTask,
            addNotification,
            markNotificationAsRead,
            clearNotifications
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
}
