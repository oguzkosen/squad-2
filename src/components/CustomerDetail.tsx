import { useMemo } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Home, ShieldAlert } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Customer } from '../types';
import { formatCurrency, parseToFloat } from '../utils';

interface CustomerDetailProps {
  customer: Customer;
  isAdmin: boolean;
  onBack: () => void;
  onHome: () => void;
}

export function CustomerDetail({ customer, isAdmin, onBack, onHome }: CustomerDetailProps) {
  const rawCati = parseToFloat(customer.catiLimit) || 1;
  const rawKullanilan = parseToFloat(customer.kullanilanLimit);
  const rawAnlik = parseToFloat(customer.anlikLimit);
  
  const usedPercent = Math.min(Math.round((rawKullanilan / rawCati) * 100), 100);
  const availablePercent = Math.min(Math.round((rawAnlik / rawCati) * 100), 100 - usedPercent);

  const chartData = useMemo(() => {
    const tokens = String(customer.yeniVeri1 || '').toUpperCase().replace(/[^P\-123U]/g, '').split('');
    const scoreMap: Record<string, number> = { 'P': 5, '-': 4, '1': 3, '2': 2, '3': 1, 'U': 0 };
    return Array.from({ length: 12 }, (_, i) => ({ week: `${i + 1}`, score: scoreMap[tokens[i]] ?? 4, label: tokens[i] || '-' }));
  }, [customer.yeniVeri1]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto space-y-6 md:space-y-8">
      <div className="flex justify-between items-center px-1">
        <button onClick={onBack} className="flex items-center gap-2 px-3 py-2 bg-white border rounded-xl text-[10px] font-bold uppercase tracking-wider text-slate-600 active:scale-95 transition-transform"><ArrowLeft className="w-3.5 h-3.5" /> Geri</button>
        <button onClick={onHome} className="flex items-center gap-2 px-3 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider active:scale-95 transition-transform"><Home className="w-3.5 h-3.5" /> Ana Ekran</button>
      </div>

      <div className="text-center space-y-2 px-2">
        {/* Müşteri adı mobilde taşmaz, sığar */}
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-light text-slate-900 leading-tight">{customer.musteriAdi}</h2>
        <div className="text-slate-500 text-xs sm:text-sm font-medium">Müşteri No: {customer.musteriNo} &bull; <span className="bg-slate-100 px-2 py-0.5 rounded-lg text-[10px] uppercase font-bold">{customer.statu}</span></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm text-center">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Çatı Limiti</div>
            <div className="text-3xl sm:text-4xl md:text-5xl font-light text-slate-900 mb-8 whitespace-nowrap overflow-hidden">
              {formatCurrency(customer.catiLimit)}
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full flex overflow-hidden">
              <div style={{ width: `${usedPercent}%` }} className="bg-rose-500 h-full" />
              <div style={{ width: `${availablePercent}%` }} className="bg-emerald-500 h-full" />
            </div>
          </div>
          
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-slate-50 pb-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Kullanılan Limit</span>
              <span className="text-lg sm:text-2xl font-light whitespace-nowrap">{formatCurrency(customer.kullanilanLimit)}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-50 pb-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Anlık Kullanılabilir</span>
              <span className="text-lg sm:text-2xl font-light text-emerald-600 whitespace-nowrap">{formatCurrency(customer.anlikLimit)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Ay Sonu Maksimum</span>
              <span className="text-lg sm:text-2xl font-light whitespace-nowrap">{formatCurrency(customer.aySonuLimit)}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm min-h-[350px]">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">12 Haftalık Performans</h3>
            <div className="bg-slate-50 px-3 py-1.5 rounded-xl border"><div className="text-2xl font-light">{Math.round(parseToFloat(customer.yeniVeri2))}</div></div>
          </div>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} tickFormatter={(v) => ({5:'P',4:'-',3:'1',2:'2',1:'3',0:'U'}[v] || '-')} axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Line type="linear" dataKey="score" stroke="#0f172a" strokeWidth={2.5} dot={{ r: 4, fill: '#fff', stroke: '#0f172a', strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {isAdmin && (
        <div className="bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl">
          <div className="flex items-center gap-2 text-emerald-400 mb-6"><ShieldAlert className="w-4 h-4" /><h3 className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Yetkili Görünümü</h3></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700">
              <div className="text-[10px] text-slate-400 font-bold uppercase mb-2">Kullanılmayan Limit</div>
              <div className="text-xl sm:text-3xl font-light text-white whitespace-nowrap">{formatCurrency(customer.kullanilmayanLimit)}</div>
            </div>
            <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700">
              <div className="text-[10px] text-slate-400 font-bold uppercase mb-2">Aylık Beklenen Ödeme</div>
              <div className="text-xl sm:text-3xl font-light text-white whitespace-nowrap">{formatCurrency(customer.aylikOdeme)}</div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
