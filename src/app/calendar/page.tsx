"use client";

import React, { useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    Plus,
    Clock,
    MapPin,
    MoreHorizontal,
    Search,
    CheckCircle2,
    Trash2
} from "lucide-react";
import {
    format,
    addMonths,
    subMonths,
    subDays,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    isSameMonth,
    isSameDay,
    addDays,
    eachDayOfInterval,
    addWeeks,
    subWeeks,
    startOfDay,
    setHours,
    setMinutes
} from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/store/AppContext";
import { InteractiveButton } from "@/components/ui/InteractiveButton";

export default function CalendarPage() {
    const { events, tasks, addEvent } = useAppContext();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [view, setView] = useState<'Month' | 'Week' | 'Agenda'>('Month');

    // Add Event State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [eventTitle, setEventTitle] = useState("");
    const [eventCategory, setEventCategory] = useState("Meeting");
    const [eventDate, setEventDate] = useState(format(new Date(), "yyyy-MM-dd"));
    const [eventTime, setEventTime] = useState("09:00");
    const [eventDesc, setEventDesc] = useState("");

    const nextRange = () => {
        if (view === 'Month') setCurrentDate(addMonths(currentDate, 1));
        else if (view === 'Week') setCurrentDate(addWeeks(currentDate, 1));
        else setCurrentDate(addDays(currentDate, 1));
    };

    const prevRange = () => {
        if (view === 'Month') setCurrentDate(subMonths(currentDate, 1));
        else if (view === 'Week') setCurrentDate(subWeeks(currentDate, 1));
        else setCurrentDate(subDays(currentDate, 1));
    };

    const handleAddEvent = (e: React.FormEvent) => {
        e.preventDefault();
        if (!eventTitle.trim()) return;

        const start = new Date(`${eventDate}T${eventTime}`);
        const end = new Date(start.getTime() + 60 * 60 * 1000); // Default 1 hour duration

        addEvent({
            title: eventTitle,
            start,
            end,
            category: eventCategory,
            description: eventDesc,
            status: 'Todo'
        });

        // Reset
        setEventTitle("");
        setEventDesc("");
        setIsModalOpen(false);
    };

    const openForDate = (date: Date) => {
        setEventDate(format(date, "yyyy-MM-dd"));
        setIsModalOpen(true);
    };

    const renderHeader = () => (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
                <h2 className="text-3xl font-extrabold text-foreground tracking-tight">Calendar</h2>
                <p className="text-foreground/50 font-medium">{format(currentDate, "MMMM yyyy")}</p>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex bg-surface-muted dark:bg-card/50 rounded-xl p-1 border border-border">
                    {['Month', 'Week', 'Agenda'].map((v) => (
                        <button
                            key={v}
                            onClick={() => setView(v as any)}
                            className={cn(
                                "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                                view === v ? "bg-white dark:bg-background text-primary shadow-sm" : "text-foreground/40 hover:text-foreground"
                            )}
                        >
                            {v}
                        </button>
                    ))}
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all transform hover:scale-105 active:scale-95"
                >
                    <Plus size={18} />
                    <span>Event</span>
                </button>
            </div>
        </div>
    );

    const renderMonthView = () => {
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const rows = [];
        let days = [];
        let day = startDate;

        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                const cloneDay = day;
                const isSelected = isSameDay(day, selectedDate);
                const isCurrentMonth = isSameMonth(day, monthStart);
                const dayEvents = events.filter(e => isSameDay(e.start, cloneDay));

                days.push(
                    <div
                        key={day.toString()}
                        className={cn(
                            "min-h-32 p-3 border-r border-b border-border transition-colors group relative cursor-pointer",
                            !isCurrentMonth ? "bg-surface-muted/30 text-foreground/20" : "bg-white dark:bg-card/10 text-foreground",
                            isSelected && "ring-2 ring-primary ring-inset z-10"
                        )}
                        onClick={() => {
                            setSelectedDate(cloneDay);
                            if (isSelected) openForDate(cloneDay); // Double click to add event
                        }}
                        onDoubleClick={() => openForDate(cloneDay)}
                    >
                        <span className={cn(
                            "text-sm font-bold w-8 h-8 flex items-center justify-center rounded-lg transition-colors",
                            isSameDay(day, new Date()) ? "bg-primary text-white" : "group-hover:bg-primary/10 group-hover:text-primary"
                        )}>
                            {format(day, "d")}
                        </span>

                        <div className="mt-2 space-y-1">
                            {dayEvents.slice(0, 3).map((event) => (
                                <div key={event.id} className={cn(
                                    "px-2 py-1 rounded-md border-l-2 text-[10px] font-bold truncate transition-opacity",
                                    event.status === 'Completed'
                                        ? "bg-green-500/10 border-green-500 text-green-500/50 line-through opacity-60"
                                        : "bg-secondary/10 border-secondary text-secondary"
                                )}>
                                    {event.title}
                                </div>
                            ))}
                        </div>

                        <button
                            className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-primary/0 group-hover:bg-primary/10 text-primary/0 group-hover:text-primary transition-all transition-opacity opacity-0 group-hover:opacity-100"
                            onClick={(e) => { e.stopPropagation(); openForDate(cloneDay); }}
                        >
                            <Plus size={14} />
                        </button>
                    </div>
                );
                day = addDays(day, 1);
            }
            rows.push(<div className="grid grid-cols-7" key={day.toString()}>{days}</div>);
            days = [];
        }

        return (
            <div className="glass-card rounded-2xl overflow-hidden border">
                <div className="grid grid-cols-7 bg-surface-muted dark:bg-card/30 border-b border-border">
                    {dayNames.map(d => (
                        <div key={d} className="py-2 text-center text-[10px] font-black uppercase tracking-widest text-foreground/30">{d}</div>
                    ))}
                </div>
                {rows}
            </div>
        );
    };

    const renderWeekView = () => {
        const start = startOfWeek(currentDate);
        const days = eachDayOfInterval({ start, end: addDays(start, 6) });
        const hours = Array.from({ length: 24 }).map((_, i) => i);

        return (
            <div className="glass-card rounded-2xl overflow-hidden border flex flex-col h-[600px] overflow-y-auto no-scrollbar">
                <div className="grid grid-cols-8 bg-surface-muted dark:bg-card/30 border-b border-border sticky top-0 z-20">
                    <div className="p-4 border-r border-border" />
                    {days.map(d => (
                        <div key={d.toString()} className="p-4 text-center border-r border-border">
                            <p className="text-[10px] font-black uppercase text-foreground/30">{format(d, "EEE")}</p>
                            <p className={cn(
                                "text-lg font-black",
                                isSameDay(d, new Date()) ? "text-primary" : "text-foreground"
                            )}>{format(d, "d")}</p>
                        </div>
                    ))}
                </div>
                {hours.map(h => (
                    <div key={h} className="grid grid-cols-8 border-b border-border/50 min-h-20">
                        <div className="p-2 text-[10px] font-bold text-foreground/30 text-right pr-4 border-r border-border">
                            {format(setHours(new Date(), h), "HH:00")}
                        </div>
                        {days.map(d => {
                            const hourEvents = events.filter(e => isSameDay(e.start, d) && e.start.getHours() === h);
                            return (
                                <div
                                    key={d.toString() + h}
                                    className="border-r border-border/50 p-1 relative group hover:bg-primary/[0.02] transition-colors cursor-crosshair"
                                    onDoubleClick={() => {
                                        setEventTime(`${h.toString().padStart(2, '0')}:00`);
                                        openForDate(d);
                                    }}
                                >
                                    {hourEvents.map(event => (
                                        <div key={event.id} className={cn(
                                            "absolute inset-x-1 p-2 rounded-lg border-l-4 shadow-sm z-10 transition-all",
                                            event.status === 'Completed'
                                                ? "bg-green-500/10 border-green-500 opacity-60"
                                                : "bg-primary/10 border-primary"
                                        )}>
                                            <p className={cn(
                                                "text-[10px] font-black truncate",
                                                event.status === 'Completed' ? "text-green-600 line-through" : "text-primary"
                                            )}>{event.title}</p>
                                            <p className={cn(
                                                "text-[8px] font-bold",
                                                event.status === 'Completed' ? "text-green-600/60" : "text-primary/60"
                                            )}>{format(event.start, "HH:mm")}</p>
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        );
    };

    const renderAgendaView = () => {
        const { updateEvent, deleteEvent } = useAppContext();
        const upcomingEvents = events
            .filter(e => e.start >= startOfDay(new Date()))
            .sort((a, b) => a.start.getTime() - b.start.getTime());

        return (
            <div className="space-y-6">
                {upcomingEvents.length === 0 ? (
                    <div className="py-20 text-center glass-card rounded-3xl">
                        <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CalendarIcon className="text-primary/20" size={40} />
                        </div>
                        <p className="text-foreground/40 font-medium">No upcoming events scheduled.</p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="mt-6 text-sm font-black text-primary uppercase tracking-widest hover:underline"
                        >
                            Schedule your first event
                        </button>
                    </div>
                ) : (
                    upcomingEvents.map((event, idx) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={cn(
                                "glass-card p-6 rounded-2xl flex items-center gap-6 group transition-all",
                                event.status === 'Completed' && "opacity-60 grayscale-[0.5]"
                            )}
                        >
                            <div className={cn(
                                "flex flex-col items-center justify-center p-4 rounded-2xl min-w-20 shadow-lg transition-colors",
                                event.status === 'Completed' ? "bg-green-500 text-white shadow-green-500/20" : "bg-primary text-white shadow-primary/20"
                            )}>
                                <span className="text-xs font-black uppercase">{format(event.start, "MMM")}</span>
                                <span className="text-2xl font-black">{format(event.start, "dd")}</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={cn(
                                        "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest",
                                        event.status === 'Completed' ? "bg-green-500/10 text-green-500" : "bg-secondary/10 text-secondary"
                                    )}>
                                        {event.category}
                                    </span>
                                    {event.status === 'Completed' && (
                                        <span className="px-2 py-0.5 rounded bg-green-500 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                            <CheckCircle2 size={10} /> Completed
                                        </span>
                                    )}
                                </div>
                                <h3 className={cn(
                                    "text-xl font-bold transition-colors",
                                    event.status === 'Completed' ? "text-foreground/40 line-through" : "text-foreground group-hover:text-primary"
                                )}>{event.title}</h3>
                                <div className="flex items-center gap-4 mt-2 text-foreground/40 text-xs font-bold">
                                    <span className="flex items-center gap-1"><Clock size={14} /> {format(event.start, "HH:mm")}</span>
                                    {event.description && <span className="flex items-center gap-1"><MapPin size={14} /> {event.description}</span>}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => updateEvent(event.id, { status: event.status === 'Completed' ? 'Todo' : 'Completed' })}
                                    className={cn(
                                        "p-3 rounded-xl transition-all",
                                        event.status === 'Completed'
                                            ? "bg-green-500 text-white"
                                            : "bg-surface-muted text-foreground/20 hover:bg-green-500 hover:text-white"
                                    )}
                                >
                                    <CheckCircle2 size={20} />
                                </button>
                                <button
                                    onClick={() => deleteEvent(event.id)}
                                    className="p-3 rounded-xl bg-surface-muted text-foreground/20 hover:bg-red-500 hover:text-white transition-all"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        );
    };

    return (
        <div className="space-y-8 pb-20 relative">
            {renderHeader()}

            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <button onClick={prevRange} className="p-2 rounded-xl hover:bg-surface-muted border border-border text-foreground/40 transition-colors">
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 rounded-xl hover:bg-surface-muted border border-border text-xs font-black transition-colors uppercase tracking-widest">
                        Today
                    </button>
                    <button onClick={nextRange} className="p-2 rounded-xl hover:bg-surface-muted border border-border text-foreground/40 transition-colors">
                        <ChevronRight size={20} />
                    </button>
                </div>
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30" size={16} />
                    <input
                        type="text"
                        placeholder="Search events..."
                        className="pl-10 pr-4 py-2 rounded-xl border border-border bg-surface-muted text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-4">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={view}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {view === 'Month' && renderMonthView()}
                            {view === 'Week' && renderWeekView()}
                            {view === 'Agenda' && renderAgendaView()}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Daily Agenda Sidebar */}
                <div className="lg:col-span-4 h-full">
                    <div className="sticky top-8">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass-card rounded-[2.5rem] p-8 space-y-6 h-full min-h-[500px]"
                        >
                            <div>
                                <h3 className="text-2xl font-black text-foreground tracking-tighter italic mb-1">
                                    {format(selectedDate, "dd MMMM")}
                                </h3>
                                <p className="text-xs font-black uppercase tracking-widest text-foreground/30">
                                    {format(selectedDate, "EEEE")}
                                </p>
                            </div>

                            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 no-scrollbar">
                                {(() => {
                                    const dayEvents = events.filter(e => isSameDay(new Date(e.start), selectedDate));
                                    const dayTasks = tasks.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), selectedDate));

                                    const allItems = [
                                        ...dayEvents.map(e => ({ ...e, type: 'event' as const })),
                                        ...dayTasks.map(t => ({ ...t, type: 'task' as const, start: t.dueDate ? new Date(t.dueDate) : selectedDate }))
                                    ].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

                                    if (allItems.length === 0) {
                                        return (
                                            <div className="py-20 text-center opacity-40">
                                                <div className="w-16 h-16 bg-surface-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <Clock size={32} />
                                                </div>
                                                <p className="text-sm font-bold italic tracking-tight">Agenda is clear.</p>
                                            </div>
                                        );
                                    }

                                    return allItems.map((item, idx) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="p-4 rounded-2xl bg-surface-muted/50 border border-border/50 group hover:border-primary/30 transition-all"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={cn(
                                                    "w-1 h-10 rounded-full",
                                                    item.type === 'event' ? "bg-secondary" : "bg-primary"
                                                )} />
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-foreground/30">
                                                            {format(new Date(item.start), "HH:mm")} • {item.type}
                                                        </span>
                                                        {'status' in item && item.status === 'Completed' && (
                                                            <CheckCircle2 size={12} className="text-green-500" />
                                                        )}
                                                    </div>
                                                    <h4 className={cn(
                                                        "font-bold text-foreground leading-tight",
                                                        'status' in item && item.status === 'Completed' && "line-through opacity-40"
                                                    )}>
                                                        {item.title}
                                                    </h4>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ));
                                })()}
                            </div>

                            <InteractiveButton
                                variant="primary"
                                className="w-full py-4 rounded-2xl"
                                onClick={() => openForDate(selectedDate)}
                            >
                                <Plus size={18} />
                                <span>Add New Activity</span>
                            </InteractiveButton>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Add Event Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="glass-card w-full max-w-lg p-8 rounded-[2.5rem] relative shadow-2xl overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full -mr-16 -mt-16" />

                            <h3 className="text-3xl font-black text-foreground tracking-tighter mb-6 italic">Schedule Event</h3>

                            <form onSubmit={handleAddEvent} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/30 px-1">Event Title</label>
                                        <input
                                            autoFocus
                                            required
                                            type="text"
                                            placeholder="What's happening?"
                                            value={eventTitle}
                                            onChange={(e) => setEventTitle(e.target.value)}
                                            className="w-full bg-surface-muted dark:bg-background/40 border-none rounded-2xl p-4 font-bold text-foreground focus:ring-2 focus:ring-primary/20 placeholder:text-foreground/20 italic"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/30 px-1">Date</label>
                                            <input
                                                type="date"
                                                value={eventDate}
                                                onChange={(e) => setEventDate(e.target.value)}
                                                className="w-full bg-surface-muted dark:bg-background/40 border-none rounded-2xl p-4 font-bold text-foreground focus:ring-2 focus:ring-primary/20"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/30 px-1">Start Time (24h)</label>
                                            <div className="flex gap-2">
                                                <select
                                                    value={eventTime.split(":")[0]}
                                                    onChange={(e) => setEventTime(`${e.target.value}:${eventTime.split(":")[1]}`)}
                                                    className="w-full bg-surface-muted dark:bg-background/40 border-none rounded-2xl p-4 font-bold text-foreground focus:ring-2 focus:ring-primary/20 appearance-none text-center"
                                                >
                                                    {Array.from({ length: 24 }).map((_, i) => (
                                                        <option key={i} value={i.toString().padStart(2, '0')}>{i.toString().padStart(2, '0')}</option>
                                                    ))}
                                                </select>
                                                <div className="flex items-center font-black text-foreground/20">:</div>
                                                <select
                                                    value={eventTime.split(":")[1]}
                                                    onChange={(e) => setEventTime(`${eventTime.split(":")[0]}:${e.target.value}`)}
                                                    className="w-full bg-surface-muted dark:bg-background/40 border-none rounded-2xl p-4 font-bold text-foreground focus:ring-2 focus:ring-primary/20 appearance-none text-center"
                                                >
                                                    {["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"].map(m => (
                                                        <option key={m} value={m}>{m}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/30 px-1">Category</label>
                                        <div className="flex flex-wrap gap-2">
                                            {['Meeting', 'Work', 'Personal', 'Other'].map(cat => (
                                                <button
                                                    key={cat}
                                                    type="button"
                                                    onClick={() => setEventCategory(cat)}
                                                    className={cn(
                                                        "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                                                        eventCategory === cat
                                                            ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                                                            : "bg-surface-muted dark:bg-background/40 border-border text-foreground/40 hover:border-primary/30"
                                                    )}
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/30 px-1">Description (Optional)</label>
                                        <textarea
                                            placeholder="Details, location, or notes..."
                                            value={eventDesc}
                                            onChange={(e) => setEventDesc(e.target.value)}
                                            className="w-full bg-surface-muted dark:bg-background/40 border-none rounded-2xl p-4 font-bold text-foreground focus:ring-2 focus:ring-primary/20 placeholder:text-foreground/20 italic min-h-[100px] resize-none"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 py-4 rounded-2xl font-bold text-foreground/40 hover:bg-surface-muted transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-[2] py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/30 hover:bg-primary-dark transition-all transform active:scale-95"
                                    >
                                        Lock in Event
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
