"use client"

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ship, Package, TrendingUp, Anchor, Calendar, Filter, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from "recharts";
import { createClient } from "@/lib/supabase/client";

const COLORS = ['#075985', '#0d9488', '#0369a1', '#2dd4bf', '#0ea5e9'];

export function PublicDashboard() {
  const [month, setMonth] = useState("Semua Bulan");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const months = [
    "Semua Bulan", "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      let query = supabase.from('kunjungan').select('*');
      
      if (month !== "Semua Bulan") {
        query = query.eq('bulan', month);
      }
      query = query.eq('tahun', parseInt(year));

      const { data: result, error } = await query;
      
      if (!error && result) {
        setData(result);
      }
      setIsLoading(false);
    }

    fetchData();
  }, [month, year, supabase]);

  const stats = useMemo(() => {
    const totalProduksi = data.reduce((s, i) => s + (i.total_produksi || 0), 0);
    const totalNilai = data.reduce((s, i) => s + (i.total_nilai || 0), 0);
    const activeVessels = new Set(data.map(i => i.nama_kapal)).size;

    return [
      { title: "Total Kunjungan", value: data.length.toLocaleString('id-ID'), icon: Ship, color: "bg-blue-50 text-blue-600" },
      { title: "Produksi (Kg)", value: totalProduksi.toLocaleString('id-ID'), icon: Package, color: "bg-teal-50 text-teal-600" },
      { title: "Nilai Produksi", value: `Rp ${(totalNilai / 1000000).toFixed(1)}M`, icon: TrendingUp, color: "bg-sky-50 text-sky-600" },
      { title: "Kapal Aktif", value: activeVessels.toString(), icon: Anchor, color: "bg-indigo-50 text-indigo-600" },
    ];
  }, [data]);

  const chartData = useMemo(() => {
    // Aggregasi data bulanan untuk chart
    const summary: Record<string, any> = {};
    data.forEach(item => {
      const m = item.bulan.substring(0, 3);
      if (!summary[m]) summary[m] = { name: m, produksi: 0, nilai: 0 };
      summary[m].produksi += item.total_produksi;
      summary[m].nilai += item.total_nilai / 1000000; // Dalam Juta
    });
    return Object.values(summary);
  }, [data]);

  const fleetData = useMemo(() => {
    const gtSummary: Record<string, number> = {};
    data.forEach(item => {
      const cat = item.gt_category || 'Unknown';
      gtSummary[cat] = (gtSummary[cat] || 0) + 1;
    });
    return Object.entries(gtSummary).map(([name, value]) => ({ name, value }));
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Memuat data real-time...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Filter Section */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 glass-card rounded-2xl sticky top-20 z-40">
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-lg">Filter Periode</h2>
        </div>
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-48">
            <select 
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full h-11 pl-4 pr-10 rounded-xl border bg-white/50 backdrop-blur-sm text-sm focus:ring-2 focus:ring-primary outline-none appearance-none cursor-pointer"
            >
              {months.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
          
          <div className="relative flex-1 md:w-32">
            <select 
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full h-11 pl-4 pr-10 rounded-xl border bg-white/50 backdrop-blur-sm text-sm focus:ring-2 focus:ring-primary outline-none appearance-none cursor-pointer"
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </section>

      {/* KPI Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx} className="border-none shadow-sm overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className={`p-3 rounded-2xl ${stat.color} transition-colors group-hover:bg-primary group-hover:text-white`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-1 tracking-tight">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Main Charts */}
      {data.length > 0 ? (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 border-none shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Tren Produksi & Nilai (M)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend />
                    <Bar dataKey="produksi" name="Produksi (Kg)" fill="#075985" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="nilai" name="Nilai (Juta Rp)" fill="#0d9488" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ship className="h-5 w-5 text-primary" />
                Komposisi Armada
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={fleetData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {fleetData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </section>
      ) : (
        <Card className="p-12 text-center border-dashed">
          <div className="flex flex-col items-center gap-3">
            <Package className="h-12 w-12 text-muted-foreground opacity-20" />
            <h3 className="text-xl font-semibold">Tidak Ada Data</h3>
            <p className="text-muted-foreground">Belum ada data kunjungan untuk periode yang dipilih.</p>
          </div>
        </Card>
      )}
    </div>
  );
}
