import Link from 'next/link';
import { Sparkles, ShieldCheck, Zap, BarChart3 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-blue-500/30">
      {/* Hero Section */}
      <nav className="flex justify-between items-center p-8 max-w-7xl mx-auto">
        <div className="text-xl font-bold tracking-tighter text-blue-400">RIMURU.OS</div>
        <Link href="/login" className="px-5 py-2 rounded-full bg-slate-800 border border-slate-700 text-sm hover:bg-slate-700 transition-all">
          Login Access
        </Link>
      </nav>

      <main className="max-w-4xl mx-auto pt-20 pb-32 px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs mb-6">
          <Sparkles size={14} /> 
          <span>Powered by Gemini 1.5 Flash & Next.js 15</span>
        </div>
        
        <h1 className="text-6xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent">
          Your Personal Agentic <br /> Operating System.
        </h1>
        
        <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
          Satu asisten untuk mengelola jadwal kuliah, keuangan SIA-style, 
          dan analisis data secara otomatis. Dibangun khusus untuk nupers.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <FeatureCard 
            icon={<Zap className="text-yellow-400" />}
            title="Double-Layer AI"
            desc="Interpreter untuk bahasa gaul, Operator untuk eksekusi API."
          />
          <FeatureCard 
            icon={<BarChart3 className="text-blue-400" />}
            title="SIA Finance"
            desc="Kelola utang, piutang, dan arus kas dengan standar akuntansi."
          />
          <FeatureCard 
            icon={<ShieldCheck className="text-green-400" />}
            title="Privacy First"
            desc="Data tersimpan aman di Supabase dengan akses eksklusif."
          />
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: any) {
  return (
    <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 transition-all group">
      <div className="mb-4">{icon}</div>
      <h3 className="font-semibold mb-2 group-hover:text-blue-400 transition-colors">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}