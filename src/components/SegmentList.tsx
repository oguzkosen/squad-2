import { useMemo } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Building2, ChevronRight } from 'lucide-react';
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
    return filtered.sort((a, b) => 
      segment.toLowerCase().includes('health') 
        ? parseToFloat(b.catiLimit) - parseToFloat(a.catiLimit) 
        : String(a.musteriNo).localeCompare(String(b.musteriNo), undefined, { numeric: true })
    );
  }, [data, segment]);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      className="space-y-6 max-w-full overflow-hidden"
    >
      <div className="flex items-center gap-3 sm:gap-4 px-1">
        <button 
          onClick={onBack} 
          className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 active:scale-90 transition-transform"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h2 className="text-xl sm:text-3xl font-light text-slate-900 truncate">
          {segment} <span className="hidden sm:inline">Segmenti</span>
        </h2>
        <span className="ml-auto bg-indigo-50 text-indigo-600 py-1 px-3 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider border border-indigo-100 whitespace-nowrap">
          {sortedData.length} Müşteri
        </span>
      </div>

      <div className="grid gap-3 sm:gap-4">
        {sortedData.map((customer) => (
          <div 
            key={customer.musteriNo} 
            onClick={() => onSelectCustomer(customer)} 
            className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all cursor-pointer flex items-center justify-between gap-3 group overflow-hidden"
          >
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0 flex-1">
