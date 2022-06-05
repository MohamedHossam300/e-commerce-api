import { Request, Response, Router } from 'express'
import { OrderStore, Order } from './order.modle'
import userToken from '../../middlewares/userToken'

const store = new OrderStore()

//get all orders handler function

const index = async (_req: Request, res: Response) => {
    try {
        const orders = await store.index()
        res.json(orders)
    } catch (err) {
        res.status(400)
        res.json(err)
    }
}

//get order by id hangler function

const getOrder = async (req: Request, res: Response) => {
    try {
        const order = await store.show(req.params.id)
        res.json(order)
    } catch (err) {
        res.status(400)
        res.json(err)
    }
}

//create new order handler function

const createNewOrder = async (req: Request, res: Response) => {
    try {
        const o: Order = {
            user_id: req.body.user_id,
            product_id: req.body.product_id,
            status: req.body.status,
            quantity: parseInt(req.body.quantity),
        }

        const theNewOrder = await store.create(o)
        res.json(theNewOrder)
    } catch (err) {
        res.status(400)
        console.log(err)
    }
}

// Update order handler function

const updateOrder = async (req: Request, res: Response) => {
    try {
        const o: Order = {
            user_id: req.body.user_id,
            product_id: req.body.product_id,
            status: req.body.status,
            quantity: parseInt(req.body.quantity),
        }

        const theNewOrder = await store.update(parseInt(req.params.id), o)
        res.json(theNewOrder)
    } catch (err) {
        res.status(400)
        res.json(err)
    }
}

//delete order by id handler function

const deleteOrder = async (req: Request, res: Response) => {
    try {
        const order = await store.delete(req.params.id);
        res.json(order);
    } catch (err) {
        res.status(400)
        res.json(err)
    }
}

//order routes

const OrderRoutes = Router()

OrderRoutes.get('/', userToken, index)
OrderRoutes.get('/:id', userToken, getOrder)
OrderRoutes.post('/', userToken, createNewOrder)
OrderRoutes.put('/', userToken, updateOrder)
OrderRoutes.delete('/:id', userToken, deleteOrder)

export default OrderRoutes
