import supertest from 'supertest';
import app from "../../server";
import {User} from "../../models/user";
import client from "../../database";

const request = supertest(app);
describe('Users Handler Tests', () => {

    const testUser = {
        username: 'username1',
        firstname: 'John',
        lastname: 'Doe',
        password: '12345'
    }

    let testToken = '';

    it('should reach the create endpoint successfully', async () => {
        const res = await request.post('/users').send(testUser);
        const newUser: User = res.body;

        expect(res.status).toBe(200);
        expect(newUser).toBeDefined();
    });


    it('should reach the auth endpoint successfully', async () => {
        const res = await request.post('/users/authenticate')
            .send({username: testUser.username, password: testUser.password});

        const token: string = res.body as string;
        expect(token).toBeDefined();
        expect(res.status).toBe(200);
        testToken = token;
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
