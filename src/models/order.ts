import client from "../database";

export type Order = {
    id?: number,
    products: Array<{number: number}>, // key: product id; value: quantity
    userId: number,
    status: string;
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
