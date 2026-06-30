import { Search } from 'lucide-react';
import { Select } from '../ui/Select';
import type { Category, StockStatus } from '../../types';

interface Props {
  search: string;
  onSearch: (v: string) => void;
  categoryId: string;
  onCategory: (v: string) => void;
  status: string;
  onStatus: (v: string) => void;
  categories: Category[];
}

const STATUS_OPTIONS: { value: StockStatus | ''; label: string }[] = [
  { value: '', label: 'Todos os status' },
  { value: 'IN_STOCK', label: 'Em estoque' },
  { value: 'LOW', label: 'Estoque baixo' },
  { value: 'OUT', label: 'Esgotado' },
];

export function ProductFilters({ search, onSearch, categoryId, onCategory, status, onStatus, categories }: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Buscar por nome ou SKU..."
          className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
        />
      </div>
      <Select value={categoryId} onChange={(e) => onCategory(e.target.value)} className="sm:w-48">
        <option value="">Todas as categorias</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </Select>
      <Select value={status} onChange={(e) => onStatus(e.target.value)} className="sm:w-44">
        {STATUS_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </Select>
    </div>
  );
}
