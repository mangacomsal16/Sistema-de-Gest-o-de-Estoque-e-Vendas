import { useMemo, useState } from 'react';
import { Plus, PackageX } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { Pagination } from '../components/ui/Pagination';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { ProductFilters } from '../components/products/ProductFilters';
import { ProductTable } from '../components/products/ProductTable';
import { ProductFormModal } from '../components/products/ProductFormModal';
import { StockHistoryPanel } from '../components/products/StockHistoryPanel';
import { useProducts, useDeleteProduct } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { useDebounce } from '../hooks/useDebounce';
import { useToast } from '../context/ToastContext';
import { getApiError } from '../services/api';
import type { Product, StockStatus } from '../types';

export function ProductsPage() {
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);
  const [historyProduct, setHistoryProduct] = useState<Product | null>(null);

  const debouncedSearch = useDebounce(search);
  const { notify } = useToast();
  const { data: categories = [] } = useCategories();
  const deleteMutation = useDeleteProduct();

  const filters = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      categoryId: categoryId || undefined,
      status: (status || undefined) as StockStatus | undefined,
      page,
      pageSize: 8,
    }),
    [debouncedSearch, categoryId, status, page]
  );

  const { data, isLoading, isFetching } = useProducts(filters);

  // Volta para a primeira página ao alterar qualquer filtro.
  const resetTo = (fn: (v: string) => void) => (v: string) => {
    fn(v);
    setPage(1);
  };

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }
  function openEdit(p: Product) {
    setEditing(p);
    setFormOpen(true);
  }

  async function confirmDelete() {
    if (!deleting) return;
    try {
      await deleteMutation.mutateAsync(deleting.id);
      notify('Produto removido.');
      setDeleting(null);
    } catch (err) {
      notify(getApiError(err), 'error');
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <ProductFilters
          search={search}
          onSearch={resetTo(setSearch)}
          categoryId={categoryId}
          onCategory={resetTo(setCategoryId)}
          status={status}
          onStatus={resetTo(setStatus)}
          categories={categories}
        />
        <Button onClick={openCreate} className="shrink-0">
          <Plus size={17} /> Novo produto
        </Button>
      </div>

      <Card>
        {isLoading && !data ? (
          <Spinner label="Carregando produtos..." />
        ) : !data || data.data.length === 0 ? (
          <EmptyState
            icon={<PackageX size={44} />}
            image="/media/empty-state.svg"
            title="Nenhum produto encontrado"
            description="Ajuste os filtros ou cadastre um novo produto no estoque."
          />
        ) : (
          <div className={isFetching ? 'opacity-70 transition' : 'transition'}>
            <ProductTable
              products={data.data}
              onEdit={openEdit}
              onDelete={setDeleting}
              onHistory={setHistoryProduct}
              onSell={(p) => {
                setEditing(p);
                window.location.href = '/vendas';
              }}
            />
            <Pagination
              page={data.page}
              totalPages={data.totalPages}
              total={data.total}
              pageSize={data.pageSize}
              onChange={setPage}
            />
          </div>
        )}
      </Card>

      <ProductFormModal open={formOpen} onClose={() => setFormOpen(false)} product={editing} categories={categories} />
      <StockHistoryPanel open={Boolean(historyProduct)} onClose={() => setHistoryProduct(null)} product={historyProduct} />
      <ConfirmDialog
        open={Boolean(deleting)}
        title="Remover produto"
        message={`Tem certeza que deseja remover "${deleting?.name}"? Ele deixará de aparecer no estoque.`}
        confirmLabel="Remover"
        loading={deleteMutation.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
