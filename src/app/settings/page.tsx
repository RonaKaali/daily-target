"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    User,
    Bell,
    Shield,
    Palette,
    Globe,
    Database,
    LogOut,
    ChevronRight,
    Moon,
    Sun
} from "lucide-react";
import { useAppContext } from "@/store/AppContext";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
    const { theme, userStats } = useAppContext();

    const sections = [
        {
            title: "Account",
            items: [
                { icon: User, label: "Profile Information", value: "Pro Planner", color: "text-blue-500" },
                { icon: Shield, label: "Security & Password", value: "Secure", color: "text-green-500" },
            ]
        },
        {
            title: "Personalization",
            items: [
                { icon: Palette, label: "Appearance", value: theme === 'dark' ? "Dark Mode" : "Light Mode", color: "text-purple-500" },
                { icon: Globe, label: "Language", value: "English (US)", color: "text-orange-500" },
            ]
        },
        {
            title: "System",
            items: [
                { icon: Bell, label: "Notifications", value: "All enabled", color: "text-pink-500" },
                { icon: Database, label: "Data & Storage", value: "1.2MB used", color: "text-cyan-500" },
            ]
        }
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20">
            <div>
                <h2 className="text-3xl font-extrabold text-foreground tracking-tight">Settings</h2>
                <p className="text-foreground/50 font-medium">Fine-tune your productivity environment.</p>
            </div>

            {/* Profile Card */}
            <div className="glass-card p-8 rounded-3xl flex items-center gap-8 bg-gradient-to-br from-primary/5 to-transparent">
                <div className="relative">
                    <div className="w-24 h-24 rounded-full premium-gradient flex items-center justify-center text-4xl text-white shadow-xl">
                        🚀
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-background border-4 border-card flex items-center justify-center text-xs font-black text-primary">
                        L{userStats.level}
                    </div>
                </div>
                <div className="flex-1">
                    <h3 className="text-2xl font-black text-foreground">Pro Planner</h3>
                    <p className="text-foreground/50 font-medium">Joined February 2026 • {userStats.totalXp} Total XP</p>
                    <div className="mt-4 flex gap-2">
                        <button className="px-4 py-2 bg-foreground text-background rounded-xl text-xs font-bold hover:opacity-90 transition-opacity">
                            Edit Profile
                        </button>
                        <button className="px-4 py-2 border border-border rounded-xl text-xs font-bold hover:bg-surface-muted transition-colors">
                            View Public Profile
                        </button>
                    </div>
                </div>
            </div>

            {/* Settings Sections */}
            <div className="grid grid-cols-1 gap-8">
                {sections.map((section) => (
                    <div key={section.title} className="space-y-4">
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-foreground/30 px-2">{section.title}</h3>
                        <div className="glass-card rounded-2xl overflow-hidden border">
                            {section.items.map((item, idx) => (
                                <div
                                    key={item.label}
                                    className={cn(
                                        "flex items-center justify-between p-5 hover:bg-surface-muted dark:hover:bg-background/40 cursor-pointer transition-colors group",
                                        idx !== section.items.length - 1 && "border-b border-border"
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", item.color.replace('text', 'bg') + '/10', item.color)}>
                                            <item.icon size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-foreground">{item.label}</p>
                                            <p className="text-xs text-foreground/40 font-medium">{item.value}</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={18} className="text-foreground/20 group-hover:text-primary transition-colors" />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Danger Zone */}
            <div className="pt-10 border-t border-border">
                <button className="w-full p-5 rounded-2xl bg-red-500/5 border border-red-500/20 flex items-center justify-between group hover:bg-red-500/10 transition-colors">
                    <div className="flex items-center gap-4 text-red-500">
                        <LogOut size={20} />
                        <span className="font-bold">Sign Out of Account</span>
                    </div>
                    <ChevronRight size={18} className="text-red-500/40" />
                </button>
                <p className="mt-4 text-[10px] text-center text-foreground/20 font-bold uppercase tracking-widest">
                    Version 1.0.4-beta • Built with ❤️ by Antigravity
                </p>
            </div>
        </div>
    );
}
