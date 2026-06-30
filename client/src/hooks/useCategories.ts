import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../services/category.service';

export function useCategories() {
  return useQuery({ queryKey: ['categories'], queryFn: categoryService.list });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: categoryService.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  });
}
