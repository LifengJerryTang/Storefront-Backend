import express, { Request, Response } from 'express'
import {Order, OrderStore} from "../models/order";
import {verifyToken} from "../middlewares/verify-token";
import {OrderProductStore} from "../models/order-products";

const orderStore = new OrderStore();
const orderProductStore = new OrderProductStore()

const index = async (req: Request, res: Response) => {

    const orders = await orderStore.index(+req.params.userId);
    const returnOrders: Order[] = []

    for (let order of orders) {
        let orderProducts = await orderProductStore.index(order.id as number);

        returnOrders.push({
            ...order,
            products: orderProducts
        })

    }

    res.status(200).json(returnOrders);

}

const create = async (req: Request, res: Response) => {

    if (!req.body.products || !req.body.user_id || !req.body.order_status) {
        res.status(400).send('Missing one or more fields in your new order object!');
    }

    const order = await orderStore.create(+req.body.user_id, req.body.order_status);

    for (let orderProducts of req.body.products) {
        await orderProductStore.create(order.id as number, +orderProducts.product_id, +orderProducts.quantity);
    }


    res.status(200).json(order);

}


const ordersByStatus = async (req: Request, res: Response)=> {
    const userId = +req.params.userId;

    const orders = await orderStore.ordersByStatus(userId, req.params.status);
    const returnOrders: Order[] = []

    for (let order of orders) {
        let orderProducts = await orderProductStore.index(order.id as number);

        returnOrders.push({
            ...order,
            products: orderProducts
        })

    }

    res.status(200).json(returnOrders);
}

const orderRoutes = (app: express.Application) => {
    app.get('/orders/:userId', verifyToken, index)
    app.post('/orders/:userId', verifyToken, create)
    app.get('/orders/:userId/status/:status', verifyToken, ordersByStatus)
}

export default orderRoutes;
