import { Spinner } from '../components/ui/Spinner';
import { SaleBuilder } from '../components/sales/SaleBuilder';
import { SalesHistory } from '../components/sales/SalesHistory';
import { useProducts } from '../hooks/useProducts';

export function SalesPage() {
  // Carrega um lote amplo de produtos para alimentar o seletor da venda.
  const { data, isLoading } = useProducts({ pageSize: 100, page: 1 });

  if (isLoading || !data) return <Spinner label="Carregando produtos..." />;

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <SaleBuilder products={data.data} />
      <SalesHistory />
    </div>
  );
}
