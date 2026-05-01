import { PublicDashboard } from "@/components/public/PublicDashboard";

export default function PublicPage() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-4xl mx-auto py-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Live Data Pelabuhan
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
          Monitoring Produksi & <br />
          <span className="text-primary italic">Kunjungan Kapal</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Akses data real-time aktivitas pelabuhan perikanan dengan transparansi data produksi untuk pengelolaan yang lebih baik.
        </p>
      </section>

      {/* Interactive Dashboard */}
      <PublicDashboard />
    </div>
  );
}
