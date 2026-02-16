"use client";

import React, { useState } from "react";
import {
    LayoutDashboard,
    Calendar,
    CheckSquare,
    Zap,
    Settings,
    ChevronLeft,
    ChevronRight,
    Trophy,
    Target,
    Menu,
    X,
    Bell
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/store/AppContext";

export function Sidebar() {
    const pathname = usePathname();
    const { theme } = useAppContext();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems = [
        { icon: LayoutDashboard, label: "Dashboard", href: "/" },
        { icon: Target, label: "Daily Targets", href: "/targets" },
        { icon: CheckSquare, label: "To-Do List", href: "/todo" },
        { icon: Calendar, label: "Calendar", href: "/calendar" },
        { icon: Trophy, label: "Achievements", href: "/achievements" },
        { icon: Zap, label: "Focus Mode", href: "/focus" },
        { icon: Settings, label: "Settings", href: "/settings" },
    ];

    return (
        <>
            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setMobileMenuOpen(false)}
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Mobile Toggle Button */}
            <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="fixed bottom-6 right-6 z-50 p-4 bg-primary text-white rounded-full shadow-lg shadow-primary/30 lg:hidden"
            >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <motion.aside
                initial={false}
                animate={{
                    width: isCollapsed ? "80px" : "260px",
                    x: mobileMenuOpen ? 0 : (typeof window !== "undefined" && window.innerWidth < 1024 ? -300 : 0)
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={cn(
                    "fixed top-0 left-0 h-screen z-40 transition-all duration-500",
                    "bg-white/40 dark:bg-card/20 backdrop-blur-xl border-r border-border/50 shadow-2xl",
                    mobileMenuOpen ? "flex" : "hidden lg:flex",
                    "flex-col"
                )}
            >
                {/* Logo Section */}
                <div className="h-20 flex items-center px-6 gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl premium-gradient flex items-center justify-center text-white shadow-lg shadow-primary/20 flex-shrink-0">
                        <Zap size={22} fill="currentColor" />
                    </div>
                    {!isCollapsed && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="font-black text-xl tracking-tighter text-foreground"
                        >
                            TARGET<span className="text-primary italic">.</span>
                        </motion.span>
                    )}
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 px-3 space-y-1 overflow-y-auto no-scrollbar">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                                <div className={cn(
                                    "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group relative",
                                    isActive
                                        ? "bg-primary text-white shadow-md shadow-primary/20"
                                        : "text-foreground/50 hover:bg-surface-muted dark:hover:bg-card/50 hover:text-foreground"
                                )}>
                                    <item.icon size={22} className={cn("flex-shrink-0", isActive ? "text-white" : "group-hover:text-primary")} />
                                    {!isCollapsed && (
                                        <motion.span
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="font-bold text-sm tracking-tight"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                    {isActive && !isCollapsed && (
                                        <motion.div
                                            layoutId="active-pill"
                                            className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white"
                                        />
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                {/* Collapse Toggle (Desktop) */}
                <div className="p-4 hidden lg:block">
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="w-full flex items-center justify-center p-3 rounded-xl hover:bg-surface-muted dark:hover:bg-card transition-colors text-foreground/40"
                    >
                        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>
                </div>
            </motion.aside>
        </>
    );
}
