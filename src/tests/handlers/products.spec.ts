import supertest from "supertest";
import app from "../../server";
import {Product} from "../../models/product";
import jwt, {Secret} from "jsonwebtoken";
import client from "../../database";

const request = supertest(app);
const SECRET = process.env.ACCESS_TOKEN_SECRET as Secret;
describe('Product Handler Tests', () => {

    const testProduct = {
        name: 'Test Product 1',
        price: 2.50,
        category: 'test'
    }

    const testUser = {
        id: 1,
        username: 'username2',
        firstname: 'Jake',
        lastname: 'Snow',
        password: '12345'
    }

    let testToken = '';

    beforeAll(async () => {
        testToken = jwt.sign({ testUser }, SECRET);
    })


    it('should reach the create endpoint', async () => {
        const res = await request.post('/products').set('Authorization', 'bearer ' + testToken)
            .send(testProduct);

        const newProduct = res.body;

        expect(newProduct).toBeDefined();
        expect(res.status).toBe(200);
    });

    it('should reach the index endpoint', async () => {
        const res = await request.get('/products');

        const products: Product[] = res.body;

        expect(products).toBeDefined();
        expect(res.status).toBe(200);
    });

    it('should reach the show endpoint', async () => {
        const res = await request.get('/products/1');

        const product: Product = res.body;

        expect(product).toBeDefined();
        expect(res.status).toBe(200);
    });

    it('should reach the productsByCategory endpoint', async () => {
        const res = await request.get('/products/category/test');
        const products: Product[] = res.body;

        expect(products).toBeDefined();
        expect(res.status).toBe(200);
    });

    afterAll(async () => {
        const conn = await client.connect();

        await conn.query(`DELETE FROM products`);
        conn.release();

    });

})
