import express, {Application,Request ,Response} from 'express'
import {Router} from 'express'
import { config } from "../../config";
import userToken from '../../middlewares/userToken'
import UserRoutes from '../user/user.handler'
import {Product,TheProductStore} from './product.modle'


const store = new TheProductStore()


//get all products handler function

const getAllProducts= async (_req: Request, res: Response) => {
    try {
        const products = await store.index()
            res.json(products)
    } catch(err) { 
         res.status(400)
         res.json(err)
   }
}

//get order by id handler function

const getProduct = async (req: Request, res: Response) => {
    try {
        const name=req.params.name
       const product = await store.show(name)
       res.json(product)
    } catch(err) { 
         res.status(400)
         res.json(err)
   }
}


// creat new product handler function
const createNewProduct = async (req: Request, res: Response) => {
    try {
        const product: Product = {
            name: req.body.name,
            desc : req.body.desc,
            color: req.body.color,
            size : req.body.size,
            price: parseInt(req.body.price),
            category:req.body.category

        }

        const theNewProduct  = await store.create(product)
        res.json(theNewProduct)
    } catch(err) {
        res.status(400)
        res.json(err)
    }
}

//delete product by id handler function
const deleteProduct = async (req: Request, res: Response) => {
    try {
        const name = req.params.name
        const product = await store.delete(name);
        res.json(product);
    } catch(err) { 
        res.status(400)
        res.json(err)
    }
}

//product routes

const product_routes = (app: Application) => {  
    app.get('/product', getAllProducts)
    app.get('/product/:name', getProduct)
    app.post('/product', userToken, createNewProduct)
    app.delete('/product/:name', userToken, deleteProduct)
}
    
    export default product_routes;



