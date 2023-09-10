import client from "../database";

export type OrderProducts = {
    order_id: number;
    product_id: number;
    quantity: number;
}

export class OrderProductStore {
    async index(orderId: number): Promise<OrderProducts[]> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM order_products WHERE order_id = ($1)';

            const result = await conn.query(sql, [orderId]);

            conn.release()

            return result.rows;
        } catch (err) {
            throw new Error(`Could not get order_products with order id of ${orderId}: ${err}`);
        }
    }

    async create(orderId: number, productId: number, quantity: number): Promise<OrderProducts> {
        try {
            const conn = await client.connect();
            const sql
                = 'INSERT INTO order_products (order_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *';

            const result = await conn.query(sql, [orderId, productId, quantity]);

            conn.release()

            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not create order_products: ${err}`);
        }
    }
}
