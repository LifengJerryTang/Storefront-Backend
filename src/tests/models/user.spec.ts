import {User, UserStore} from "../../models/user";
import client from "../../database";
import bcrypt from "bcrypt";

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
    } );
})
