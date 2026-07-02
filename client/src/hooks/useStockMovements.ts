import { useQuery } from '@tanstack/react-query';
import { stockMovementService } from '../services/stockMovement.service';

export function useStockMovements(productId?: string) {
  return useQuery({
    queryKey: ['stock-movements', productId],
    queryFn: () => stockMovementService.listByProduct(productId!),
    enabled: Boolean(productId),
  });
}
