"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    CheckCircle2,
    Circle,
    Trash2,
    Calendar as CalendarIcon,
    Tag,
    AlertCircle,
    ChevronDown,
    ChevronRight,
    Star
} from "lucide-react";
import { useAppContext } from "@/store/AppContext";
import { cn } from "@/lib/utils";
import { Priority, TaskStatus } from "@/types";

export default function TodoPage() {
    const { tasks, addTask, updateTask, deleteTask, toggleSubTask } = useAppContext();
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [newTaskPriority, setNewTaskPriority] = useState<Priority>("Medium");
    const [newTaskSubTasks, setNewTaskSubTasks] = useState<string[]>([]);
    const [tempSubTask, setTempSubTask] = useState("");
    const [filterStatus, setFilterStatus] = useState<TaskStatus | 'All'>('All');
    const [expandedTasks, setExpandedTasks] = useState<string[]>([]);

    const filteredTasks = tasks.filter(task => {
        if (filterStatus === 'All') return true;
        return task.status === filterStatus;
    });

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        addTask({
            title: newTaskTitle,
            status: 'Todo',
            priority: newTaskPriority,
            xpValue: newTaskPriority === 'High' ? 100 : newTaskPriority === 'Medium' ? 50 : 25,
            category: 'General',
            subTasks: newTaskSubTasks
        });

        setNewTaskTitle("");
        setNewTaskSubTasks([]);
        setIsAddingTask(false);
    };

    const addTempSubTask = () => {
        if (tempSubTask.trim()) {
            setNewTaskSubTasks([...newTaskSubTasks, tempSubTask]);
            setTempSubTask("");
        }
    };

    const toggleTaskStatus = (id: string, currentStatus: TaskStatus) => {
        const nextStatus: TaskStatus = currentStatus === 'Completed' ? 'Todo' : 'Completed';
        updateTask(id, {
            status: nextStatus,
            completedAt: nextStatus === 'Completed' ? new Date() : undefined
        });
    };

    const toggleExpand = (id: string) => {
        setExpandedTasks(prev =>
            prev.includes(id) ? prev.filter(tId => tId !== id) : [...prev, id]
        );
    };

    return (
        <div className="space-y-6 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-foreground tracking-tight">To-Do List</h2>
                    <p className="text-foreground/50 font-medium">Manage your daily targets and tasks.</p>
                </div>
                <button
                    onClick={() => setIsAddingTask(true)}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all transform hover:scale-105 active:scale-95"
                >
                    <Plus size={20} />
                    <span>Add Task</span>
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
                {['All', 'Todo', 'In Progress', 'Completed'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status as any)}
                        className={cn(
                            "px-4 py-2 rounded-xl text-sm font-bold transition-all border",
                            filterStatus === status
                                ? "bg-primary text-white border-primary shadow-md shadow-primary/10"
                                : "bg-surface-muted dark:bg-card/30 text-foreground/50 border-border hover:border-primary/30"
                        )}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Task List */}
            <div className="grid grid-cols-1 gap-4">
                <AnimatePresence mode="popLayout">
                    {isAddingTask && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="glass-card p-6 rounded-2xl border-2 border-primary/20 shadow-xl"
                        >
                            <form onSubmit={handleAddTask} className="space-y-6">
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Task title..."
                                    value={newTaskTitle}
                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                    className="w-full text-2xl font-black bg-transparent border-none focus:ring-0 placeholder:text-foreground/20 italic tracking-tighter"
                                />

                                <div className="space-y-3">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30">Subtasks</p>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Add subtask..."
                                            value={tempSubTask}
                                            onChange={(e) => setTempSubTask(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTempSubTask())}
                                            className="flex-1 bg-surface-muted dark:bg-background/40 border border-border rounded-xl px-4 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                        <button
                                            type="button"
                                            onClick={addTempSubTask}
                                            className="p-2.5 bg-surface-muted dark:bg-background/40 border border-border rounded-xl hover:text-primary transition-colors"
                                        >
                                            <Plus size={20} />
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {newTaskSubTasks.map((st, i) => (
                                            <span key={i} className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-bold flex items-center gap-2">
                                                {st}
                                                <X size={12} className="cursor-pointer" onClick={() => setNewTaskSubTasks(newTaskSubTasks.filter((_, idx) => idx !== i))} />
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-border">
                                    <div className="flex items-center gap-3">
                                        <select
                                            value={newTaskPriority}
                                            onChange={(e) => setNewTaskPriority(e.target.value as Priority)}
                                            className="bg-surface-muted dark:bg-background/40 px-3 py-2 rounded-xl border border-border text-xs font-bold focus:outline-none"
                                        >
                                            <option value="Low">Low Priority</option>
                                            <option value="Medium">Medium Priority</option>
                                            <option value="High">High Priority</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setIsAddingTask(false)}
                                            className="px-5 py-2.5 text-sm font-bold text-foreground/40 hover:text-foreground transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-8 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all"
                                        >
                                            Create Task
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    )}

                    {filteredTasks.length === 0 && !isAddingTask ? (
                        <div className="py-20 text-center glass-card rounded-2xl border-dashed">
                            <p className="text-foreground/40 font-medium">No tasks found. Time to relax!</p>
                        </div>
                    ) : (
                        filteredTasks.map((task) => (
                            <motion.div
                                key={task.id}
                                layout
                                className={cn(
                                    "glass-card rounded-2xl border overflow-hidden transition-all",
                                    task.status === 'Completed' && "opacity-50 grayscale"
                                )}
                            >
                                <div className="p-4 lg:p-6 flex items-center gap-4">
                                    <button
                                        onClick={() => toggleTaskStatus(task.id, task.status)}
                                        className={cn(
                                            "transition-transform active:scale-95",
                                            task.status === 'Completed' ? "text-primary" : "text-foreground/20 hover:text-primary/50"
                                        )}
                                    >
                                        {task.status === 'Completed' ? <CheckCircle2 size={28} /> : <Circle size={28} />}
                                    </button>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 group/title" onClick={() => toggleExpand(task.id)}>
                                            <h3 className={cn(
                                                "text-lg font-bold text-foreground truncate cursor-pointer",
                                                task.status === 'Completed' && "line-through"
                                            )}>
                                                {task.title}
                                            </h3>
                                            {task.subTasks.length > 0 && (
                                                <span className="text-[10px] font-black tracking-widest text-primary px-2 py-0.5 rounded bg-primary/10">
                                                    {task.subTasks.filter(s => s.completed).length}/{task.subTasks.length}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 mt-1">
                                            <span className={cn(
                                                "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md",
                                                task.priority === 'High' ? "bg-orange-500/10 text-orange-500" :
                                                    task.priority === 'Medium' ? "bg-blue-500/10 text-blue-500" :
                                                        "bg-green-500/10 text-green-500"
                                            )}>
                                                {task.priority}
                                            </span>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-foreground/30 flex items-center gap-1">
                                                <Tag size={12} /> {task.category}
                                            </span>
                                            {task.status === 'Completed' && (
                                                <span className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1">
                                                    <Star size={12} fill="currentColor" /> +{task.xpValue} XP
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => deleteTask(task.id)}
                                            className="p-2 rounded-lg hover:bg-red-500/10 text-foreground/20 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                        <button onClick={() => toggleExpand(task.id)} className="p-2 rounded-lg hover:bg-surface-muted text-foreground/20 hover:text-foreground">
                                            {expandedTasks.includes(task.id) ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Expanded Subtasks */}
                                <AnimatePresence>
                                    {expandedTasks.includes(task.id) && task.subTasks.length > 0 && (
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: "auto" }}
                                            exit={{ height: 0 }}
                                            className="bg-surface-muted/50 dark:bg-background/20 border-t border-border overflow-hidden"
                                        >
                                            <div className="p-6 space-y-3">
                                                {task.subTasks.map(st => (
                                                    <div
                                                        key={st.id}
                                                        onClick={() => toggleSubTask(task.id, st.id)}
                                                        className="flex items-center gap-3 cursor-pointer group/st"
                                                    >
                                                        <div className={cn(
                                                            "w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all",
                                                            st.completed ? "bg-primary border-primary" : "border-border group-hover/st:border-primary/50"
                                                        )}>
                                                            {st.completed && <CheckCircle2 size={12} className="text-white" />}
                                                        </div>
                                                        <span className={cn(
                                                            "text-sm font-bold",
                                                            st.completed ? "text-foreground/30 line-through" : "text-foreground/70"
                                                        )}>
                                                            {st.title}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function X({ size, className, onClick }: { size: number, className?: string, onClick?: () => void }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            onClick={onClick}
        >
            <path d="M18 6L6 18" />
            <path d="M6 6l12 12" />
        </svg>
    )
}
