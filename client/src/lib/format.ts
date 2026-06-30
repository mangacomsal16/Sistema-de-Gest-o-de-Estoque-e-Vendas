// Funções de formatação reutilizadas na interface.
export const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const formatNumber = (value: number) => value.toLocaleString('pt-BR');

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

export const formatShortDay = (iso: string) =>
  new Date(iso + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

export const PAYMENT_LABELS: Record<string, string> = {
  CASH: 'Dinheiro',
  CARD: 'Cartão',
  PIX: 'Pix',
};
