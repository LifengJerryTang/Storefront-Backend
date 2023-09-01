import jwt, { Secret } from 'jsonwebtoken';
import express, {NextFunction, Request, Response} from 'express';

const SECRET = process.env.ACCESS_TOKEN_SECRET as Secret;

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.status(401).send('Access denied: authorization header NOT FOUND!');
    }

    try {
        const token = req.headers.authorization!.split(' ')[1];
        jwt.verify(token, SECRET);
        next();
    } catch (error) {
        res.status(401).send('Access denied: INVALID TOKEN!');
    }
}
