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
