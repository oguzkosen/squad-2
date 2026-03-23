import { useMemo } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Building2 } from 'lucide-react';
import { Customer } from '../types';
import { formatCurrency, parseToFloat } from '../utils';

interface SegmentListProps {
  segment: string;
  data: Customer[];
  onBack: () => void;
  onSelectCustomer: (customer: Customer) => void;
}

export function SegmentList({ segment, data, onBack, onSelectCustomer }: SegmentListProps) {
  const sortedData = useMemo(() => {
    const filtered = data.filter((m) => {
      const s = m.statu ? String(m.statu).trim().toLowerCase() : '';
      const seg = segment.toLowerCase();
      if (seg === 'diğer') return !s.includes('health') && !s.includes('park') && !s.includes('churn') && !s.includes('legal');
      if (seg === 'healthy') return s.includes('health');
      if (seg === 'parking') return s.includes('park');
      if (seg === 'churn') return s.includes('churn');
      if (seg === 'legal') return s.includes('legal');
      return false;
    });
    return filtered.sort((a, b) => segment.toLowerCase().includes('health') ? parseToFloat(b.catiLimit) - parseToFloat(a.catiLimit) : String(a.musteriNo).localeCompare(String(b.musteriNo), undefined, { numeric: true }));
  }, [data, segment]);

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200"><ArrowLeft className="w-5 h-5" /></button>
        <h2 className="text-3xl font-light text-slate-900">{segment} Segmenti</h2>
        <span className="ml-auto bg-indigo-100 text-indigo-700 py-1 px-3 rounded-full text-sm font-semibold">{sortedData.length} Müşteri</span>
      </div>
      <div className="grid gap-4">
        {sortedData.map((customer) => (
          <div key={customer.musteriNo} onClick={() => onSelectCustomer(customer)} className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all cursor-pointer flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400"><Building2 className="w-6 h-6" /></div>
              <div className="truncate"><h3 className="text-xl font-light text-slate-900 truncate">{customer.musteriAdi}</h3><p className="text-sm text-slate-500">No: {customer.musteriNo}</p></div>
            </div>
            <div className="bg-slate-50 px-4 py-2 rounded-xl text-right">
              <div className="text-xs font-semibold text-slate-500 uppercase">Çatı Limit</div>
              <div className="text-xl font-light text-slate-900">{formatCurrency(customer.catiLimit)}</div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}