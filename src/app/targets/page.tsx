"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    CheckCircle2,
    Circle,
    Zap,
    AlertCircle,
    Clock,
    ChevronRight,
    Star
} from "lucide-react";
import { useAppContext } from "@/store/AppContext";
import { cn } from "@/lib/utils";
import { format, isSameDay } from "date-fns";
import Link from "next/link";
import { InteractiveButton } from "@/components/ui/InteractiveButton";

export default function TargetsPage() {
    const { tasks, updateTask, toggleSubTask } = useAppContext();

    // Filter tasks for today
    const activeTasks = tasks.filter(t => {
        if (t.status === 'Completed') return false;
        if (!t.dueDate) return true; // Keep tasks without dates as generic targets
        return isSameDay(new Date(t.dueDate), new Date());
    });
    const priorityTasks = activeTasks.filter(t => t.priority === 'High');
    const otherTasks = activeTasks.filter(t => t.priority !== 'High');

    const toggleStatus = (id: string, currentStatus: any) => {
        const nextStatus = currentStatus === 'Completed' ? 'Todo' : 'Completed';
        updateTask(id, {
            status: nextStatus,
            completedAt: nextStatus === 'Completed' ? new Date() : undefined
        });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20">
            {/* Minimalist Header */}
            <div className="text-center space-y-2">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest"
                >
                    <Zap size={14} fill="currentColor" />
                    Today's Focus
                </motion.div>
                <h1 className="text-5xl font-black text-foreground tracking-tighter italic">Do more. Sleep better.</h1>
                <p className="text-foreground/40 font-medium">It's {format(new Date(), "EEEE, MMMM do")}. Let's make it count.</p>
            </div>

            {/* High Stakes Goal */}
            {priorityTasks.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-orange-500">
                        <AlertCircle size={20} />
                        <h2 className="text-sm font-black uppercase tracking-[0.2em]">Crucial Targets</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        {priorityTasks.map((task) => (
                            <motion.div
                                key={task.id}
                                layout
                                className="glass-card p-8 rounded-3xl border-orange-500/20 bg-gradient-to-br from-orange-500/[0.03] to-transparent group"
                            >
                                <div className="flex items-start gap-6">
                                    <button
                                        onClick={() => toggleStatus(task.id, task.status)}
                                        className="mt-1 text-orange-500 transition-transform active:scale-90"
                                    >
                                        <Circle size={32} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
                                    </button>
                                    <div className="flex-1 space-y-4">
                                        <div>
                                            <h3 className="text-2xl font-black text-foreground leading-tight">{task.title}</h3>
                                            <p className="text-foreground/50 font-medium mt-1">Reward: {task.xpValue} XP • Priority: High</p>
                                        </div>

                                        {/* Subtasks List */}
                                        {task.subTasks && task.subTasks.length > 0 && (
                                            <div className="space-y-2 pt-4 border-t border-border/50">
                                                {task.subTasks.map((st) => (
                                                    <div
                                                        key={st.id}
                                                        onClick={() => toggleSubTask(task.id, st.id)}
                                                        className="flex items-center gap-3 cursor-pointer group/subtask"
                                                    >
                                                        <div className={cn(
                                                            "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                                                            st.completed ? "bg-orange-500 border-orange-500" : "border-border group-hover/subtask:border-orange-500/50"
                                                        )}>
                                                            {st.completed && <CheckCircle2 size={12} className="text-white" />}
                                                        </div>
                                                        <span className={cn(
                                                            "text-sm font-bold transition-all",
                                                            st.completed ? "text-foreground/30 line-through" : "text-foreground/70"
                                                        )}>
                                                            {st.title}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Other Targets */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                    <ChevronRight size={20} />
                    <h2 className="text-sm font-black uppercase tracking-[0.2em]">Next in Line</h2>
                </div>
                {otherTasks.length === 0 && priorityTasks.length === 0 ? (
                    <div className="py-20 text-center glass-card rounded-3xl border-dashed">
                        <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Star className="text-primary/20" size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-foreground">Clean Slate!</h3>
                        <p className="text-foreground/40 font-medium max-w-xs mx-auto">No targets for today. Enjoy your freedom or plan your next move.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {otherTasks.map((task) => (
                            <motion.div
                                key={task.id}
                                layout
                                className="glass-card p-6 rounded-2xl flex items-center gap-4 hover:border-primary/30"
                            >
                                <button
                                    onClick={() => toggleStatus(task.id, task.status)}
                                    className="text-primary/40 hover:text-primary transition-colors"
                                >
                                    <Circle size={24} />
                                </button>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-foreground truncate">{task.title}</p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30 mt-0.5">
                                        {task.category} • {task.xpValue} XP
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Quick Action - Floating Call to Action */}
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
                <Link href="/focus">
                    <InteractiveButton
                        variant="primary"
                        size="lg"
                        className="px-8 py-5 flex items-center gap-4 bg-foreground text-background hover:bg-foreground/90 shadow-2xl rounded-full"
                    >
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                            <Zap size={20} fill="currentColor" className="text-white" />
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-background/50 leading-none mb-1">Boost Focus</p>
                            <p className="text-lg font-black italic leading-none">Deep Work Mode</p>
                        </div>
                    </InteractiveButton>
                </Link>
            </div>
        </div>
    );
}
