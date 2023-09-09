import {OrderProducts, OrderProductStore} from "../../models/order-products"
import client from "../../database";
import {Order} from "../../models/order";

describe('Order Products Model Test', () => {
    const store = new OrderProductStore();

    const testData: OrderProducts[] = [
        {
            order_id: 1,
            product_id: 1,
             quantity: 5
        },

        {
            order_id: 2,
            product_id: 3,
            quantity: 10
        },

        {
            order_id: 2,
            product_id: 3,
            quantity: 5
        }
    ]

    async function initTestData() {

        const conn = await client.connect();

        for (let orderProducts of testData) {
            const sql =
                'INSERT INTO order_products (order_id, product_id, quantity) VALUES ($1, $2, $3)';

            await conn.query(sql, [orderProducts.order_id, orderProducts.product_id, orderProducts.quantity]);
        }

        conn.release();
    }

    beforeAll(async () => {
        await initTestData();
    });

    it('should have an index method', () => {
        expect(store.index).toBeDefined();
    });

    it('should have a create method', () => {
        expect(store.create).toBeDefined();
    });

    it('should return a list of order_products when calling the index method', async () => {
        const orderProducts: OrderProducts[] = await store.index(2);
        expect(orderProducts).toBeDefined();
        expect(orderProducts).toEqual([
            {
                order_id: 2,
                product_id: 3,
                quantity: 10
            },

            {
                order_id: 2,
                product_id: 3,
                quantity: 5
            }
        ]);
    });

    it('should create an order_products when calling the create method', async () => {
        const orderProducts = await store.create(3, 2, 6);
        expect(orderProducts).toBeDefined();
        expect(orderProducts).toEqual( {
            order_id: 3,
            product_id: 2,
            quantity: 6
        })
    });

    afterAll(async () => {
        const conn = await client.connect();
        const deleteQuery = `DELETE FROM order_products`;

        await conn.query(deleteQuery);

        conn.release();

    })
})
