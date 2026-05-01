import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Ship, Package, TrendingUp, Anchor, AlertCircle, Clock } from "lucide-react";

export default function DashboardPage() {
  const recentActivities = [
    { type: "Import", desc: "Data Januari_2024.xlsx berhasil diimpor", time: "2 jam yang lalu", icon: Package, color: "text-blue-500" },
    { type: "Delete", desc: "Data kapal KM. Harapan dihapus", time: "5 jam yang lalu", icon: AlertCircle, color: "text-red-500" },
    { type: "User", desc: "Operator baru 'Budi' ditambahkan", time: "1 hari yang lalu", icon: Anchor, color: "text-teal-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-primary">Overview Operasional</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border-primary/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Produksi Hari Ini</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4,285 Kg</div>
            <p className="text-xs text-muted-foreground">+20.1% dari rata-rata harian</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-primary/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kapal Sedang Bongkar</CardTitle>
            <Ship className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12 Kapal</div>
            <p className="text-xs text-muted-foreground">3 kapal dalam antrean</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-primary/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total User Aktif</CardTitle>
            <Anchor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8 User</div>
            <p className="text-xs text-muted-foreground">3 Admin, 5 Operator</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-primary/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Akurasi Data</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.8%</div>
            <p className="text-xs text-muted-foreground">Sinkronisasi terakhir 5 menit lalu</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 shadow-sm border-primary/5">
          <CardHeader>
            <CardTitle>Aktivitas Logistik Terbaru</CardTitle>
            <CardDescription>Ringkasan penggunaan perbekalan kapal hari ini.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-8 mt-4">
                {[
                  { label: "Bahan Bakar (Solar)", value: "1.200 Liter", progress: 75, color: "bg-blue-600" },
                  { label: "Es Batang", value: "850 Balok", progress: 60, color: "bg-sky-400" },
                  { label: "Air Tawar", value: "5.000 Liter", progress: 45, color: "bg-teal-500" },
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between text-sm font-medium">
                      <span>{item.label}</span>
                      <span>{item.value}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color}`} style={{ width: `${item.progress}%` }} />
                    </div>
                  </div>
                ))}
             </div>
          </CardContent>
        </Card>
        <Card className="col-span-3 shadow-sm border-primary/5">
          <CardHeader>
            <CardTitle>Log Aktivitas</CardTitle>
            <CardDescription>Riwayat perubahan data oleh sistem dan user.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 mt-4">
              {recentActivities.map((activity, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={`mt-1 p-2 rounded-lg bg-slate-50 ${activity.color}`}>
                    <activity.icon className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.desc}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
