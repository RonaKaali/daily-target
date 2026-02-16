"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star, Zap, Target, TrendingUp, Award, Calendar } from "lucide-react";
import { useAppContext } from "@/store/AppContext";
import { cn } from "@/lib/utils";

export default function AchievementsPage() {
    const { userStats } = useAppContext();

    const statsOverview = [
        { label: "Total XP", value: userStats.totalXp?.toLocaleString() || "0", icon: Star, color: "text-primary", bg: "bg-primary/10" },
        { label: "Tasks Done", value: userStats.tasksCompleted, icon: Target, color: "text-secondary", bg: "bg-secondary/10" },
        { label: "Current Streak", value: `${userStats.streak} Days`, icon: Zap, color: "text-orange-500", bg: "bg-orange-500/10" },
        { label: "Level", value: userStats.level, icon: Trophy, color: "text-yellow-500", bg: "bg-yellow-500/10" },
    ];

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-foreground tracking-tight">Hall of Fame</h2>
                    <p className="text-foreground/50 font-medium">Your journey and productivity milestones.</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statsOverview.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass-card p-6 rounded-2xl flex flex-col items-center text-center group"
                    >
                        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                            <stat.icon size={28} />
                        </div>
                        <p className="text-2xl font-black text-foreground mb-0.5">{stat.value}</p>
                        <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Badges Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <Award className="text-primary" size={24} />
                    <h3 className="text-xl font-bold text-foreground">Unlocked Badges</h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {userStats.badges.map((badge, index) => (
                        <motion.div
                            key={badge.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex flex-col items-center group cursor-help"
                            title={badge.description}
                        >
                            <div className="relative">
                                <div className="w-20 h-20 rounded-full premium-gradient flex items-center justify-center text-3xl shadow-lg shadow-primary/20 z-10 relative">
                                    {badge.icon}
                                </div>
                                <div className="absolute -inset-2 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/40 transition-colors animate-pulse" />
                            </div>
                            <p className="mt-4 font-bold text-foreground text-center line-clamp-1">{badge.name}</p>
                            <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-tighter">
                                {badge.category}
                            </p>
                        </motion.div>
                    ))}

                    {/* Locked Badges Placeholder */}
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex flex-col items-center opacity-30 grayscale cursor-not-allowed">
                            <div className="w-20 h-20 rounded-full border-2 border-dashed border-border flex items-center justify-center text-2xl">
                                🔒
                            </div>
                            <p className="mt-4 font-bold text-foreground/50 text-sm">Locked</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Productivity Insight */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
                <div className="glass-card p-8 rounded-3xl space-y-6">
                    <div className="flex items-center gap-3">
                        <TrendingUp className="text-green-500" size={24} />
                        <h3 className="text-xl font-bold text-foreground">Global Rank</h3>
                    </div>
                    <div className="flex items-end gap-2">
                        <span className="text-6xl font-black text-foreground">#1,204</span>
                        <span className="text-green-500 font-bold mb-2 flex items-center gap-1">
                            Up 21% this week
                        </span>
                    </div>
                    <p className="text-foreground/50 leading-relaxed font-medium">
                        You're in the top 5% of all users this week. Your focus session completion rate has improved by 15% compared to last month.
                    </p>
                    <div className="pt-4 border-t border-border">
                        <div className="flex justify-between text-sm font-bold mb-2">
                            <span className="text-foreground/60">Rank Progress</span>
                            <span className="text-primary">85%</span>
                        </div>
                        <div className="h-2 w-full bg-surface-muted dark:bg-background rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "85%" }}
                                className="h-full premium-gradient shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                                transition={{ duration: 1.5, ease: "easeOut" }}
                            />
                        </div>
                    </div>
                </div>

                <div className="glass-card p-8 rounded-3xl bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/10">
                    <div className="flex items-center gap-3 mb-6">
                        <Calendar className="text-secondary" size={24} />
                        <h3 className="text-xl font-bold text-foreground">Next Milestone</h3>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-2xl bg-white dark:bg-background/40 flex items-center justify-center text-4xl shadow-card border border-border">
                            🔥
                        </div>
                        <div className="flex-1">
                            <h4 className="text-2xl font-black text-foreground">Persistent Planner</h4>
                            <p className="text-foreground/50 font-medium">Complete 50 tasks in total.</p>
                            <div className="mt-4 flex items-center gap-4">
                                <div className="flex-1 h-3 bg-white dark:bg-background rounded-full overflow-hidden border border-border">
                                    <div className="h-full bg-secondary w-[60%]" />
                                </div>
                                <span className="text-xs font-black text-secondary uppercase">30 / 50</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
