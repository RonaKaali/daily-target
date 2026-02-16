"use client";

import React from "react";
import { XPProgress } from "@/components/gamification/XPProgress";
import { ProductivityChart } from "@/components/dashboard/ProductivityChart";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  ArrowRight,
  Trophy,
  Zap,
  Target,
  BarChart3,
  Calendar as CalendarIcon
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAppContext } from "@/store/AppContext";
import { cn } from "@/lib/utils";
import { isSameDay, format, startOfHour, addHours } from "date-fns";
import { InteractiveButton } from "@/components/ui/InteractiveButton";

export default function DashboardPage() {
  const { tasks, events, userStats } = useAppContext();

  const today = new Date();

  // Unified Timeline Data
  const todayTasks = tasks.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), today) && t.status !== 'Completed');
  const todayEvents = events.filter(e => isSameDay(new Date(e.start), today));

  const timelineItems = [
    ...todayTasks.map(t => ({ id: t.id, time: t.dueDate ? new Date(t.dueDate) : today, title: t.title, type: 'task' as const, category: t.category, priority: t.priority })),
    ...todayEvents.map(e => ({ id: e.id, time: new Date(e.start), title: e.title, type: 'event' as const, category: e.category, status: e.status }))
  ].sort((a, b) => a.time.getTime() - b.time.getTime());

  const stats = [
    { label: "Done", value: tasks.filter(t => t.status === 'Completed').length, icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Active", value: tasks.filter(t => t.status === 'In Progress' || t.status === 'Todo').length, icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Critical", value: tasks.filter(t => t.priority === 'High' && t.status !== 'Completed').length, icon: AlertCircle, color: "text-orange-500", bg: "bg-orange-500/10" },
  ];

  return (
    <div className="space-y-10 pb-12">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px] mb-2"
          >
            <Zap size={14} fill="currentColor" />
            Productivity Pulse
          </motion.div>
          <h2 className="text-4xl font-black text-foreground tracking-tighter italic">Welcome back, Chief.</h2>
          <p className="text-foreground/40 font-medium">You've completed {userStats.tasksCompleted} targets so far. Keep the momentum!</p>
        </div>
        <div className="flex gap-3">
          <Link href="/todo">
            <InteractiveButton variant="glass">
              <BarChart3 size={18} />
              <span>Full Report</span>
            </InteractiveButton>
          </Link>
          <Link href="/targets">
            <InteractiveButton variant="primary" className="group">
              <Plus size={20} className="group-hover:rotate-90 transition-transform" />
              <span>New Target</span>
            </InteractiveButton>
          </Link>
        </div>
      </div>

      {/* Hero Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 h-full">
          <XPProgress />
        </div>
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 1) }}
              className="glass-card p-6 rounded-3xl flex flex-col justify-between group"
            >
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                <stat.icon size={28} />
              </div>
              <div>
                <p className="text-4xl font-black text-foreground mb-1 tracking-tighter">{stat.value}</p>
                <p className="text-xs font-black text-foreground/30 uppercase tracking-[0.2em]">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Secondary Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <div className="glass-card p-2 rounded-[2.5rem] bg-gradient-to-br from-card/50 to-transparent">
            <ProductivityChart />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <Target className="text-primary" size={20} />
                <h3 className="text-xl font-black text-foreground italic tracking-tight">Today's Timeline</h3>
              </div>
              <Link href="/calendar" className="text-xs font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-1">
                View Schedule <ArrowRight size={14} />
              </Link>
            </div>

            <div className="space-y-4 relative before:absolute before:left-[1.65rem] before:top-4 before:bottom-4 before:w-0.5 before:bg-border/50 before:hidden md:before:block">
              {timelineItems.length === 0 ? (
                <div className="py-12 text-center glass-card rounded-3xl border-dashed">
                  <p className="text-foreground/30 font-bold italic">No events or tasks scheduled for today.</p>
                </div>
              ) : (
                timelineItems.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-4 group"
                  >
                    <div className="hidden md:flex flex-col items-center gap-2 pt-1 w-14">
                      <span className="text-[10px] font-black text-foreground/30 uppercase tracking-tighter">{format(item.time, "HH:mm")}</span>
                      <div className={cn(
                        "w-3 h-3 rounded-full border-2 border-background shadow-sm z-10",
                        item.type === 'event' ? "bg-secondary" : "bg-primary"
                      )} />
                    </div>

                    <Link href={item.type === 'event' ? "/calendar" : "/targets"} className="flex-1">
                      <div className={cn(
                        "p-5 rounded-3xl glass-card flex items-center justify-between group transition-all hover:scale-[1.01]",
                        item.type === 'event' && item.status === 'Completed' && "opacity-60 grayscale"
                      )}>
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center shadow-sm",
                            item.type === 'event' ? "bg-secondary/10 text-secondary" : "bg-primary/10 text-primary"
                          )}>
                            {item.type === 'event' ? <CalendarIcon size={18} /> : <Target size={18} />}
                          </div>
                          <div>
                            <p className={cn(
                              "font-black text-foreground text-lg leading-tight",
                              item.type === 'event' && item.status === 'Completed' && "line-through text-foreground/40"
                            )}>
                              {item.title}
                            </p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30 mt-1">
                              {item.category} • {item.type === 'event' ? 'Calendar Event' : `${item.priority} Priority`}
                            </p>
                          </div>
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-surface-muted flex items-center justify-center text-foreground/20 group-hover:bg-primary group-hover:text-white transition-all">
                          <ArrowRight size={14} />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          {/* Daily Quote / Focus Tip */}
          <div className="glass-card p-8 rounded-[2rem] bg-foreground text-background shadow-2xl relative overflow-hidden group">
            <Zap className="absolute -right-4 -bottom-4 text-background/10 w-32 h-32 group-hover:rotate-12 transition-transform duration-700" />
            <p className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-4">Daily Momentum</p>
            <h4 className="text-xl font-bold leading-tight italic">"The secret of getting ahead is getting started."</h4>
            <p className="mt-4 text-background/50 text-xs font-medium">— Mark Twain</p>
          </div>

          {/* Achievements Preview */}
          <div className="glass-card p-8 rounded-[2rem] space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-foreground italic tracking-tight">Achievements</h3>
              <Trophy className="text-yellow-500" size={18} />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {userStats.badges.slice(0, 4).map((badge) => (
                <div key={badge.id} className="aspect-square rounded-2xl premium-gradient flex items-center justify-center text-xl shadow-lg shadow-primary/10">
                  {badge.icon}
                </div>
              ))}
              {Array.from({ length: Math.max(0, 4 - userStats.badges.length) }).map((_, i) => (
                <div key={i} className="aspect-square rounded-2xl bg-surface-muted dark:bg-background border border-border flex items-center justify-center text-foreground/10">
                  🔒
                </div>
              ))}
            </div>
            <Link href="/achievements">
              <InteractiveButton variant="glass" size="sm" className="w-full">
                View Hall of Fame
              </InteractiveButton>
            </Link>
          </div>

          {/* Quick Focus Mode */}
          <div className="glass-card p-8 rounded-[2rem] bg-gradient-to-br from-secondary to-secondary-light text-white shadow-xl shadow-secondary/20 group">
            <Clock className="mb-4 text-white/50 group-hover:rotate-12 transition-transform" size={32} />
            <h3 className="text-2xl font-black tracking-tight italic">Deep Work</h3>
            <p className="text-white/70 text-sm font-medium mt-1 mb-6">Need 25 minutes of total silence?</p>
            <Link href="/focus">
              <InteractiveButton variant="glass" className="w-full bg-white text-secondary font-black hover:bg-white/90">
                Initiate Timer
              </InteractiveButton>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
