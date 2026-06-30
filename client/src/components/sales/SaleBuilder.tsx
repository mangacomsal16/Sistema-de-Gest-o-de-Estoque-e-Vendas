import { useMemo, useState } from 'react';
import { Plus, Trash2, ShoppingCart } from 'lucide-react';
import { Card, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { EmptyState } from '../ui/EmptyState';
import { useCreateSale } from '../../hooks/useSales';
import { useToast } from '../../context/ToastContext';
import { getApiError } from '../../services/api';
import { formatCurrency, PAYMENT_LABELS } from '../../lib/format';
import type { PaymentMethod, Product } from '../../types';

interface CartItem {
  product: Product;
  quantity: number;
}

export function SaleBuilder({ products }: { products: Product[] }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [payment, setPayment] = useState<PaymentMethod>('CASH');
  const createSale = useCreateSale();
  const { notify } = useToast();

  const available = products.filter((p) => p.stock > 0);
  const selected = products.find((p) => p.id === selectedId);

  // Estoque restante considerando o que já está no carrinho.
  const remaining = (p: Product) => p.stock - (cart.find((c) => c.product.id === p.id)?.quantity ?? 0);

  const total = useMemo(() => cart.reduce((acc, c) => acc + c.product.price * c.quantity, 0), [cart]);

  function addToCart() {
    if (!selected) return;
    const qty = Math.max(1, quantity);
    if (qty > remaining(selected)) {
      notify('Quantidade acima do estoque disponível.', 'warning');
      return;
    }
    setCart((prev) => {
      const existing = prev.find((c) => c.product.id === selected.id);
      if (existing) {
        return prev.map((c) => (c.product.id === selected.id ? { ...c, quantity: c.quantity + qty } : c));
      }
      return [...prev, { product: selected, quantity: qty }];
    });
    setSelectedId('');
    setQuantity(1);
  }

  function removeItem(id: string) {
    setCart((prev) => prev.filter((c) => c.product.id !== id));
  }

  async function finalize() {
    if (cart.length === 0) return;
    try {
      await createSale.mutateAsync({
        paymentMethod: payment,
        items: cart.map((c) => ({ productId: c.product.id, quantity: c.quantity })),
      });
      notify(`Venda registrada — ${formatCurrency(total)}`);
      setCart([]);
      setPayment('CASH');
    } catch (err) {
      notify(getApiError(err), 'error');
    }
  }

  return (
    <Card className="lg:col-span-2">
      <CardHeader title="Registrar venda" />
      <div className="p-5">
        {/* Seleção de item */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Select label="Produto" value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
              <option value="">Selecione um produto...</option>
              {available.map((p) => (
                <option key={p.id} value={p.id} disabled={remaining(p) <= 0}>
                  {p.name} — {formatCurrency(p.price)} ({remaining(p)} un.)
                </option>
              ))}
            </Select>
          </div>
          <div className="w-full sm:w-28">
            <Input
              label="Qtd"
              type="number"
              min={1}
              max={selected ? remaining(selected) : undefined}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>
          <Button onClick={addToCart} disabled={!selected} className="sm:mb-0">
            <Plus size={16} /> Adicionar
          </Button>
        </div>

        {/* Itens do carrinho */}
        <div className="mt-5 rounded-xl border border-slate-200">
          {cart.length === 0 ? (
            <EmptyState icon={<ShoppingCart size={36} />} title="Carrinho vazio" description="Adicione produtos para montar a venda." />
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-[11px] uppercase tracking-wide text-slate-400">
                  <th className="px-4 py-2.5 font-semibold">Produto</th>
                  <th className="px-4 py-2.5 text-center font-semibold">Qtd</th>
                  <th className="px-4 py-2.5 text-right font-semibold">Subtotal</th>
                  <th className="px-4 py-2.5"></th>
                </tr>
              </thead>
              <tbody>
                {cart.map((c) => (
                  <tr key={c.product.id} className="border-b border-slate-50 last:border-0">
                    <td className="px-4 py-3 font-medium text-slate-700">{c.product.name}</td>
                    <td className="px-4 py-3 text-center tnum">{c.quantity}</td>
                    <td className="px-4 py-3 text-right font-medium text-slate-700 tnum">
                      {formatCurrency(c.product.price * c.quantity)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => removeItem(c.product.id)} className="text-slate-400 hover:text-red-500">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagamento e total */}
        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="sm:w-48">
            <Select label="Forma de pagamento" value={payment} onChange={(e) => setPayment(e.target.value as PaymentMethod)}>
              {(['CASH', 'CARD', 'PIX'] as PaymentMethod[]).map((m) => (
                <option key={m} value={m}>
                  {PAYMENT_LABELS[m]}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex flex-1 items-center justify-between rounded-xl bg-brand-50 px-5 py-3">
            <span className="text-sm font-medium text-brand-500">Total da venda</span>
            <b className="text-2xl font-bold text-brand-500 tnum">{formatCurrency(total)}</b>
          </div>
        </div>

        <Button
          className="mt-4 w-full"
          loading={createSale.isPending}
          disabled={cart.length === 0}
          onClick={finalize}
        >
          <ShoppingCart size={17} /> Confirmar venda
        </Button>
      </div>
    </Card>
  );
}
