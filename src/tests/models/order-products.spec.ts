import {OrderProducts, OrderProductStore} from "../../models/order-products"
import client from "../../database";
import {Order} from "../../models/order";
import {User} from "../../models/user";
import {Product} from "../../models/product";

describe('Order Products Model Test', () => {
    const store = new OrderProductStore();

    let testUser: User = {
        id: -1,
        username: 'username1',
        firstname: 'John',
        lastname: 'Doe',
        password: '54321'
    }

    let testOrder: Order = {
        id: -1,
        user_id: -1,
        order_status: 'active'
    }

    const testProduct =  {
        id: -1,
        name: 'Cat',
        price: 25.00,
        category: 'Pet'
    }

    const testOrderProducts: OrderProducts = {
        order_id: -1,
        product_id: -1,
        quantity: 5
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

        const result3 = await conn.query(
            'INSERT INTO products (name, price, category) VALUES ($1, $2, $3) RETURNING *',
            [testProduct.name, testProduct.price, testProduct.category]);

        testProduct.id = result3.rows[0].id;

        testOrderProducts.order_id = testOrder.id!;
        testOrderProducts.product_id = testProduct.id;

        await conn.query(
            'INSERT INTO order_products (order_id, product_id, quantity) VALUES ($1, $2, $3)',
            [testOrderProducts.order_id, testOrderProducts.product_id, testOrderProducts.quantity]
        )

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
        const orderProducts: OrderProducts[] = await store.index(testOrder.id!);
        expect(orderProducts).toBeDefined();
        expect(orderProducts.length).toBeGreaterThanOrEqual(1)
    });

    it('should create an order_products when calling the create method', async () => {
        const orderProducts = await store.create(testOrder.id!, testProduct.id, 10);
        expect(orderProducts).toBeDefined();
        expect(orderProducts).toEqual( {
            order_id: testOrder.id!,
            product_id: testProduct.id,
            quantity: 10
        })
    });

    afterAll(async () => {
        const conn = await client.connect();
        await conn.query(`DELETE FROM order_products`);
        await conn.query(`DELETE FROM orders`);
        await conn.query('DELETE FROM users');

        conn.release();

    })
})
