import express, { Request, Response } from 'express';
import {User, UserStore} from "../models/user";

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

const userRoutes = (app: express.Application) => {
    app.get('/users', index)
    app.get('/users/{:id}', show)
    app.post('/users', create)
}

export default userRoutes
