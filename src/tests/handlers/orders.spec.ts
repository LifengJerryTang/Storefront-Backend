import app from "../../server";
import {Order} from '../../models/order';
import supertest from 'supertest';
import client from "../../database";
import jwt, {Secret} from "jsonwebtoken";
import {UserStore} from "../../models/user";

const request = supertest(app);
const SECRET = process.env.ACCESS_TOKEN_SECRET as Secret;
describe('Orders Handler Tests', () => {

    const userStore = new UserStore();

    const testUser = {
        id: -1,
        username: 'username2',
        firstname: 'Jake',
        lastname: 'Snow',
        password: '12345'
    }

    const testOrder = {
        products: [],
        user_id: -1,
        order_status: 'active'
    }

    let testToken = '';

    beforeAll(async () => {
        const user = await userStore.create(testUser);
        testUser.id = user.id!;
        testOrder.user_id = user.id!;
        testToken = jwt.sign({ user }, SECRET);
    })

    it('should reach the create endpoint', async () => {
        const res = await request.post(`/orders/${testUser.id}`)
            .set('Authorization', 'bearer ' + testToken)
            .send(testOrder);

        const newOrder: Order = res.body;

        expect(newOrder).toBeDefined();
        expect(res.status).toEqual(200);
    });

    it('should reach the index endpoint', async () => {
        const res = await request.get(`/orders/${testUser.id}`)
            .set('Authorization', 'bearer ' + testToken);

        const orders: Order[] = res.body;

        expect(orders).toBeDefined();
        expect(res.status).toEqual(200);

    });

    it('should reach the orderByStatus endpoint', async () => {
        const res = await request.get(`/orders/${testUser.id}/status/active`)
            .set('Authorization', 'bearer ' + testToken);

        const orders: Order[] = res.body;

        expect(orders).toBeDefined();
        expect(res.status).toEqual(200);

    });

    afterAll(async () => {
        const conn = await client.connect();
        await conn.query(`DELETE FROM orders`);
        await conn.query(`DELETE FROM users`)

        conn.release();

    })


})
