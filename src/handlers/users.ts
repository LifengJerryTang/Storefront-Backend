import express, { Request, Response } from 'express';
import {User, UserStore} from "../models/user";
import jwt, { Secret } from 'jsonwebtoken';
import {verifyToken} from "../middlewares/verify-token";

const SECRET = process.env.ACCESS_TOKEN_SECRET as Secret;

const store = new UserStore();

const index = async (req: Request, res: Response) => {
    const users = await store.index();

    res.status(200).json(users);
}

const show = async (req: Request, res: Response) => {
    const user = await store.show(+req.params.id);

    res.status(200).json(user);
}

const create = async (req: Request, res: Response) => {
    const user: User = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        password: req.body.password
    }

    try {
        const newUser = await store.create(user);

        res.json(newUser)

    } catch(err) {
        res.status(400).json(`Unable to create user with username of ${user.username}: ${err}`)
    }
}

const authenticate = async (req: Request, res: Response) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        if (!username || !password) {
            res.status(400).send('Missing username and/or password!');
            return false;
        }

        const user: User | undefined = await store.authenticate(username, password);

        if (!user) {
            return res.status(401).send('Authentication failed. Invalid username and/or password!');
        }

        const token = jwt.sign({ user }, SECRET);

        res.status(200).json(token);

    } catch (err) {
        res.status(400).send(`Authentication failed: ${err}`);
    }
}
const userRoutes = (app: express.Application) => {
    app.get('/users', verifyToken, index)
    app.get('/users/{:id}', verifyToken, show)
    app.post('/users', verifyToken, create)
    app.post('/users/authenticate', authenticate);
}

export default userRoutes
