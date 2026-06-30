import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productService, ProductPayload } from '../services/product.service';
import type { ProductFilters } from '../types';

export function useProducts(filters: ProductFilters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productService.list(filters),
    placeholderData: (prev) => prev, // mantém a tabela visível ao paginar/filtrar
  });
}

// Invalida produtos e dashboard após qualquer mutação.
function useProductInvalidation() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: ['products'] });
    qc.invalidateQueries({ queryKey: ['dashboard'] });
    qc.invalidateQueries({ queryKey: ['categories'] });
  };
}

export function useCreateProduct() {
  const invalidate = useProductInvalidation();
  return useMutation({
    mutationFn: (payload: ProductPayload) => productService.create(payload),
    onSuccess: invalidate,
  });
}

export function useUpdateProduct() {
  const invalidate = useProductInvalidation();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ProductPayload }) =>
      productService.update(id, payload),
    onSuccess: invalidate,
  });
}

export function useDeleteProduct() {
  const invalidate = useProductInvalidation();
  return useMutation({
    mutationFn: (id: string) => productService.remove(id),
    onSuccess: invalidate,
  });
}
