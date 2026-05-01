import { create } from 'zustand';

export interface IkanBreakdown {
  jenis: string;
  kg: number;
  nilai: number;
}

export interface DataKunjungan {
  id: string;
  bulan: string;
  tahun: number;
  tanggal: string;
  tglTiba: string;
  tglBerangkat: string;
  noStblkk: string;
  namaKapal: string;
  tandaSelar: string;
  gt: string;
  gtCategory: string;
  nakhoda: string;
  perusahaan: string;
  mesin: string;
  abk: string;
  jenisKapal: string;
  kegiatan: string;
  alatTangkap: string;
  jenisIkan: string;
  ikanBreakdown: IkanBreakdown[];
  produksiKg: number;
  nilaiRp: number;
  // Logistik
  es: number;
  air: number;
  solar: number;
  oli: number;
  gas: number;
  bensin: number;
  beras: number;
  garam: number;
  gula: number;
  minyak: number;
  rokok: number;
}

interface DataStoreState {
  kunjungan: DataKunjungan[];
  isLoading: boolean;
  setKunjungan: (data: DataKunjungan[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useDataStore = create<DataStoreState>((set) => ({
  kunjungan: [],
  isLoading: false,
  setKunjungan: (data) => set({ kunjungan: data }),
  setLoading: (loading) => set({ isLoading: loading }),
}));
