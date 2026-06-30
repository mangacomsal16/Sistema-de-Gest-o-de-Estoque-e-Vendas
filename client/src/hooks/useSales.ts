import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { saleService, SalePayload } from '../services/sale.service';

export function useSales(page: number, pageSize = 8) {
  return useQuery({
    queryKey: ['sales', page, pageSize],
    queryFn: () => saleService.list({ page, pageSize }),
    placeholderData: (prev) => prev,
  });
}

export function useCreateSale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: SalePayload) => saleService.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['sales'] });
      qc.invalidateQueries({ queryKey: ['products'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
