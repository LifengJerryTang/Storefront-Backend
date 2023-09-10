import supertest from 'supertest';
import app from "../../server";
import {User, UserStore} from "../../models/user";
import client from "../../database";
import jwt, {Secret} from "jsonwebtoken";

const request = supertest(app);
const SECRET = process.env.ACCESS_TOKEN_SECRET as Secret;
describe('Users Handler Tests', () => {
    const store = new UserStore();

    const testUser = {
        username: 'username1',
        firstname: 'John',
        lastname: 'Doe',
        password: '12345'
    }

    const testUser2 = {
        username: 'username2',
        firstname: 'John',
        lastname: 'Doe',
        password: '56789'
    }

    let testToken = '';
    beforeAll(async () => {
        testToken = jwt.sign({ testUser }, SECRET);
        await store.create(testUser2)
    })

    it('should reach the create endpoint successfully', async () => {
        const res = await request.post('/users').send(testUser);
        const newUser: User = res.body;

        expect(res.status).toBe(200);
        expect(newUser).toBeDefined();
    });


    it('should reach the auth endpoint successfully', async () => {
        const res = await request.post('/users/authenticate')
            .send({username: testUser2.username, password: testUser2.password});

        const token: string = res.body as string;
        expect(token).toBeDefined();
        expect(res.status).toBe(200);
    });

    it('should reach the index endpoint successfully', async () => {
        const res = await request.get('/users').set('Authorization', 'bearer ' + testToken);
        const users: User[] = res.body;

        expect(users).toBeDefined();
        expect(res.status).toBe(200);
    });

    it('should reach the show endpoint successfully', async () => {
        const res = await request.get(`/users/${1}`).set('Authorization', 'bearer ' + testToken);

        const user: User = res.body;

        expect(user).toBeDefined();
        expect(res.status).toBe(200);

    });

    afterAll(async () => {
        const conn = await client.connect();
        const deleteQuery = `DELETE FROM users`;

        await conn.query(deleteQuery);
        conn.release();

    })

})
