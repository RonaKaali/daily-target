"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Bell, Moon, Sun, User, X, CheckCircle2, Zap, Award, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/store/AppContext";
import { InteractiveButton } from "../ui/InteractiveButton";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export function Header() {
    const [date, setDate] = useState(new Date());
    const {
        theme,
        setSearchQuery,
        searchQuery,
        tasks,
        events,
        notifications,
        markNotificationAsRead,
        clearNotifications
    } = useAppContext();
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const notificationRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsDarkMode(theme === 'dark');
    }, [theme]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setIsNotificationsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleTheme = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        document.documentElement.classList.toggle("dark", newMode);
        localStorage.setItem("theme", newMode ? "dark" : "light");
    };

    const filteredTasks = tasks.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5);

    const filteredEvents = events.filter(e =>
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.category.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5);

    const hasUnread = notifications.some(n => !n.read);

    return (
        <header className="h-20 px-6 lg:px-10 flex items-center justify-between bg-white/40 dark:bg-card/20 backdrop-blur-xl sticky top-0 z-30 border-b border-border/50 transition-all duration-300 shadow-sm">
            <div className="flex flex-col">
                <h1 className="text-lg lg:text-xl font-bold text-foreground">
                    Dashboard Hub
                </h1>
                <p className="text-sm text-foreground/50 font-medium">
                    {format(date, "EEEE, MMMM d, yyyy • HH:mm")}
                </p>
            </div>

            <div className="flex items-center gap-2 lg:gap-4">
                {/* Search Bar - Desktop */}
                <div className="hidden md:flex items-center relative group">
                    <Search size={18} className={cn(
                        "absolute left-3 transition-colors",
                        isSearchFocused ? "text-primary" : "text-foreground/40"
                    )} />
                    <input
                        type="text"
                        placeholder="Search everything..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                        className="pl-10 pr-4 py-2 bg-surface-muted dark:bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-48 lg:w-80 transition-all font-bold"
                    />

                    {/* Search Results Dropdown */}
                    <AnimatePresence>
                        {isSearchFocused && searchQuery.length > 1 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute top-full mt-2 w-full glass-card rounded-2xl p-4 shadow-2xl border border-border overflow-hidden"
                            >
                                <div className="space-y-4">
                                    {filteredTasks.length > 0 && (
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30 mb-2">Tasks</p>
                                            <div className="space-y-1">
                                                {filteredTasks.map(task => (
                                                    <Link key={task.id} href="/todo" className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-muted transition-colors group">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                        <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{task.title}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {filteredEvents.length > 0 && (
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30 mb-2">Events</p>
                                            <div className="space-y-1">
                                                {filteredEvents.map(event => (
                                                    <Link key={event.id} href="/calendar" className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-muted transition-colors group">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                                                        <span className="text-sm font-bold text-foreground group-hover:text-secondary transition-colors">{event.title}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {filteredTasks.length === 0 && filteredEvents.length === 0 && (
                                        <p className="text-center py-4 text-xs font-bold text-foreground/30 italic">No results found.</p>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1 lg:gap-2">
                    <InteractiveButton
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        className="text-foreground/60 w-10 h-10"
                    >
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </InteractiveButton>

                    <div className="relative" ref={notificationRef}>
                        <InteractiveButton
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                            className={cn("text-foreground/60 w-10 h-10", isNotificationsOpen && "bg-surface-muted text-primary")}
                        >
                            <Bell size={20} />
                            {hasUnread && (
                                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-accent rounded-full border-2 border-background animate-pulse" />
                            )}
                        </InteractiveButton>

                        {/* Notifications Popover */}
                        <AnimatePresence>
                            {isNotificationsOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 mt-4 w-80 glass-card rounded-[2rem] p-4 shadow-2xl border border-border overflow-hidden"
                                >
                                    <div className="flex items-center justify-between mb-4 px-2">
                                        <h3 className="text-sm font-black italic">Notifications</h3>
                                        {notifications.length > 0 && (
                                            <button onClick={clearNotifications} className="text-[10px] font-black uppercase text-primary hover:underline">Clear all</button>
                                        )}
                                    </div>
                                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                                        {notifications.length === 0 ? (
                                            <div className="py-10 text-center">
                                                <div className="w-12 h-12 bg-surface-muted rounded-full flex items-center justify-center mx-auto mb-2">
                                                    <Bell size={20} className="text-foreground/20" />
                                                </div>
                                                <p className="text-xs font-bold text-foreground/30">Quiet for now...</p>
                                            </div>
                                        ) : (
                                            notifications.map(n => (
                                                <div
                                                    key={n.id}
                                                    className={cn(
                                                        "p-3 rounded-2xl flex gap-3 transition-colors relative group",
                                                        n.read ? "bg-transparent opacity-60" : "bg-primary/5 border border-primary/10"
                                                    )}
                                                    onClick={() => markNotificationAsRead(n.id)}
                                                >
                                                    <div className={cn(
                                                        "w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center shadow-sm",
                                                        n.type === 'success' ? "bg-green-500/10 text-green-500" :
                                                            n.type === 'level-up' ? "bg-accent/10 text-accent" :
                                                                "bg-primary/10 text-primary"
                                                    )}>
                                                        {n.type === 'level-up' ? <Zap size={18} fill="currentColor" /> :
                                                            n.type === 'success' ? <CheckCircle2 size={18} /> :
                                                                <Award size={18} />}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-black text-foreground">{n.title}</p>
                                                        <p className="text-[10px] font-medium text-foreground/50 leading-tight">{n.message}</p>
                                                        <p className="text-[8px] font-bold text-foreground/20 mt-1 uppercase tracking-widest">{format(n.timestamp, "HH:mm")}</p>
                                                    </div>
                                                    {!n.read && (
                                                        <div className="w-1.5 h-1.5 bg-primary rounded-full absolute top-4 right-4" />
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="h-8 w-[1px] bg-border mx-1" />

                    <InteractiveButton variant="ghost" className="p-1 h-12 gap-3 pl-1 pr-3 border-transparent hover:border-border">
                        <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary shadow-sm">
                            <User size={20} />
                        </div>
                        <div className="hidden lg:flex flex-col items-start">
                            <span className="text-xs font-bold leading-tight">Alex Dev</span>
                            <span className="text-[10px] text-foreground/50 font-medium lowercase">Pro Member</span>
                        </div>
                    </InteractiveButton>
                </div>
            </div>
        </header>
    );
}
