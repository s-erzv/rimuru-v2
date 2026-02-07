import { MessageSquare, Send, Sparkles } from 'lucide-react';

export function ChatPanel({ messages, input, handleInputChange, handleSubmit, isLoading }: any) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center gap-2">
        <Sparkles size={16} className="text-blue-400" />
        <span className="font-bold text-sm tracking-widest text-blue-100">RIMURU AI</span>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m: any) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
              m.role === 'user' 
              ? 'bg-blue-600 text-white rounded-tr-none' 
              : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && <div className="text-xs text-slate-500 animate-pulse">Rimuru lagi mikir...</div>}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 bg-slate-900/80 border-t border-slate-800">
        <div className="relative">
          <input
            value={input}
            onChange={handleInputChange}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 px-4 pr-12 text-sm focus:outline-none focus:border-blue-500 transition-all"
            placeholder="Tulis pesan..."
          />
          <button type="submit" className="absolute right-2 top-2 p-1.5 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors">
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}