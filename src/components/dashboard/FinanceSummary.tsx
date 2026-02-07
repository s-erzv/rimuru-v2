'use client';

import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

export function FinanceSummary() {
  const [summary, setSummary] = useState({ balance: 0, debt: 0, receivable: 0 });

  // Logic untuk fetch data dari Supabase (Layer 2 result)
  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Widget Utang yang Belum Lunas */}
      <div className="bg-slate-900/80 border border-red-900/30 p-5 rounded-2xl">
        <h3 className="text-xs font-bold text-red-400 uppercase mb-4 tracking-widest">Utang (Payables)</h3>
        <ul className="space-y-3">
          <li className="flex justify-between items-center text-sm">
            <span className="text-slate-400 text-xs">Sewa Hosting (Due: 15 Feb)</span>
            <span className="font-mono text-red-400 font-bold">Rp 150.000</span>
          </li>
          {/* Mapping data dari Supabase di sini */}
        </ul>
      </div>

      {/* Widget Piutang */}
      <div className="bg-slate-900/80 border border-blue-900/30 p-5 rounded-2xl">
        <h3 className="text-xs font-bold text-blue-400 uppercase mb-4 tracking-widest">Piutang (Receivables)</h3>
        <ul className="space-y-3">
          <li className="flex justify-between items-center text-sm">
            <span className="text-slate-400 text-xs">Pinjaman Budi</span>
            <span className="font-mono text-blue-400 font-bold">Rp 50.000</span>
          </li>
        </ul>
      </div>
    </div>
  );
}