// src/types.ts içeriğini bu şekilde güncelle:
export interface Customer {
  musteriNo: string;
  musteriAdi: string;
  statu: string;
  catiLimit: string | number;
  kullanilanLimit: string | number;
  anlikLimit: string | number;
  aySonuLimit: string | number;
  kullanilmayanLimit?: string | number; // Opsiyonel (?) yaptık
  aylikOdeme?: string | number;        // Opsiyonel (?) yaptık
  yeniVeri1?: string;                  // Performans skorları (P-123U)
  yeniVeri2?: string | number;         // Ortalama skor
}
