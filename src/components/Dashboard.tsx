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
  const [usdRateStr, setUsdRateStr] = useState<string>('44.33'); 
  const [isUsdActive, setIsUsdActive] = useState<boolean>(false);
  const [isChartReady, setIsChartReady] = useState(false);
  
  const usdRate = parseFloat(usdRateStr.replace(',', '.')) || 1;

  useEffect(() => {
    // Kur Çekme - Global CORS dostu API
    const fetchRate = async () => {
      try {
        const response = await fetch('https://open.er-
