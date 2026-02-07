'use client';

import { useChat } from 'ai/react';
import { Calendar as CalendarIcon, Wallet, CreditCard, MessageSquare, TrendingUp } from 'lucide-react';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { FinanceSummary } from '@/components/dashboard/FinanceSummary';
import { CalendarView } from '@/components/dashboard/CalendarView';

export default function DashboardPage() {
  // useChat akan otomatis terhubung ke /api/chat yang sudah kita buat tadi
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
  });

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200 font-sans">
      {/* SIDEBAR ANALISIS (Kiri) */}
      <aside className="w-2/3 flex flex-col border-r border-slate-800 p-6 overflow-y-auto space-y-6">
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            RIMURU COMMAND CENTER
          </h1>
          <div className="text-xs text-slate-500 font-mono">v2.0.0-stable</div>
        </header>

        {/* Grid Analisis Keuangan (SIA Style) */}
        <div className="grid grid-cols-3 gap-4">
          <FinanceSummary title="Total Saldo" type="balance" icon={<Wallet className="text-green-400" />} />
          <FinanceSummary title="Utang (Debts)" type="debt" icon={<CreditCard className="text-red-400" />} />
          <FinanceSummary title="Piutang (Receivables)" type="receivable" icon={<TrendingUp className="text-blue-400" />} />
        </div>

        {/* Kalender & Jadwal Kuliah */}
        <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 flex-1">
          <div className="flex items-center gap-2 mb-4 text-slate-400">
            <CalendarIcon size={18} />
            <h2 className="font-semibold text-sm uppercase tracking-wider">Jadwal & Kuliah</h2>
          </div>
          <CalendarView />
        </section>
      </aside>

      {/* CHATBOT INTERFACE (Kanan) */}
      <section className="w-1/3 flex flex-col bg-slate-900/30">
        <ChatPanel 
          messages={messages} 
          input={input} 
          handleInputChange={handleInputChange} 
          handleSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </section>
    </div>
  );
}