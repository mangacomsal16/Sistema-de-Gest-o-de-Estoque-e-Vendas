import { Request, Response } from 'express';
import { z } from 'zod';
import { saleService } from '../services/sale.service';

export const saleSchema = z.object({
  paymentMethod: z.enum(['CASH', 'CARD', 'PIX']).default('CASH'),
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.coerce.number().int().positive(),
      })
    )
    .min(1, 'Adicione ao menos um item.'),
});

export const saleController = {
  async create(req: Request, res: Response) {
    const sale = await saleService.create(req.body, req.user!.sub);
    res.status(201).json(sale);
  },
  async list(req: Request, res: Response) {
    const result = await saleService.list({
      page: req.query.page ? Number(req.query.page) : undefined,
      pageSize: req.query.pageSize ? Number(req.query.pageSize) : undefined,
    });
    res.json(result);
  },
};
