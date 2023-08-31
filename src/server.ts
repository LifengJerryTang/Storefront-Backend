import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import userRoutes from "./handlers/users";
import productRoutes from "./handlers/products";
import orderRoutes from "./handlers/orders";

const app: express.Application = express()

let port = 3000;

if (process.env.ENV === 'test') {
    port = 3001;
}

const address = `127.0.0.1:${port}`;

app.use(bodyParser.json())

app.get('/', function (req: Request, res: Response) {
    res.send('Hello World!')
})

app.listen(3000, function () {
    console.log(`starting app on: ${address}`)
})

userRoutes(app);
productRoutes(app);
orderRoutes(app);
