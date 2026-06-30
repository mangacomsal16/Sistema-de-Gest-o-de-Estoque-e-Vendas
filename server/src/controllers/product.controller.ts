import { Request, Response } from 'express';
import { z } from 'zod';
import { productService } from '../services/product.service';

export const productSchema = z.object({
  name: z.string().min(2, 'Nome muito curto.'),
  sku: z.string().min(1, 'Informe o SKU.'),
  description: z.string().optional().nullable(),
  price: z.coerce.number().min(0, 'Preço inválido.'),
  costPrice: z.coerce.number().min(0).optional().nullable(),
  stock: z.coerce.number().int().min(0, 'Estoque inválido.'),
  minStock: z.coerce.number().int().min(0).default(5),
  categoryId: z.string().uuid('Categoria inválida.'),
});

export const productController = {
  async list(req: Request, res: Response) {
    const result = await productService.list({
      search: req.query.search as string | undefined,
      categoryId: req.query.categoryId as string | undefined,
      status: req.query.status as any,
      page: req.query.page ? Number(req.query.page) : undefined,
      pageSize: req.query.pageSize ? Number(req.query.pageSize) : undefined,
    });
    res.json(result);
  },
  async getById(req: Request, res: Response) {
    res.json(await productService.getById(req.params.id));
  },
  async create(req: Request, res: Response) {
    res.status(201).json(await productService.create(req.body));
  },
  async update(req: Request, res: Response) {
    res.json(await productService.update(req.params.id, req.body));
  },
  async remove(req: Request, res: Response) {
    await productService.remove(req.params.id);
    res.status(204).send();
  },
};
