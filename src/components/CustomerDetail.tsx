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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-white border rounded-xl text-xs font-semibold uppercase"><ArrowLeft className="w-4 h-4" /> Geri</button>
        <button onClick={onHome} className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold uppercase"><Home className="w-4 h-4" /> Ana Ekran</button>
      </div>
      <div className="text-center space-y-3">
        <h2 className="text-4xl md:text-5xl font-light text-slate-900">{customer.musteriAdi}</h2>
        <div className="text-slate-500 font-medium">Müşteri No: {customer.musteriNo} &bull; <span className="bg-slate-100 px-3 py-1 rounded-lg text-xs uppercase">{customer.statu}</span></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-center">
            <div className="text-xs font-semibold text-slate-400 uppercase mb-3">Çatı Limiti</div>
            <div className="text-5xl font-light text-slate-900 mb-8">{formatCurrency(customer.catiLimit)}</div>
            <div className="w-full h-1 bg-slate-100 rounded-full flex overflow-hidden">
              <div style={{ width: `${usedPercent}%` }} className="bg-rose-500 h-full" />
              <div style={{ width: `${availablePercent}%` }} className="bg-emerald-500 h-full" />
            </div>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex justify-between items-center"><span className="text-xs font-semibold text-slate-400 uppercase">Kullanılan Limit</span><span className="text-2xl font-light">{formatCurrency(customer.kullanilanLimit)}</span></div>
            <div className="flex justify-between items-center"><span className="text-xs font-semibold text-slate-400 uppercase">Anlık Kullanılabilir</span><span className="text-2xl font-light text-emerald-600">{formatCurrency(customer.anlikLimit)}</span></div>
            <div className="flex justify-between items-center"><span className="text-xs font-semibold text-slate-400 uppercase">Ay Sonu Maksimum</span><span className="text-2xl font-light">{formatCurrency(customer.aySonuLimit)}</span></div>
          </div>
        </div>
        <div className="lg:col-span-7 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm min-h-[400px]">
          <div className="flex justify-between mb-8">
            <h3 className="text-xs font-semibold text-slate-400 uppercase">12 Haftalık Performans</h3>
            <div className="bg-slate-50 px-4 py-2 rounded-xl border"><div className="text-3xl font-light">{Math.round(parseToFloat(customer.yeniVeri2))}</div></div>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                <XAxis dataKey="week" axisLine={false} tickLine={false} />
                <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} tickFormatter={(v) => ({5:'P',4:'-',3:'1',2:'2',1:'3',0:'U'}[v] || '-')} axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="linear" dataKey="score" stroke="#0f172a" strokeWidth={2} dot={{ r: 4, fill: '#fff', stroke: '#0f172a' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {isAdmin && (
        <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl">
          <div className="flex items-center gap-2 text-emerald-400 mb-6"><ShieldAlert className="w-5 h-5" /><h3 className="text-sm uppercase">Yetkili Görünümü</h3></div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-800 p-6 rounded-2xl"><div className="text-xs text-slate-400 uppercase mb-2">Kullanılmayan Limit</div><div className="text-3xl font-light text-white">{formatCurrency(customer.kullanilmayanLimit)}</div></div>
            <div className="bg-slate-800 p-6 rounded-2xl"><div className="text-xs text-slate-400 uppercase mb-2">Aylık Beklenen Ödeme</div><div className="text-3xl font-light text-white">{formatCurrency(customer.aylikOdeme)}</div></div>
          </div>
        </div>
      )}
    </motion.div>
  );
}