import {Product, ProductStore} from "../../models/product";
import client from "../../database";
describe('Product Model Tests', () => {
    const store = new ProductStore();

    const testProduct =  {
            id: -1,
            name: 'Cat',
            price: 25.00,
            category: 'Pet'
        }

    async function initTestData() {

        const conn = await client.connect();

        const sql =
            'INSERT INTO products (name, price, category) VALUES ($1, $2, $3) RETURNING *';

        const result = await conn.query(sql, [testProduct.name,
            testProduct.price, testProduct.category]);

        testProduct.id = result.rows[0].id;

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
        expect(products.length).toBeGreaterThanOrEqual(1);
    })

    it('should return the correct product when calling the show method', async () => {
        const product = await store.show(testProduct.id);
        product.price = +product.price
        expect(product).toBeDefined();
        expect(product).toEqual(testProduct)
    })

    it('should return the correct product(s) when calling the productsByCategory method',
        async () => {
        const products: Product[] = await store.productsByCategory(testProduct.category);
        products[0].price = +products[0].price;
        expect(products).toBeDefined();
        expect(products).toEqual([testProduct])
    })

    it('should create the input product when calling the create method', async () => {
        const product: Product = {
            name: 'Milk',
            price: 2.50,
            category: 'Food and Drink'
        }

        const newProduct = await store.create(product);
        newProduct.price = +newProduct.price
        expect(newProduct).toBeDefined();
        expect(newProduct).toEqual({
            id: testProduct.id + 1,
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
