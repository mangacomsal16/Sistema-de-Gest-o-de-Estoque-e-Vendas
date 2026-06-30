import { Request, Response } from 'express';
import { z } from 'zod';
import { categoryService } from '../services/category.service';

export const categorySchema = z.object({
  name: z.string().min(2, 'Nome muito curto.'),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Cor inválida.').optional(),
});

export const categoryController = {
  async list(_req: Request, res: Response) {
    res.json(await categoryService.list());
  },
  async create(req: Request, res: Response) {
    res.status(201).json(await categoryService.create(req.body));
  },
  async update(req: Request, res: Response) {
    res.json(await categoryService.update(req.params.id, req.body));
  },
  async remove(req: Request, res: Response) {
    await categoryService.remove(req.params.id);
    res.status(204).send();
  },
};
