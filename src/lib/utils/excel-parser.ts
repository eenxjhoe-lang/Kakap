import * as XLSX from 'xlsx';
import { DataKunjungan } from '@/store/useDataStore';

export const parseExcelData = (binaryStr: string): DataKunjungan[] => {
  const wb = XLSX.read(binaryStr, { type: 'binary' });
  const wsname = wb.SheetNames[0];
  const ws = wb.Sheets[wsname];
  
  const rows: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });
  if (rows.length < 5) return [];

  // Dynamic column mapping logic from legacy version
  let colIdx: Record<string, number> = {};
  
  const findHeaders = () => {
    for (let i = 0; i < 15; i++) {
      const row = rows[i];
      if (!row) continue;
      const rowStr = row.map(c => String(c || '').toUpperCase());
      if (rowStr.includes('NAMA KAPAL') || rowStr.includes('NAMA_KAPAL')) {
        rowStr.forEach((cell, idx) => {
          if (cell.includes('NO')) colIdx['no'] = idx;
          if (cell.includes('NAMA KAPAL')) colIdx['namaKapal'] = idx;
          if (cell.includes('TANGGAL')) colIdx['tanggal'] = idx;
          if (cell.includes('JUMLAH') || cell.includes('KG')) colIdx['produksi'] = idx;
          if (cell.includes('NILAI') || cell.includes('RP')) colIdx['nilai'] = idx;
          if (cell.includes('JENIS IKAN') || cell.includes('IKAN')) colIdx['jenisIkan'] = idx;
          if (cell.includes('GT')) colIdx['gt'] = idx;
          if (cell.includes('KEGIATAN')) colIdx['kegiatan'] = idx;
          if (cell.includes('ALAT TANGKAP')) colIdx['alatTangkap'] = idx;
          if (cell.includes('LOGISTIK')) colIdx['logistik'] = idx;
          if (cell.includes('TIBA')) colIdx['tglTiba'] = idx;
          if (cell.includes('BERANGKAT')) colIdx['tglBerangkat'] = idx;
        });
        return i;
      }
    }
    return -1;
  };

  const headerRowIdx = findHeaders();
  if (headerRowIdx === -1) return [];

  const logIdx = colIdx['logistik'] || 20;
  const logisticsMapping = {
    es: logIdx, air: logIdx + 1, solar: logIdx + 2, oli: logIdx + 3,
    gas: logIdx + 4, bensin: logIdx + 5, beras: logIdx + 6, garam: logIdx + 7,
    gula: logIdx + 8, minyak: logIdx + 9, rokok: logIdx + 10,
  };

  const trips: DataKunjungan[] = [];
  let currentTrip: DataKunjungan | null = null;

  const parseNum = (val: any): number => {
    if (val === null || val === undefined) return 0;
    const s = String(val).replace(/[^0-9.-]+/g, '');
    const n = parseFloat(s);
    return isNaN(n) ? 0 : n;
  };

  const formatDate = (val: any): string => {
    if (!val) return new Date().toISOString().split('T')[0];
    if (typeof val === 'number' && val > 40000) {
      const d = XLSX.SSF.parse_date_code(val);
      return `${d.y}-${String(d.m).padStart(2,'0')}-${String(d.d).padStart(2,'0')}`;
    }
    return String(val).substring(0, 10);
  };

  const classifyGT = (gt: any): string => {
    const num = parseNum(gt);
    if (num === 0 || num < 5) return '< 5 GT';
    if (num <= 10) return '5 - 10 GT';
    if (num <= 20) return '11 - 20 GT';
    if (num <= 30) return '21 - 30 GT';
    return '> 30 GT';
  };

  for (let i = headerRowIdx + 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0) continue;

    const noVal = row[colIdx['no']];
    const namaKapal = row[colIdx['namaKapal']];
    const produksi = parseNum(row[colIdx['produksi']]);
    const nilai = parseNum(row[colIdx['nilai']]);
    const jenisIkan = String(row[colIdx['jenisIkan']] || '').trim();

    if (String(noVal || '').toUpperCase().includes('TOTAL')) continue;
    if (!noVal && !namaKapal && produksi === 0) continue;

    const isMainRow = (noVal !== null && !isNaN(Number(noVal))) || (namaKapal !== null && String(namaKapal).trim().length > 0);

    if (isMainRow && namaKapal) {
      const tanggalStr = formatDate(row[colIdx['tanggal']]);
      const currentJenisIkan = jenisIkan || 'Campur';
      const date = new Date(tanggalStr);
      
      currentTrip = {
        id: `import-${Date.now()}-${i}`,
        bulan: date.toLocaleString('id-ID', { month: 'long' }),
        tahun: date.getFullYear(),
        tanggal: tanggalStr,
        tglTiba: formatDate(row[colIdx['tglTiba']]),
        tglBerangkat: formatDate(row[colIdx['tglBerangkat']]),
        noStblkk: String(row[colIdx['noStblkk']] || ''),
        namaKapal: String(namaKapal),
        tandaSelar: String(row[colIdx['tandaSelar']] || ''),
        gt: String(row[colIdx['gt']] || '0'),
        gtCategory: classifyGT(row[colIdx['gt']]),
        nakhoda: String(row[colIdx['nakhoda']] || ''),
        perusahaan: String(row[colIdx['perusahaan']] || ''),
        mesin: String(row[colIdx['mesin']] || ''),
        abk: String(row[colIdx['abk']] || '0'),
        jenisKapal: String(row[colIdx['jenisKapal']] || ''),
        kegiatan: String(row[colIdx['kegiatan']] || 'Bongkar'),
        alatTangkap: String(row[colIdx['alatTangkap']] || 'Lainnya'),
        jenisIkan: currentJenisIkan,
        ikanBreakdown: [{ jenis: currentJenisIkan, kg: produksi, nilai: nilai }],
        produksiKg: produksi,
        nilaiRp: nilai,
        es: parseNum(row[logisticsMapping.es]),
        air: parseNum(row[logisticsMapping.air]),
        solar: parseNum(row[logisticsMapping.solar]),
        oli: parseNum(row[logisticsMapping.oli]),
        gas: parseNum(row[logisticsMapping.gas]),
        bensin: parseNum(row[logisticsMapping.bensin]),
        beras: parseNum(row[logisticsMapping.beras]),
        garam: parseNum(row[logisticsMapping.garam]),
        gula: parseNum(row[logisticsMapping.gula]),
        minyak: parseNum(row[logisticsMapping.minyak]),
        rokok: parseNum(row[logisticsMapping.rokok]),
      };
      trips.push(currentTrip);
    } else if (currentTrip && (produksi > 0 || jenisIkan)) {
      currentTrip.produksiKg += produksi;
      currentTrip.nilaiRp += nilai;
      const cleanJenis = jenisIkan || 'Lainnya';
      currentTrip.ikanBreakdown.push({ jenis: cleanJenis, kg: produksi, nilai: nilai });
      if (jenisIkan && !currentTrip.jenisIkan.includes(jenisIkan)) {
        currentTrip.jenisIkan += `; ${jenisIkan}`;
      }
    }
  }

  return trips;
};
