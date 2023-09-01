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

const topFiveProducts = async (req: Request, res: Response) => {
    const topFiveProducts = await store.topFiveProducts();

    res.status(200).json(topFiveProducts);
}

const productRoutes = (app: express.Application) => {
    app.get('/products', index)
    app.get('/products/{:id}', show)
    app.post('/products', verifyToken, create)
    app.get('/products/{:category}', productsByCategory)
    app.get('/products/top-5', topFiveProducts)
}

export default productRoutes;
