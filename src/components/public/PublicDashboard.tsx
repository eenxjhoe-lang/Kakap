"use client"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ship, Package, TrendingUp, Anchor, Calendar, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, Legend 
} from "recharts";

const COLORS = ['#075985', '#0d9488', '#0369a1', '#2dd4bf', '#0ea5e9'];

// Mock Data
const monthlyData = [
  { name: 'Jan', produksi: 4000, nilai: 2400 },
  { name: 'Feb', produksi: 3000, nilai: 1398 },
  { name: 'Mar', produksi: 2000, nilai: 9800 },
  { name: 'Apr', produksi: 2780, nilai: 3908 },
  { name: 'Mei', produksi: 1890, nilai: 4800 },
  { name: 'Jun', produksi: 2390, nilai: 3800 },
];

const fleetData = [
  { name: '< 5 GT', value: 400 },
  { name: '5-10 GT', value: 300 },
  { name: '11-20 GT', value: 300 },
  { name: '21-30 GT', value: 200 },
  { name: '> 30 GT', value: 100 },
];

export function PublicDashboard() {
  const [month, setMonth] = useState("Semua Bulan");
  const [year, setYear] = useState("2024");

  const months = [
    "Semua Bulan", "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

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

          <Button className="h-11 px-8 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
            Tampilkan
          </Button>
        </div>
      </section>

      {/* KPI Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Kunjungan", value: "1,284", icon: Ship, trend: "+12%", color: "bg-blue-50 text-blue-600" },
          { title: "Produksi (Kg)", value: "842,500", icon: Package, trend: "+5.4%", color: "bg-teal-50 text-teal-600" },
          { title: "Nilai Produksi", value: "Rp 12.4M", icon: TrendingUp, trend: "+8.2%", color: "bg-sky-50 text-sky-600" },
          { title: "Kapal Aktif", value: "156", icon: Anchor, trend: "+3", color: "bg-indigo-50 text-indigo-600" },
        ].map((stat, idx) => (
          <Card key={idx} className="border-none shadow-sm overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className={`p-3 rounded-2xl ${stat.color} transition-colors group-hover:bg-primary group-hover:text-white`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{stat.trend}</span>
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
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Tren Produksi & Nilai (Bulanan)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend />
                  <Bar dataKey="produksi" name="Produksi (Kg)" fill="#075985" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="nilai" name="Nilai (Rp)" fill="#0d9488" radius={[4, 4, 0, 0]} />
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
      
      {/* Top Species Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Top 5 Jenis Ikan Terbanyak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 py-4">
              {[
                { name: "Kembung", weight: "120,500 Kg", percent: 85, color: "bg-blue-600" },
                { name: "Layang", weight: "98,200 Kg", percent: 70, color: "bg-teal-600" },
                { name: "Tongkol", weight: "75,400 Kg", percent: 55, color: "bg-sky-600" },
                { name: "Cumi-cumi", weight: "42,100 Kg", percent: 40, color: "bg-cyan-600" },
                { name: "Tenggiri", weight: "12,300 Kg", percent: 20, color: "bg-indigo-600" },
              ].map((fish, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm items-center">
                    <span className="font-semibold text-slate-700">{fish.name}</span>
                    <span className="text-muted-foreground font-mono">{fish.weight}</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${fish.color} transition-all duration-1000 ease-out`} 
                      style={{ width: `${fish.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          <CardHeader>
            <CardTitle className="text-white">Informasi Terbaru</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 relative z-10">
            <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
              <h4 className="font-bold text-lg">Puncak Musim Tangkap</h4>
              <p className="text-sm text-primary-foreground/80 mt-1">
                Data menunjukkan peningkatan volume produksi sebesar 24% pada komoditas Kembung di bulan Maret.
              </p>
            </div>
            <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
              <h4 className="font-bold text-lg">Aktivitas Kapal Tertinggi</h4>
              <p className="text-sm text-primary-foreground/80 mt-1">
                Hari Selasa mencatatkan rata-rata kunjungan kapal tertinggi mencapai 45 kapal per hari.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
