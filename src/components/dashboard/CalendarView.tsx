'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<any[]>([]);
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Fetch jadwal dari Supabase (Layer 2 result)
  const fetchSchedules = async () => {
    const { data } = await supabase
      .from('schedules')
      .select('*')
      .order('date', { ascending: true });
    if (data) setEvents(data);
  };

  useEffect(() => {
    fetchSchedules();
    
    // Realtime: dengerin kalau Rimuru nambahin jadwal baru
    const channel = supabase.channel('schema-db-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'schedules' }, 
      () => fetchSchedules())
      .subscribe();

    return () => { supabase.removeChannel(channel) };
  }, []);

  // Logic Kalender Sederhana
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  return (
    <div className="space-y-6">
      {/* Header Kalender */}
      <div className="flex justify-between items-center bg-slate-800/30 p-3 rounded-xl border border-slate-700">
        <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}>
          <ChevronLeft size={18} />
        </button>
        <h3 className="font-bold text-sm tracking-widest uppercase">{monthName} {currentDate.getFullYear()}</h3>
        <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}>
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Grid Tanggal */}
      <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-slate-500 mb-2">
        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => <div key={d}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={i} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const hasEvent = events.some(e => new Date(e.date).getDate() === day && new Date(e.date).getMonth() === currentDate.getMonth());
          return (
            <div key={i} className={`aspect-square flex items-center justify-center rounded-lg text-xs relative border ${
              hasEvent ? 'border-blue-500 bg-blue-500/10 text-blue-400' : 'border-slate-800 text-slate-600'
            }`}>
              {day}
              {hasEvent && <div className="absolute bottom-1 w-1 h-1 bg-blue-400 rounded-full" />}
            </div>
          );
        })}
      </div>

      {/* List Jadwal Mendatang */}
      <div className="space-y-3 pt-4 border-t border-slate-800">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-tighter flex items-center gap-2">
          <Clock size={12} /> Upcoming Agenda
        </h4>
        <div className="max-h-[200px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          {events.length > 0 ? events.slice(0, 5).map(event => (
            <div key={event.id} className="p-3 bg-slate-900/50 border border-slate-800 rounded-xl flex flex-col gap-1">
              <span className="text-white text-xs font-medium">{event.content}</span>
              <span className="text-[10px] text-slate-500">
                {new Date(event.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
              </span>
            </div>
          )) : <div className="text-xs text-slate-600 italic text-center py-4">Belum ada agenda...</div>}
        </div>
      </div>
    </div>
  );
}