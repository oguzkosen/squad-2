import { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'motion/react';
import { Users, CreditCard, CalendarDays, Activity, MinusCircle, DollarSign } from 'lucide-react';
import { Customer } from '../types';
import { formatCurrency, parseToFloat } from '../utils';

interface DashboardProps {
  data: Customer[];
  onSelectSegment: (segment: string) => void;
}

export function Dashboard({ data, onSelectSegment }: DashboardProps) {
  const [usdRateStr, setUsdRateStr] = useState<string>('44.33');
  const [isUsdActive, setIsUsdActive] = useState<boolean>(false);
  
  const usdRate = parseFloat(usdRateStr.replace(',', '.')) || 1;

  const chartData = useMemo(() => {
    const counts: Record<string, number> = { 'Healthy': 0, 'Parking': 0, 'Churn': 0, 'Legal': 0 };
    let others = 0;

    data.forEach((m) => {
      const s = m.statu ? String(m.statu).trim().toLowerCase() : '';
      if (s.includes('health')) counts['Healthy']++;
      else if (s.includes('park')) counts['Parking']++;
      else if (s.includes('churn')) counts['Churn']++;
      else if (s.includes('legal')) counts['Legal']++;
      else others++;
    });

    const result = [
      { name: 'Healthy', value: counts['Healthy'], color: '#10b981' },
      { name: 'Parking', value: counts['Parking'], color: '#f59e0b' },
      { name: 'Churn', value: counts['Churn'], color: '#f97316' },
      { name: 'Legal', value: counts['Legal'], color: '#ef4444' },
    ];
    if (others > 0) result.push({ name: 'Diğer', value: others, color: '#64748b' });
    return result.filter(item => item.value > 0);
  }, [data]);

  const totalCustomers = data.length;
  const totalLimit = data.reduce((acc, curr) => acc + parseToFloat(curr.catiLimit), 0);
  const totalUsed = data.reduce((acc, curr) => acc + parseToFloat(curr.kullanilanLimit), 0);
  const totalAySonu = data.reduce((acc, curr) => acc + parseToFloat(curr.aySonuLimit), 0);
  
  const averageScore = useMemo(() => {
    const scores = data.map(m => parseFloat(String(m.yeniVeri2).replace(',', '.'))).filter(s => !isNaN(s));
    return scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  }, [data]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-3 text-slate-500"><Users className="w-5 h-5" /><div className="text-xs font-semibold uppercase">Toplam Müşteri</div></div>
          <div className="text-3xl font-light text-slate-900">{totalCustomers}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-3 text-slate-500"><CreditCard className="w-5 h-5 text-emerald-500" /><div className="text-xs font-semibold uppercase">Toplam Çatı Bütçe</div></div>
          <div className="text-3xl font-light text-slate-900 truncate">{formatCurrency(totalLimit, isUsdActive, usdRate)}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-3 text-slate-500"><MinusCircle className="w-5 h-5 text-rose-500" /><div className="text-xs font-semibold uppercase">Toplam Kullanılan</div></div>
          <div className="text-3xl font-light text-slate-900 truncate">{formatCurrency(totalUsed, isUsdActive, usdRate)}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-3 text-slate-500"><CalendarDays className="w-5 h-5 text-blue-500" /><div className="text-xs font-semibold uppercase">Ay Sonu Limit</div></div>
          <div className="text-3xl font-light text-slate-900 truncate">{formatCurrency(totalAySonu, isUsdActive, usdRate)}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-3 text-slate-500"><Activity className="w-5 h-5 text-violet-500" /><div className="text-xs font-semibold uppercase">Ort. Ödeme Skoru</div></div>
          <div className="text-3xl font-light text-slate-900">{averageScore}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3"><DollarSign className="w-5 h-5 text-amber-500" /><div className="text-xs font-semibold uppercase">Dolar</div></div>
            <button onClick={() => setIsUsdActive(!isUsdActive)} className={`h-6 w-11 rounded-full ${isUsdActive ? 'bg-emerald-500' : 'bg-slate-200'}`}>
              <span className={`block h-4 w-4 rounded-full bg-white transition-transform ${isUsdActive ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          <input type="number" value={usdRateStr} onChange={(e) => setUsdRateStr(e.target.value)} className="text-3xl font-light bg-transparent border-b border-slate-200 focus:outline-none" />
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-center mb-8">Segment Dağılımı</h3>
        <div className="h-[360px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} cx="50%" cy="50%" innerRadius={110} outerRadius={140} paddingAngle={4} dataKey="value" stroke="none" onClick={(data) => onSelectSegment(data.name)}>
                {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap justify-center gap-6 mt-8">
          {chartData.map((item) => (
            <div key={item.name} onClick={() => onSelectSegment(item.name)} className="flex items-center gap-2 cursor-pointer group">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}