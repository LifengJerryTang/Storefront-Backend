import express, { Request, Response } from 'express'
import {Order, OrderStore} from "../models/order";
import {verify} from "jsonwebtoken";
import {verifyToken} from "../middlewares/verify-token";

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
    app.get('/orders/{:userId}', verifyToken, index)
    app.get('/orders/:userId/completed', verifyToken, completedOrders)
}

export default orderRoutes;
