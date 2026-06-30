import { useEffect, useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { useCreateProduct, useUpdateProduct } from '../../hooks/useProducts';
import { useToast } from '../../context/ToastContext';
import { getApiError } from '../../services/api';
import type { Category, Product } from '../../types';
import type { ProductPayload } from '../../services/product.service';

interface Props {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  categories: Category[];
}

const empty = { name: '', sku: '', price: '', costPrice: '', stock: '', minStock: '5', categoryId: '' };

export function ProductFormModal({ open, onClose, product, categories }: Props) {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const { notify } = useToast();
  const isEdit = Boolean(product);

  // Preenche o formulário ao abrir (edição) ou limpa (novo).
  useEffect(() => {
    if (!open) return;
    setErrors({});
    if (product) {
      setForm({
        name: product.name,
        sku: product.sku,
        price: String(product.price),
        costPrice: product.costPrice != null ? String(product.costPrice) : '',
        stock: String(product.stock),
        minStock: String(product.minStock),
        categoryId: product.categoryId,
      });
    } else {
      setForm({ ...empty, categoryId: categories[0]?.id ?? '' });
    }
  }, [open, product, categories]);

  const set = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  function validate() {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 2) e.name = 'Informe o nome.';
    if (!form.sku.trim()) e.sku = 'Informe o SKU.';
    if (!form.categoryId) e.categoryId = 'Selecione a categoria.';
    if (form.price === '' || Number(form.price) < 0) e.price = 'Preço inválido.';
    if (form.stock === '' || Number(form.stock) < 0) e.stock = 'Estoque inválido.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    const payload: ProductPayload = {
      name: form.name.trim(),
      sku: form.sku.trim(),
      price: Number(form.price),
      costPrice: form.costPrice ? Number(form.costPrice) : null,
      stock: Number(form.stock),
      minStock: Number(form.minStock || 5),
      categoryId: form.categoryId,
    };
    try {
      if (isEdit && product) {
        await updateMutation.mutateAsync({ id: product.id, payload });
        notify('Produto atualizado.');
      } else {
        await createMutation.mutateAsync(payload);
        notify('Produto adicionado ao estoque.');
      }
      onClose();
    } catch (err) {
      notify(getApiError(err), 'error');
    }
  }

  const loading = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Editar produto' : 'Novo produto'}
      description={isEdit ? 'Atualize as informações do item' : 'Cadastre um item no estoque'}
      footer={
        <>
          <Button variant="light" onClick={onClose}>
            Cancelar
          </Button>
          <Button loading={loading} onClick={handleSubmit}>
            {isEdit ? 'Salvar alterações' : 'Salvar produto'}
          </Button>
        </>
      }
    >
      <div className="grid gap-4">
        <Input label="Nome do produto" value={form.name} onChange={(e) => set('name', e.target.value)} error={errors.name} placeholder="Ex.: Dipirona 500mg" />
        <div className="grid grid-cols-2 gap-4">
          <Input label="SKU / Código" value={form.sku} onChange={(e) => set('sku', e.target.value)} error={errors.sku} placeholder="SKU-0001" />
          <Select label="Categoria" value={form.categoryId} onChange={(e) => set('categoryId', e.target.value)}>
            <option value="" disabled>
              Selecione...
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Preço de venda (R$)" type="number" min="0" step="0.01" value={form.price} onChange={(e) => set('price', e.target.value)} error={errors.price} />
          <Input label="Preço de custo (R$)" type="number" min="0" step="0.01" value={form.costPrice} onChange={(e) => set('costPrice', e.target.value)} placeholder="Opcional" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Quantidade em estoque" type="number" min="0" step="1" value={form.stock} onChange={(e) => set('stock', e.target.value)} error={errors.stock} />
          <Input label="Estoque mínimo" type="number" min="0" step="1" value={form.minStock} onChange={(e) => set('minStock', e.target.value)} />
        </div>
      </div>
    </Modal>
  );
}
