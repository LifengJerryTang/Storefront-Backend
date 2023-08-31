import express, { Request, Response } from 'express'
import {Order, OrderStore} from "../models/order";

const store = new OrderStore();

const index = async (req: Request, res: Response) => {

    const orders = await store.index(+req.params.userId);

    res.status(200).json(orders);

}

const completedOrders = async (req: Request, res: Response)=> {
    const userId = +req.params.userId;

    const orders = await store.ordersByStatus(userId, 'completed');

    res.status(200).json(orders);
}

const orderRoutes = (app: express.Application) => {
    app.get('/orders/{:userId}', index)
    app.get('/orders/:userId/completed', completedOrders)
}

export default orderRoutes;
