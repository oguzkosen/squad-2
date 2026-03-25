import { useState, useMemo, useEffect } from 'react';
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
  // Varsayılan değer 44,33 olarak güncellendi
  const [usdRateStr, setUsdRateStr] = useState<string>('44.33'); 
  const [isUsdActive, setIsUsdActive] = useState<boolean>(false);
  
  const usdRate = parseFloat(usdRateStr.replace(',', '.')) || 1;

  // TCMB Kurunu Hasan Adıgüzel API üzerinden çekiyoruz
  useEffect(() => {
    const fetchTcmbRate = async () => {
      try {
        const response = await fetch('https://hasanadiguzel.com.tr/api/kurgetir');
        const json = await response.json();
        
        // API içindeki TCMB_AnlikKurArsiv dizisinden USD'yi buluyoruz
        const usdData = json.TCMB_AnlikKurArsiv.find((item: any) => item.CurrencyName === "US DOLLAR");
        
        if (usdData && usdData.ForexSelling) {
          const rate = parseFloat(usdData.ForexSelling);
          setUsdRateStr(rate.toFixed(2).replace('.', ','));
        }
      } catch (error) {
        console.error("TCMB Kuru çekilemedi, varsayılan değer (44,33) kullanılıyor:", error);
      }
    };
    fetchTcmbRate();
  }, []);

  const chartData = useMemo(() => {
    const counts: Record<string, number> = { 'Healthy': 0, 'Parking': 0, 'Churn': 0, 'Legal': 0 };
    let others = 0;

    data.forEach((m) => {
      const s = m.statu ? String(m.st
