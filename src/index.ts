import express, { Request, Response, json, Application } from 'express';
import product_routes from './components/product/product.handler';
import user_routes from './components/user/user.handler';
import mongoose from "mongoose";
import { config } from './config';
import order_routes from './components/order/order.handler';

const app: Application = express();
const port: number = 8080

mongoose.connect( config.url ).then((): void => {
  console.log("Database Connected");
}).catch((err): void => {
  throw new Error(err);
});



app.use(json());

app.get('/', (_req: Request, res: Response): void => {
  res.send("Welcome to the store's home page");
});

user_routes(app)
product_routes(app)
order_routes(app)

app.listen(port, (): void =>
  console.log(`your server is running at http://localhost:${port}`)
);