'use client';

// Ganti import-nya ke @supabase/ssr
import { createBrowserClient } from '@supabase/ssr';
import { Sparkles } from 'lucide-react';

export default function LoginPage() {
  // Inisialisasi client browser yang support SSR/PKCE dengan benar
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Ini WAJIB untuk Next.js App Router agar server bisa baca 'code'
        flowType: 'pkce',
        redirectTo: `${window.location.origin}/auth/callback`,
        // Tambahan buat mastiin Google nggak pake cache session lama
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    
    if (error) console.error("Login error:", error.message);
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900/50 border border-slate-800 text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter text-white">Access Restricted</h1>
          <p className="text-slate-400 text-sm">Identity verification required for Rimuru.OS</p>
        </div>

        <button 
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white text-black font-bold py-4 rounded-2xl hover:bg-slate-200 transition-all group"
        >
          <Sparkles size={18} className="group-hover:animate-spin" />
          Authenticate with Google
        </button>
      </div>
    </div>
  );
}