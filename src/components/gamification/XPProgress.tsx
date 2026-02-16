"use client";

import React from "react";
import { motion } from "framer-motion";
import { Trophy, Star, TrendingUp } from "lucide-react";
import { useAppContext } from "@/store/AppContext";

export function XPProgress() {
    const { userStats } = useAppContext();
    const progress = (userStats.xp / userStats.xpToNextLevel) * 100;

    return (
        <div className="glass-card p-6 rounded-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary shadow-inner">
                        <Trophy size={24} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-foreground/50 uppercase tracking-wider">Level {userStats.level}</h3>
                        <p className="text-xl font-extrabold text-foreground">Pro Planner</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="flex items-center gap-1 text-primary">
                        <Star size={16} fill="currentColor" />
                        <span className="text-sm font-bold">{userStats.xp} / {userStats.xpToNextLevel} XP</span>
                    </div>
                    <p className="text-xs text-foreground/40 font-medium">To Next Level</p>
                </div>
            </div>

            <div className="relative w-full h-4 bg-surface-muted dark:bg-background rounded-full overflow-hidden border border-border">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-secondary"
                />
            </div>

            <div className="flex items-center gap-6 mt-2">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500">
                        <CheckCircle size={16} />
                    </div>
                    <div>
                        <p className="text-xs text-foreground/40 font-bold uppercase">Completed</p>
                        <p className="text-sm font-bold">{userStats.tasksCompleted} Tasks</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                        <TrendingUp size={16} />
                    </div>
                    <div>
                        <p className="text-xs text-foreground/40 font-bold uppercase">Streak</p>
                        <p className="text-sm font-bold">{userStats.streak} Days</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CheckCircle({ size }: { size: number }) {
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
        >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    )
}
