import {User, UserStore} from "../../models/user";
import client from "../../database";
import bcrypt from "bcrypt";
import {Product} from "../../models/product";

const saltRounds = process.env.SALT_ROUNDS
const pepper = process.env.BCRYPT_PASSWORD

describe('User Model Tests', () => {
    const store = new UserStore();

    const testData = [
        {
            id: 1,
            username: 'username1',
            firstname: 'John',
            lastname: 'Doe',
            password: '12345'
        },

        {
            id: 2,
            username: 'username2',
            firstname: 'Jake',
            lastname: 'Snow',
            password: '54321'
        },

        {
            id: 3,
            username: 'username3',
            firstname: 'Jack',
            lastname: 'Harrison',
            password: 'sfdsfsf123123ds'
        }

    ]

    async function initTestData() {

        const conn = await client.connect();

        for (let user of testData) {
            const sql =
                'INSERT INTO users (username, firstname, lastname, password) VALUES ($1, $2, $3, $4)';

            const hash = bcrypt.hashSync(
                user.password + pepper,
                parseInt(saltRounds as string)
            );

            await conn.query(sql, [user.username, user.firstname,
                user.lastname, hash])
        }

        conn.release();
    }

    beforeAll(async () => {
        await initTestData();
    });

    it('should have an index method', () => {
        expect(store.index).toBeDefined();
    });

    it('should have a show method', () => {
        expect(store.show).toBeDefined();
    });

    it('should have a create method', () => {
        expect(store.create).toBeDefined();
    });

    it('should have an authenticate method', () => {
        expect(store.authenticate).toBeDefined();
    });


    it('should return a list of users when calling the index method', async () => {
        const users: User[] = await store.index();
        expect(users).toBeDefined();
        expect(users.length).toEqual(testData.length);
    });

    it('should create a user successfully when calling the create method', async () => {
        const user: User = await store.create({
            username: 'username4',
            firstname: 'Jerry',
            lastname: 'Kim',
            password: '987654321'
        });

        expect(user).toBeDefined();
        expect(user.id).toEqual(4);
    });

    it('should return the correct user when calling the show method', async () => {
        const user: User = await store.show(3);
        expect(user).toBeDefined();
        expect(user.id).toEqual(3);
    });

    it('should authenticate user when calling the authenticate method', async () => {
        const user: User = await store.authenticate('username1', '12345') as User;
        expect(user).toBeDefined();
        expect(user.username).toEqual('username1');
    });

    afterAll(async () => {
        const conn = await client.connect();
        const deleteQuery = `DELETE FROM users`;

        await conn.query(deleteQuery);

        conn.release();

    })

})
