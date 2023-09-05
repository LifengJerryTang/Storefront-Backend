import client from "../database";

export type Product = {
    id?: number,
    name: string,
    price: number,
    category: string
}

export class ProductStore {
    async index(): Promise<Product[]> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM products';

            const result = await conn.query(sql);

            conn.release()

            return result.rows;
        } catch (err) {
            throw new Error(`Could not get all products: ${err}`);
        }
    }

    async show(productId: number): Promise<Product> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM products WHERE id=($1)';

            const result = await conn.query(sql, [productId]);

            conn.release()

            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not get products with id of ${productId}: ${err}`);
        }
    }

    async create(p: Product): Promise<Product> {
        try {
            const conn = await client.connect();
            const sql =
                'INSERT INTO products (name, price, category) VALUES ($1, $2, $3) RETURNING *';

            const result = await conn.query(sql, [p.name, p.price, p.category]);

            const product = result.rows[0];

            conn.release();

            return product;
        } catch (err) {
            throw new Error(`Could not add new product named ${p.name}: ${err}`);
        }
    }

    async productsByCategory(category: string): Promise<Product[]> {
        console.log(category)
        try {
            const sql = 'SELECT * FROM products WHERE category=($1)';
            const conn = await client.connect();

            const result = await conn.query(sql, [category]);

            conn.release();

            return result.rows;
        } catch (err) {
            throw new Error(`Unable to get products with category of (${category}): ${err}`);
        }
    }

}
