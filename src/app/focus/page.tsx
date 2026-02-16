"use client";

import React, { useState, useEffect, useRef } from "react";
import {
    Play,
    Pause,
    RotateCcw,
    Coffee,
    Brain,
    Zap,
    Volume2,
    VolumeX,
    Plus,
    Minus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { InteractiveButton } from "@/components/ui/InteractiveButton";

export default function FocusPage() {
    const [focusDuration, setFocusDuration] = useState(25);
    const [breakDuration, setBreakDuration] = useState(5);
    const [longBreakDuration, setLongBreakDuration] = useState(15);

    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState<'Focus' | 'Short Break' | 'Long Break'>('Focus');
    const [isMuted, setIsMuted] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            if (timerRef.current) clearInterval(timerRef.current);
            // Notification logic
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isActive, timeLeft]);

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        if (mode === 'Focus') setTimeLeft(focusDuration * 60);
        else if (mode === 'Short Break') setTimeLeft(breakDuration * 60);
        else setTimeLeft(longBreakDuration * 60);
    };

    const handleModeChange = (newMode: typeof mode) => {
        setMode(newMode);
        setIsActive(false);
        if (newMode === 'Focus') setTimeLeft(focusDuration * 60);
        else if (newMode === 'Short Break') setTimeLeft(breakDuration * 60);
        else setTimeLeft(longBreakDuration * 60);
    };

    const adjustDuration = (amount: number) => {
        if (isActive) return;
        if (mode === 'Focus') {
            const newDur = Math.max(5, Math.min(60, focusDuration + amount));
            setFocusDuration(newDur);
            setTimeLeft(newDur * 60);
        } else if (mode === 'Short Break') {
            const newDur = Math.max(1, Math.min(30, breakDuration + amount));
            setBreakDuration(newDur);
            setTimeLeft(newDur * 60);
        } else {
            const newDur = Math.max(5, Math.min(45, longBreakDuration + amount));
            setLongBreakDuration(newDur);
            setTimeLeft(newDur * 60);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const currentTotal = mode === 'Focus' ? focusDuration : mode === 'Short Break' ? breakDuration : longBreakDuration;
    const progress = (timeLeft / (currentTotal * 60)) * 100;

    return (
        <div className="max-w-4xl mx-auto py-10">
            <div className="flex flex-col items-center text-center mb-12">
                <h2 className="text-4xl font-black text-foreground mb-2 flex items-center gap-3">
                    <Brain className="text-primary" size={32} />
                    Focus Mode
                </h2>
                <p className="text-foreground/50 font-medium max-w-md">
                    Deep work made simple. Use the Pomodoro technique to stay productive and fresh.
                </p>
            </div>

            <div className="glass-card p-10 lg:p-16 rounded-[3rem] relative overflow-hidden flex flex-col items-center">
                {/* Progress Background Decoration */}
                <div className="absolute inset-0 opacity-5 pointer-events-none">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <motion.rect
                            initial={{ height: "100%" }}
                            animate={{ height: `${progress}%` }}
                            className="fill-primary w-full"
                        />
                    </svg>
                </div>

                {/* Mode Toggles */}
                <div className="flex bg-surface-muted dark:bg-background rounded-2xl p-1.5 border border-border mb-12 relative z-10">
                    {[
                        { name: 'Focus', icon: Brain },
                        { name: 'Short Break', icon: Coffee },
                        { name: 'Long Break', icon: Zap }
                    ].map((m) => (
                        <button
                            key={m.name}
                            onClick={() => handleModeChange(m.name as any)}
                            className={cn(
                                "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
                                mode === m.name ? "bg-white dark:bg-card text-primary shadow-lg" : "text-foreground/40 hover:text-foreground"
                            )}
                        >
                            <m.icon size={16} />
                            {m.name}
                        </button>
                    ))}
                </div>

                {/* Timer Display */}
                <div className="relative mb-12 flex items-center justify-center gap-8">
                    {!isActive && (
                        <InteractiveButton
                            variant="ghost"
                            size="icon"
                            onClick={() => adjustDuration(-5)}
                            className="bg-surface-muted dark:bg-background border border-border"
                        >
                            <Minus size={24} />
                        </InteractiveButton>
                    )}

                    <div className="text-center relative">
                        <motion.h1
                            key={timeLeft}
                            initial={{ scale: 0.9, opacity: 0.5 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-[120px] lg:text-[180px] font-black text-foreground tracking-tighter tabular-nums leading-none select-none px-4"
                        >
                            {formatTime(timeLeft)}
                        </motion.h1>
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/30 whitespace-nowrap">
                                {isActive ? 'Deep focus active' : 'Ready to start?'}
                            </p>
                        </div>
                    </div>

                    {!isActive && (
                        <InteractiveButton
                            variant="ghost"
                            size="icon"
                            onClick={() => adjustDuration(5)}
                            className="bg-surface-muted dark:bg-background border border-border"
                        >
                            <Plus size={24} />
                        </InteractiveButton>
                    )}
                </div>

                {/* Controls */}
                <div className="flex items-center gap-6 relative z-10">
                    <InteractiveButton
                        variant="glass"
                        onClick={resetTimer}
                        className="p-5"
                    >
                        <RotateCcw size={28} />
                    </InteractiveButton>

                    <InteractiveButton
                        variant={isActive ? 'danger' : 'primary'}
                        onClick={toggleTimer}
                        className={cn(
                            "w-24 h-24 rounded-[2rem] shadow-2xl",
                            isActive ? "bg-orange-500 shadow-orange-500/30" : "shadow-primary/30"
                        )}
                    >
                        {isActive ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-2" />}
                    </InteractiveButton>

                    <InteractiveButton
                        variant="glass"
                        onClick={() => setIsMuted(!isMuted)}
                        className="p-5"
                    >
                        {isMuted ? <VolumeX size={28} /> : <Volume2 size={28} />}
                    </InteractiveButton>
                </div>
            </div>

            {/* Focus Stats / Quotes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                <div className="glass-card p-6 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Brain size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-foreground/30 uppercase tracking-widest">Total Focus Time</p>
                        <p className="text-lg font-bold text-foreground">0 Hours 0 Minutes</p>
                    </div>
                </div>
                <div className="glass-card p-6 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                        <Zap size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-foreground/30 uppercase tracking-widest">Current Session</p>
                        <p className="text-lg font-bold text-foreground">Session #1 of the day</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
