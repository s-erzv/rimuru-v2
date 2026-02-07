import { googleModel } from '@/lib/ai/models';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { getGoogleCalendarClient } from '@/lib/google-calendar';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: googleModel('gemini-1.5-flash'),
    system: `Kamu adalah Rimuru, asisten pribadi nupers.
    User adalah seorang mahasiswa Sistem Informasi yang suka coding (vibe coder).
    
    Tugas Utama:
    1. Manage Jadwal: Masukin ke Google Calendar.
    2. Manage Keuangan (SIA Style): Bisa catat pengeluaran, pemasukan, utang, piutang, dan sewa di muka.
    
    Kategori Keuangan:
    - Income: Uang Mingguan, Freelance, Lainnya.
    - Expense: Makan, Perlengkapan, Peralatan, App Premium, dll.
    
    Gunakan bahasa gaul Jakarta (gue/lo) yang santai tapi pinter.`,
    messages,
    maxSteps: 5,
    tools: {
      // --- TOOL JADWAL ---
      manageSchedule: tool({
        description: 'Tambah jadwal ke Google Calendar',
        parameters: z.object({
          summary: z.string(),
          startISO: z.string(),
          endISO: z.string(),
        }),
        execute: async ({ summary, startISO, endISO }) => {
          const calendar = await getGoogleCalendarClient();
          await calendar.events.insert({
            calendarId: process.env.GOOGLE_CALENDAR_ID,
            requestBody: {
              summary,
              start: { dateTime: startISO, timeZone: 'Asia/Jakarta' },
              end: { dateTime: endISO, timeZone: 'Asia/Jakarta' },
            },
          });
          return { success: true };
        },
      }),

      // --- TOOL FINANCE (SIA) ---
      manageFinance: tool({
        description: 'Catat transaksi keuangan: pemasukan, pengeluaran, utang, piutang',
        parameters: z.object({
          type: z.enum(['income', 'expense', 'debt', 'receivable', 'prepaid']),
          item: z.string(),
          amount: z.number(),
          category: z.string().optional(),
          dueDate: z.string().optional(), // ISO date untuk utang/piutang
        }),
        execute: async ({ type, item, amount, category, dueDate }) => {
          // Cari ID kategori dulu (sederhananya kita match by name atau simpan string)
          const { data: catData } = await supabase
            .from('categories')
            .select('id')
            .ilike('name', `%${category}%`)
            .single();

          const { error } = await supabase.from('finances').insert([{
            item,
            amount,
            type,
            category_id: catData?.id,
            due_date: dueDate,
            is_settled: false
          }]);

          if (error) throw error;
          return { message: `Catatan ${type} "${item}" berhasil disimpan, nupers!` };
        },
      }),

      // --- TOOL CEK SALDO / LAPORAN ---
      getFinancialReport: tool({
        description: 'Cek total saldo, utang, atau piutang saat ini',
        parameters: z.object({
          queryType: z.enum(['balance', 'debts', 'receivables']),
        }),
        execute: async ({ queryType }) => {
          const { data } = await supabase.from('finances').select('*');
          // Logic kalkulasi di sini (Total Income - Total Expense)
          return { data: data || [] };
        }
      })
    },
  });

  return result.toDataStreamResponse();
}