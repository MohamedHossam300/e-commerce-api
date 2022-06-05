import express, { Request, Response, json, Application } from 'express';
import product_routes from './components/product/product.handler';
import user_routes from './components/user/user.handler';
import OrderRoutes from './components/order/order.handler';
import mongoose from "mongoose";
import { config } from './config';

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

<<<<<<< HEAD
user_store(app)
// app.use('/products' , ProductRoutes);
app.use('/orders' , OrderRoutes)
=======
user_routes(app)
product_routes(app)
// app.use('/orders' , OrderRoutes)
>>>>>>> e5253fd6f4d6df577cc97b57bb13a0221cf4cc5f

app.listen(port, (): void =>
  console.log(`your server is running at http://localhost:${port}`)
);