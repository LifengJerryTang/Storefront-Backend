import client from "../database";
import bcrypt from 'bcrypt';

const saltRounds = process.env.SALT_ROUNDS
const pepper = process.env.BCRYPT_PASSWORD

export type User = {
    id?: string,
    username: string,
    firstname: string,
    lastname: string,
    password: string
}

export class UserStore {
    async index(): Promise<User[]> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM users';

            const result = await conn.query(sql);

            conn.release();

            return result.rows;

        } catch (err) {
            throw new Error(`Unable get users: ${err}`);
        }
    }

    async show(id: number): Promise<User> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM users WHERE id = ($1)';

            const result = await conn.query(sql, [id]);

            conn.release();

            return result.rows[0];
        } catch (err) {
            throw new Error(`Unable show user ${id}: ${err}`)
        }
    }

    async create(u: User): Promise<User> {
        try {
            const conn = await client.connect();
            const sql =
                'INSERT INTO users (username, firstname, lastname, password) VALUES ($1, $2, $3, $4)';

            const hash = bcrypt.hashSync(
                u.password + pepper,
                parseInt(saltRounds!)
            );

            const result = await conn.query(sql, [u.username, u.firstname, u.lastname, hash])
            const user = result.rows[0]

            conn.release()

            return user;
        } catch (err) {
            throw new Error(`Unable create user (${u.username}): ${err}`);
        }
    }
}
