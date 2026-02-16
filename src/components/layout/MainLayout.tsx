"use client";

import React from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export function MainLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen flex overflow-hidden relative font-sans selection:bg-primary/20">
            {/* Energetic Background Elements */}
            <div className="bg-mesh" />
            <div className="bg-noise" />

            {/* Floating Blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <motion.div
                    animate={{
                        x: [0, 100, -50, 0],
                        y: [0, -100, 50, 0],
                        scale: [1, 1.15, 0.85, 1],
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    style={{ willChange: "transform" }}
                    className="absolute -top-[15%] -left-[15%] w-[50%] h-[50%] bg-primary/25 blur-[100px] rounded-full"
                />
                <motion.div
                    animate={{
                        x: [0, -120, 80, 0],
                        y: [0, 120, -100, 0],
                        scale: [1, 0.9, 1.1, 1],
                    }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    style={{ willChange: "transform" }}
                    className="absolute top-[25%] -right-[15%] w-[45%] h-[45%] bg-secondary/15 blur-[120px] rounded-full"
                />
                <motion.div
                    animate={{
                        x: [0, 80, -100, 0],
                        y: [0, 100, 150, 0],
                        scale: [1, 1.1, 0.9, 1],
                    }}
                    transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                    style={{ willChange: "transform" }}
                    className="absolute -bottom-[15%] left-[15%] w-[40%] h-[40%] bg-accent/10 blur-[90px] rounded-full"
                />
            </div>

            {/* Sidebar - Fixed on desktop, overlay on mobile */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 lg:pl-[260px] relative z-0">
                <Header />

                <main className="flex-1 overflow-y-auto no-scrollbar relative w-full">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, y: 30, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -30, scale: 0.98 }}
                            transition={{
                                duration: 0.6,
                                ease: [0.16, 1, 0.3, 1]
                            }}
                            className="p-6 lg:p-10 xl:p-12 max-w-[1600px] mx-auto w-full"
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
