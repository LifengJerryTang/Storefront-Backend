import client from "../../database";
import {Order, OrderStore} from "../../models/order";
import {User, UserStore} from "../../models/user";

describe('Order Model Tests', () => {

    const orderStore = new OrderStore();
    const userStore = new UserStore();

    let testUser: User = {
        id: -1,
        username: 'username2',
        firstname: 'Jake',
        lastname: 'Snow',
        password: '54321'
    }

    let testOrder: Order =   {
        id: -1,
        user_id: -1,
        order_status: 'active'
    }

    async function initTestData() {

        const conn = await client.connect();
        const result1 = await conn.query(
            "INSERT INTO users (username, firstname, lastname, password) VALUES ($1, $2, $3, $4) RETURNING *",
            [testUser.username, testUser.firstname, testUser.lastname, testUser.password]);

        testUser.id = result1.rows[0].id;
        testOrder.user_id = testUser.id!;

        const result2 = await conn.query(
            "INSERT INTO orders (user_id, order_status) VALUES ($1, $2) RETURNING *",
            [testOrder.user_id, testOrder.order_status]);

        testOrder.id = result2.rows[0].id;


        conn.release();
    }

    beforeAll(async () => {
        await initTestData();
    } );

    it('should have an index method', () => {
        expect(orderStore.index).toBeDefined();
    });

    it('should have a create method', () => {
        expect(orderStore.create).toBeDefined();
    });

    it('should have a orderByStatus method', () => {
        expect(orderStore.ordersByStatus).toBeDefined();
    });

    it('should return a list of orders when calling the index method', async () => {
        const orders: Order[] = await orderStore.index(testOrder.user_id);
        expect(orders).toBeDefined();
        expect(orders.length).toBeGreaterThanOrEqual(1);
    });

    it('should create an order when calling the create method', async () => {
        const order = await orderStore.create(testOrder.user_id, 'complete');
        expect(order).toBeDefined();
        expect(order).toEqual({
            id: testOrder.id! + 1,
            user_id: testOrder.user_id,
            order_status: 'complete'
        })
    });

    it('should get the correct list of orders when calling the orderByStatus method', async () => {
        const orders: Order[] = await orderStore.ordersByStatus(testOrder.user_id, 'active');
        expect(orders).toBeDefined();
        expect(orders).toEqual([
            {
                id: testOrder.id,
                user_id: testOrder.user_id,
                order_status: 'active'
            }
        ])
    });


    afterAll(async () => {
        const conn = await client.connect();
        await conn.query(`DELETE FROM orders`);
        await conn.query('DELETE FROM users');

        conn.release();

    })

})
