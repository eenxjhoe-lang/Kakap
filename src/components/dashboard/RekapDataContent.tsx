"use client"

import { useMemo } from 'react';
import { FileText, Download, Printer, Filter, ChevronRight, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useDataStore } from '@/store/useDataStore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function RekapDataContent() {
  const { kunjungan } = useDataStore();

  const rekapStats = useMemo(() => {
    const totalProduksi = kunjungan.reduce((sum, item) => sum + item.produksiKg, 0);
    const totalNilai = kunjungan.reduce((sum, item) => sum + item.nilaiRp, 0);
    const avgProduksi = kunjungan.length > 0 ? totalProduksi / kunjungan.length : 0;
    
    return {
      totalKunjungan: kunjungan.length,
      totalProduksi,
      totalNilai,
      avgProduksi
    };
  }, [kunjungan]);

  const monthlySummary = useMemo(() => {
    const summary: Record<string, { count: number, produksi: number, nilai: number }> = {};
    
    kunjungan.forEach(item => {
      const key = `${item.bulan} ${item.tahun}`;
      if (!summary[key]) {
        summary[key] = { count: 0, produksi: 0, nilai: 0 };
      }
      summary[key].count += 1;
      summary[key].produksi += item.produksiKg;
      summary[key].nilai += item.nilaiRp;
    });
    
    return Object.entries(summary).map(([label, data]) => ({ label, ...data }));
  }, [kunjungan]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Rekapitulasi Data</h1>
          <p className="text-muted-foreground mt-1">Laporan statistik dan ringkasan operasional pelabuhan.</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="h-10">
            <Printer className="h-4 w-4 mr-2" />
            Cetak Laporan
          </Button>
          <Button className="h-10 shadow-lg shadow-emerald-600/20 bg-emerald-600 hover:bg-emerald-700 text-white">
            <Download className="h-4 w-4 mr-2" />
            Ekspor Excel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-primary text-primary-foreground border-none">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium opacity-80">Total Produksi</p>
              <h3 className="text-xl font-bold">{rekapStats.totalProduksi.toLocaleString('id-ID')} Kg</h3>
            </div>
            <TrendingUp className="h-8 w-8 opacity-20" />
          </CardContent>
        </Card>
        <Card className="bg-secondary text-secondary-foreground border-none">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium opacity-80">Total Nilai</p>
              <h3 className="text-xl font-bold">Rp {rekapStats.totalNilai.toLocaleString('id-ID')}</h3>
            </div>
            <FileText className="h-8 w-8 opacity-20" />
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Total Kunjungan</p>
              <h3 className="text-xl font-bold text-primary">{rekapStats.totalKunjungan} Kapal</h3>
            </div>
            <ChevronRight className="h-8 w-8 text-primary/10" />
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Rata-rata Produksi</p>
              <h3 className="text-xl font-bold text-primary">{rekapStats.avgProduksi.toFixed(0)} Kg/Kapal</h3>
            </div>
            <ChevronRight className="h-8 w-8 text-primary/10" />
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Ringkasan Bulanan</CardTitle>
          <CardDescription>Akumulasi data per periode laporan.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-slate-100 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-bold">Periode</TableHead>
                  <TableHead className="text-center font-bold">Jumlah Kapal</TableHead>
                  <TableHead className="text-right font-bold">Produksi (Kg)</TableHead>
                  <TableHead className="text-right font-bold">Nilai Produksi (Rp)</TableHead>
                  <TableHead className="text-center font-bold">Detail</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monthlySummary.length > 0 ? monthlySummary.map((row, i) => (
                  <TableRow key={i} className="hover:bg-slate-50/50">
                    <TableCell className="font-bold text-slate-800">{row.label}</TableCell>
                    <TableCell className="text-center">{row.count} Kapal</TableCell>
                    <TableCell className="text-right font-mono font-bold text-emerald-600">{row.produksi.toLocaleString('id-ID')}</TableCell>
                    <TableCell className="text-right font-mono font-bold text-primary">{row.nilai.toLocaleString('id-ID')}</TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="sm" className="h-8 text-primary hover:bg-primary/5">
                        Lihat Rincian
                      </Button>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground italic">
                      Tidak ada data untuk direkap.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
