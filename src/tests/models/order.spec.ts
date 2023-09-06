import client from "../../database";
import {Order, OrderStore} from "../../models/order";

describe('Order Model Tests', () => {

    const store = new OrderStore();

    const testData: Order[] = [
        {
            id: 1,
            user_id: 2,
            order_status: 'complete'
        },

        {
            id: 2,
            user_id: 2,
            order_status: 'active'
        },

        {
            id: 3,
            user_id: 2,
            order_status: 'active'
        },

        {
            id: 4,
            user_id: 2,
            order_status: 'complete'
        }
    ]

    async function initTestData() {

        const conn = await client.connect();

        for (let order of testData) {
            const sql =
                'INSERT INTO orders (user_id, order_status) VALUES ($1, $2)';

            await conn.query(sql, [order.user_id, order.order_status]);
        }

        conn.release();
    }

    beforeAll(async () => {
        await initTestData();
    } );

    it('should have an index method', () => {
        expect(store.index).toBeDefined();
    });

    it('should have a create method', () => {
        expect(store.create).toBeDefined();
    });

    it('should have a orderByStatus method', () => {
        expect(store.ordersByStatus).toBeDefined();
    });

    it('should return a list of orders when calling the index method', async () => {
        const orders: Order[] = await store.index(2);
        expect(orders).toBeDefined();
        expect(orders).toEqual(testData);
    });

    it('should create an order when calling the create method', async () => {
        const order = await store.create(3, 'complete');
        expect(order).toBeDefined();
        expect(order).toEqual({
            id: 5,
            user_id: 3,
            order_status: 'active'
        })
    });

    it('should get the correct list of orders when calling the orderByStatus method', async () => {
        const orders: Order[] = await store.ordersByStatus(2, 'active');
        expect(orders).toBeDefined();
        expect(orders).toEqual([
            {
                id: 2,
                user_id: 2,
                order_status: 'active'
            },

            {
                id: 3,
                user_id: 2,
                order_status: 'active'
            }
        ])
    });
})
