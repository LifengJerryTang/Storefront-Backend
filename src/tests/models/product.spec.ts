import {Product, ProductStore} from "../../models/product";
import client from "../../database";
describe('Product Model Tests', () => {
    const store = new ProductStore();

    const testData: Product[] = [
        {
            id: 1,
            name: 'Cat',
            price: 25.0,
            category: 'Pet'
        },

        {
            id: 2,
            name: 'Toothbrush',
            price: 5.0,
            category: 'Hygiene'
        },

        {
            id: 3,
            name: 'Pencil',
            price: 2.0,
            category: 'School Supplies'
        },

        {
            id: 4,
            name: 'Dog',
            price: 50.0,
            category: 'Pet'
        }
    ]

    async function initTestData() {

        const conn = await client.connect();

        for (let product of testData) {
            const sql =
                'INSERT INTO products (name, price, category) VALUES ($1, $2, $3)';

            await conn.query(sql, [product.name,
                product.price, product.category]);
        }

        conn.release();
    }

    beforeAll(async () => {
        await initTestData();
    } );

    it('should have an index method', () => {
        expect(store.index).toBeDefined();
    });

    it('should have a show method', () => {
        expect(store.show).toBeDefined();
    });

    it('should have a create method', () => {
        expect(store.create).toBeDefined();
    });

    it('should return a list of product when calling the index method', async () => {
        const products: Product[] = await store.index();
        expect(products).toBeDefined();
        expect(products).toEqual(testData);
    })

    it('should return the correct product when calling the show method', async () => {
        const product = await store.show(1);
        expect(product).toBeDefined();
        expect(product).toEqual( {
            id: 1,
            name: 'Cat',
            price: 25.0,
            category: 'Pet'
        })
    })

    it('should create the input product when calling the create method', async () => {
        const product: Product = {
            name: 'Milk',
            price: 2.5,
            category: 'Food and Drinks'
        }

        const newProduct = await store.create(product);
        expect(newProduct).toBeDefined();
        expect(newProduct).toEqual({
            id: 5,
            ...product
        })
    });

    afterAll(async () => {
        const conn = await client.connect();
        const deleteQuery = `DELETE FROM products`;

        await conn.query(deleteQuery);

        conn.release();

    })

})
