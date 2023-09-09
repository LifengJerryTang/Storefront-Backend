import express, { Request, Response } from 'express';
import {Product, ProductStore} from "../models/product";
import {verifyToken} from "../middlewares/verify-token";

const store = new ProductStore();

const index = async (_req: Request, res: Response) => {
    const products = await store.index();

    res.status(200).json(products);
}

const show = async (req: Request, res: Response) => {
    const product = await store.show(+req.params.id);

    res.status(200).json(product);
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

    const newProduct = await store.create(product);

    res.status(200).json(newProduct);

}

const productsByCategory = async (req: Request, res: Response) => {

    const products = await store.productsByCategory(req.params.category);

    res.status(200).json(products);
}


const productRoutes = (app: express.Application) => {
    app.get('/products', index)
    app.get('/products/:id', show)
    app.post('/products', verifyToken, create)
    app.get('/products/category/:category', productsByCategory)
}

export default productRoutes;
