import express, { Request, Response } from 'express';
import {Product, ProductStore} from "../models/product";
import {verifyToken} from "../middlewares/verify-token";

const store = new ProductStore();

const index = async (_req: Request, res: Response) => {

    try {
        const products = await store.index();

        res.status(200).json(products);
    } catch (err) {
        res.status(400).render('error', { error: `Failed to get all of the products: ${err}` })
    }

}

const show = async (req: Request, res: Response) => {

    try {
        const product = await store.show(+req.params.id);

        res.status(200).json(product);
    } catch (err) {
        res.status(400).render('error',
            { error: `Failed to get the product with id of ${req.params.id} : ${err}` })
    }

}

const create = async (req: Request, res: Response) => {

    if (!req.body.name || !req.body.price || !req.body.category) {
        res.status(400).send('Missing one or more fields for your new product!');
        return;
    }

    const product: Product = {
        name: req.body.name,
        price: +req.body.price,
        category: req.body.category
    };

    try {
        const newProduct = await store.create(product);

        res.status(200).json(newProduct);
    } catch (err) {
        res.status(400).render('error',
            { error: `Failed to create product: ${err}` })
    }

}

const productsByCategory = async (req: Request, res: Response) => {

    try {
        const products = await store.productsByCategory(req.params.category);

        res.status(200).json(products);
    } catch (err) {
        res.status(400).render('error',
            { error: `Failed to get the products in the ${req.params.category} category : ${err}` })
    }

}


const productRoutes = (app: express.Application) => {
    app.get('/products', index)
    app.get('/products/:id', show)
    app.post('/products', verifyToken, create)
    app.get('/products/category/:category', productsByCategory)
}

export default productRoutes;
