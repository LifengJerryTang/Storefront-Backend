import {User, UserStore} from "../../models/user";
import client from "../../database";
import bcrypt from "bcrypt";
import {Product} from "../../models/product";

const saltRounds = process.env.SALT_ROUNDS
const pepper = process.env.BCRYPT_PASSWORD

describe('User Model Tests', () => {
    const store = new UserStore();

    const testUser: User = {
        id: -1,
        username: 'testUsername',
        firstname: 'John',
        lastname: 'Doe',
        password: '12345'
    }

    async function initTestData() {

        const conn = await client.connect();

        const sql =
            'INSERT INTO users (username, firstname, lastname, password) VALUES ($1, $2, $3, $4) RETURNING *';

        const hash = bcrypt.hashSync(
            testUser.password + pepper,
            parseInt(saltRounds as string)
        );

        const result = await conn.query(sql, [testUser.username, testUser.firstname,
            testUser.lastname, hash])

        testUser.id = result.rows[0].id;

        console.log(result.rows)

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
        expect(users.length).toBeGreaterThanOrEqual(1);
    });

    it('should create a user successfully when calling the create method', async () => {
        const user: User = await store.create({
            username: 'testUsername2',
            firstname: 'Jerry',
            lastname: 'Kim',
            password: '987654321'
        });

        expect(user).toBeDefined();
        expect(user.id).toEqual(testUser.id! + 1);
        expect(user.username).toEqual('testUsername2');

    });

    it('should return the correct user when calling the show method', async () => {
        const user: User = await store.show(testUser.id!);
        expect(user).toBeDefined();
        expect(user.id).toEqual(testUser.id);
    });

    it('should authenticate user when calling the authenticate method', async () => {
        const user: User = await store.authenticate('testUsername', '12345') as User;
        expect(user).toBeDefined();
        expect(user.username).toEqual('testUsername');
    });

    afterAll(async () => {
        const conn = await client.connect();
        const deleteQuery = `DELETE FROM users`;

        await conn.query(deleteQuery);

        conn.release();

    })

})
