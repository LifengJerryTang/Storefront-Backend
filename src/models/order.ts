import client from "../database";
import {OrderProducts} from "./order-products";

export type Order = {
    id?: number,
    products?: OrderProducts[],
    user_id: number,
    order_status: string;
}


export class OrderStore {
    async index(userId: number): Promise<Order[]> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM orders WHERE user_id = ($1)';

            const result = await conn.query(sql, [userId]);

            conn.release()

            return result.rows;
        } catch (err) {
            throw new Error(`Could not get all orders: ${err}`);
        }
    }

    async create(userId: number, orderStatus: string): Promise<Order> {
        try {
            const conn = await client.connect();
            const sql = 'INSERT INTO orders (user_id, order_status) VALUES ($1, $2)';

            const result = await conn.query(sql, [userId, orderStatus]);
            conn.release();

            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not create order: ${err}`);
        }
    }

    async ordersByStatus(userId: number, status: string): Promise<Order[]> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM orders WHERE user_id = ($1) AND order_status = ($2)';

            const result = await conn.query(sql, [userId, status]);

            conn.release()

            return result.rows;
        } catch (err) {
            throw new Error(`Could not get all orders: ${err}`);
        }
    }
}
