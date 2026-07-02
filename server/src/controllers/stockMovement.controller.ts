import { Request, Response } from 'express';
import { stockMovementService } from '../services/stockMovement.service';

export const stockMovementController = {
  async listByProduct(req: Request, res: Response) {
    res.json(await stockMovementService.listByProduct(req.params.id));
  },
};
