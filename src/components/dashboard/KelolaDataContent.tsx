"use client"

import { useState, useRef, useMemo } from 'react';
import { Upload, Plus, Edit, Trash2, X, RefreshCw, Search, Filter, Ship, Package, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useDataStore, type DataKunjungan } from '@/store/useDataStore';
import { parseExcelData } from '@/lib/utils/excel-parser';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function KelolaDataContent() {
  const { kunjungan, setKunjungan, setLoading, isLoading } = useDataStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMonth, setFilterMonth] = useState('Semua');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uniqueMonths = useMemo(() => {
    const months = new Set(kunjungan.map(k => k.bulan));
    return ['Semua', ...Array.from(months)].sort();
  }, [kunjungan]);

  const filteredData = useMemo(() => {
    return kunjungan.filter(item => {
      const matchSearch = item.namaKapal.toLowerCase().includes(searchTerm.toLowerCase());
      const matchMonth = filterMonth === 'Semua' || item.bulan === filterMonth;
      return matchSearch && matchMonth;
    });
  }, [kunjungan, searchTerm, filterMonth]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const binaryStr = evt.target?.result as string;
      const trips = parseExcelData(binaryStr);
      
      if (trips.length > 0) {
        setKunjungan([...kunjungan, ...trips]);
        alert(`Berhasil mengimpor ${trips.length} data kunjungan.`);
      } else {
        alert("Gagal mengimpor data. Pastikan format Excel sesuai.");
      }
      setLoading(false);
    };
    reader.readAsBinaryString(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Kelola Data Master</h1>
          <p className="text-muted-foreground mt-1">Manajemen data kunjungan kapal dan aktivitas produksi pelabuhan.</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <input 
            type="file" 
            accept=".xlsx, .xls" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
          <Button variant="outline" className="h-10" onClick={() => fileInputRef.current?.click()} disabled={isLoading}>
            {isLoading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
            Import Excel
          </Button>
          <Button className="h-10 shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Manual
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 border-none shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-4 w-4 text-primary" />
              Filter Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Cari Kapal</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Nama kapal..." 
                  className="pl-9" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Pilih Bulan</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <select 
                  className="w-full h-10 pl-9 pr-4 rounded-md border border-input bg-background text-sm focus:ring-2 focus:ring-primary outline-none appearance-none"
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.target.value)}
                >
                  {uniqueMonths.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>
            <Button variant="ghost" className="w-full text-xs" onClick={() => { setSearchTerm(''); setFilterMonth('Semua'); }}>
              Reset Semua Filter
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 border-none shadow-sm">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Daftar Kunjungan</CardTitle>
              <CardDescription>Menampilkan {filteredData.length} entri data.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-slate-100 overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="font-bold">Tanggal</TableHead>
                    <TableHead className="font-bold">Nama Kapal</TableHead>
                    <TableHead className="font-bold">Jenis Ikan</TableHead>
                    <TableHead className="text-right font-bold">Produksi (Kg)</TableHead>
                    <TableHead className="text-center font-bold">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length > 0 ? filteredData.slice(0, 50).map((item) => (
                    <TableRow key={item.id} className="hover:bg-slate-50/50">
                      <TableCell className="text-xs font-medium">{item.tanggal}</TableCell>
                      <TableCell className="font-bold text-slate-800">{item.namaKapal}</TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-[150px] truncate">{item.jenisIkan}</TableCell>
                      <TableCell className="text-right font-mono font-bold text-primary">{item.produksiKg.toLocaleString('id-ID')}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:bg-blue-50">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-32 text-center text-muted-foreground italic">
                        Belum ada data. Silakan import file Excel atau tambah manual.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            {filteredData.length > 50 && (
              <div className="mt-4 text-center">
                <p className="text-xs text-muted-foreground">Menampilkan 50 data terbaru. Gunakan filter untuk mencari data spesifik.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
