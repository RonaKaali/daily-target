"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface InteractiveButtonProps extends HTMLMotionProps<"button"> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'glass' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    className?: string;
}

export const InteractiveButton = React.forwardRef<HTMLButtonElement, InteractiveButtonProps>(
    ({ children, variant = 'primary', size = 'md', className, ...props }, ref) => {
        const variants = {
            primary: "bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary/90",
            secondary: "bg-secondary text-white shadow-lg shadow-secondary/20 hover:bg-secondary/90",
            glass: "bg-white/10 dark:bg-card/20 backdrop-blur-lg border border-white/20 dark:border-white/5 hover:bg-white/20 dark:hover:bg-card/30",
            danger: "bg-rose-500 text-white shadow-lg shadow-rose-500/20 hover:bg-rose-600",
            ghost: "hover:bg-primary/5 text-foreground/60 hover:text-primary transition-colors"
        };

        const sizes = {
            sm: "px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-xl",
            md: "px-6 py-3 text-sm font-extrabold rounded-2xl",
            lg: "px-8 py-4 text-base font-black tracking-tight rounded-[1.5rem]",
            icon: "p-3 rounded-xl"
        };

        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                    "relative flex items-center justify-center gap-2 transition-all duration-300 overflow-hidden group/interactive font-sans",
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            >
                {/* Glossy overlay effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none" />

                {/* Content */}
                <span className="relative z-10 flex items-center gap-2">
                    {children}
                </span>
            </motion.button>
        );
    }
);

InteractiveButton.displayName = "InteractiveButton";
