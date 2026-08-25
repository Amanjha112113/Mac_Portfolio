'use client';

import { useState } from 'react';
import { cn } from '@/lib/cn';
import { 
  ChevronLeft, ChevronRight, Plus, Search, Calendar as CalendarIcon, 
  Clock, MapPin, Tag, Check, Sparkles, AlertCircle
} from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  date: number; // Day of month
  time: string;
  category: 'career' | 'research' | 'project' | 'open';
  color: string;
  description: string;
  location?: string;
}

const EVENTS: CalendarEvent[] = [
  { id: '1', title: 'Open for AI/ML Engineering Roles', date: 3, time: 'All Day', category: 'open', color: 'bg-emerald-500', description: 'Available for full-time AI Engineer and Research roles worldwide.', location: 'Remote / Global' },
  { id: '2', title: 'Speaker Recognition V2 Release', date: 12, time: '10:00 AM', category: 'project', color: 'bg-purple-500', description: 'Deep learning speaker identification system deployed on WebSockets.', location: 'GitHub' },
  { id: '3', title: 'Talent Intelligence Pipeline Review', date: 18, time: '2:30 PM', category: 'research', color: 'bg-blue-500', description: 'Autonomous agentic multi-step reasoning evaluation pass.', location: 'Lab' },
  { id: '4', title: 'Aman AI Voice Assistant Launch', date: 25, time: '9:00 AM', category: 'career', color: 'bg-rose-500', description: 'Realtime WebRTC voice portfolio assistant live deployment.', location: 'Portfolio OS' },
];

const DAYS_OF_WEEK = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export default function Calendar() {
  const [selectedDay, setSelectedDay] = useState<number>(25);
  const [activeEvent, setActiveEvent] = useState<CalendarEvent | null>(EVENTS[3]);

  // Current month rendering: August 2026 (Starts on Saturday, 31 days)
  const firstDayIndex = 6; // Saturday
  const totalDays = 31;
  const daysArray = Array.from({ length: 42 }, (_, i) => {
    const dayNum = i - firstDayIndex + 1;
    return dayNum > 0 && dayNum <= totalDays ? dayNum : null;
  });

  return (
    <div className="flex flex-col h-full bg-[#1e1e24] text-white/90 overflow-hidden font-sans select-none">
      {/* Calendar Header / Toolbar */}
      <div className="h-13 bg-[#2a2a32] border-b border-white/10 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors">
              <ChevronLeft size={16} />
            </button>
            <button className="p-1.5 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
          <button className="px-2.5 py-1 bg-white/10 hover:bg-white/15 rounded-md text-xs font-semibold text-white transition-colors">
            Today
          </button>
          <span className="font-bold text-sm text-white ml-2">August 2026</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-black/40 p-0.5 rounded-lg border border-white/10 text-xs">
            <button className="px-2.5 py-1 rounded-md text-white/50 hover:text-white">Day</button>
            <button className="px-2.5 py-1 rounded-md text-white/50 hover:text-white">Week</button>
            <button className="px-2.5 py-1 rounded-md bg-white/20 text-white font-medium shadow-sm">Month</button>
            <button className="px-2.5 py-1 rounded-md text-white/50 hover:text-white">Year</button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 bg-[#18181e] border-r border-white/10 flex flex-col p-4 shrink-0 overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Calendars</h3>
            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2.5 cursor-pointer text-white/80 hover:text-white">
                <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm" />
                <span>Career Availability</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer text-white/80 hover:text-white">
                <span className="w-3 h-3 rounded-full bg-purple-500 shadow-sm" />
                <span>AI Projects</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer text-white/80 hover:text-white">
                <span className="w-3 h-3 rounded-full bg-blue-500 shadow-sm" />
                <span>Research Reviews</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer text-white/80 hover:text-white">
                <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm" />
                <span>Major Launches</span>
              </label>
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Upcoming Timeline</h3>
            <div className="space-y-2.5">
              {EVENTS.map((ev) => (
                <div
                  key={ev.id}
                  onClick={() => {
                    setSelectedDay(ev.date);
                    setActiveEvent(ev);
                  }}
                  className={cn(
                    "p-2.5 rounded-xl border transition-all cursor-pointer",
                    activeEvent?.id === ev.id 
                      ? "bg-white/10 border-white/20 shadow-md" 
                      : "bg-white/5 border-white/5 hover:bg-white/10"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn("w-2 h-2 rounded-full shrink-0", ev.color)} />
                    <span className="font-semibold text-xs text-white truncate">{ev.title}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-white/50 pl-4">
                    <span>Aug {ev.date}, 2026</span>
                    <span>{ev.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Month Grid View */}
        <div className="flex-1 flex flex-col bg-[#141418] overflow-hidden">
          {/* Day of week headers */}
          <div className="grid grid-cols-7 border-b border-white/10 bg-[#1c1c22]">
            {DAYS_OF_WEEK.map((d, i) => (
              <div key={d} className={cn("py-2 text-center text-[11px] font-semibold", i === 0 || i === 6 ? "text-white/30" : "text-white/60")}>
                {d}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="flex-1 grid grid-cols-7 grid-rows-6 divide-x divide-y divide-white/5 overflow-y-auto">
            {daysArray.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="bg-[#101014]/50" />;
              }

              const dayEvents = EVENTS.filter(e => e.date === day);
              const isSelected = selectedDay === day;
              const isToday = day === 25;

              return (
                <div
                  key={`day-${day}`}
                  onClick={() => {
                    setSelectedDay(day);
                    if (dayEvents.length > 0) setActiveEvent(dayEvents[0]);
                  }}
                  className={cn(
                    "p-1.5 flex flex-col min-h-[70px] transition-colors cursor-pointer relative",
                    isSelected ? "bg-white/10" : "hover:bg-white/5",
                    isToday && "bg-blue-500/10"
                  )}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className={cn(
                      "w-5 h-5 flex items-center justify-center rounded-full text-xs font-semibold",
                      isToday ? "bg-blue-500 text-white shadow-sm" : isSelected ? "text-white font-bold" : "text-white/70"
                    )}>
                      {day}
                    </span>
                  </div>

                  <div className="space-y-1 overflow-hidden">
                    {dayEvents.map(ev => (
                      <div
                        key={ev.id}
                        className={cn(
                          "px-1.5 py-0.5 rounded text-[10px] font-medium text-white truncate shadow-sm",
                          ev.color
                        )}
                        title={ev.title}
                      >
                        {ev.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
