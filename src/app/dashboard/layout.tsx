"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Ship, Package, TrendingUp, Anchor, Clock, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function DashboardPage() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchSummary() {
      const { data: result } = await supabase.from('kunjungan').select('*').limit(10);
      if (result) setData(result);
      setIsLoading(false);
    }
    fetchSummary();
  }, [supabase]);

  const totals = {
    produksi: data.reduce((s, i) => s + (i.total_produksi || 0), 0),
    kapal: data.length,
    users: 1 // Placeholder for users count
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-primary">Overview Operasional</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border-primary/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Produksi (Data Terakhir)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.produksi.toLocaleString('id-ID')} Kg</div>
            <p className="text-xs text-muted-foreground">Dari {totals.kapal} entri terbaru</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-primary/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kapal Terdaftar</CardTitle>
            <Ship className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.kapal} Kapal</div>
            <p className="text-xs text-muted-foreground">Tercatat di sistem</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-primary/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Sistem</CardTitle>
            <Anchor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Aktif</div>
            <p className="text-xs text-muted-foreground">Terhubung ke Supabase Auth</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-primary/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status Server</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">Online</div>
            <p className="text-xs text-muted-foreground">Sinkronisasi aktif</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 shadow-sm border-primary/5">
          <CardHeader>
            <CardTitle>Log Aktivitas Terbaru</CardTitle>
            <CardDescription>Daftar kunjungan terakhir yang masuk ke sistem.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-4 mt-2">
                {data.length > 0 ? data.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-md shadow-sm">
                        <Ship className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">{item.nama_kapal}</p>
                        <p className="text-xs text-muted-foreground">{item.tanggal}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-mono font-bold text-primary">{item.total_produksi.toLocaleString('id-ID')} Kg</p>
                      <p className="text-[10px] text-muted-foreground uppercase">{item.gt_category}</p>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-10 text-muted-foreground italic">
                    Belum ada data aktivitas.
                  </div>
                )}
             </div>
          </CardContent>
        </Card>
        <Card className="col-span-3 shadow-sm border-primary/5 bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          <CardHeader>
            <CardTitle>Status Database</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 relative z-10">
            <p className="text-sm opacity-90 leading-relaxed">
              Sistem Anda sekarang terhubung langsung ke **Supabase Real-time Database**.
            </p>
            <div className="p-4 rounded-xl bg-white/10 border border-white/20">
              <p className="text-xs font-bold uppercase tracking-wider mb-1">Tips:</p>
              <p className="text-sm">Gunakan menu <strong>Kelola Data</strong> untuk mengunggah file Excel Anda. Data akan langsung muncul di sini setelah diproses.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
