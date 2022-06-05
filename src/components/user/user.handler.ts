import { Application, Request, Response } from "express";
import { hashSync, compareSync, genSalt } from "bcrypt";
import { UserStore, User } from "./user.modle";
import { config } from "../../config";

const store = new UserStore();

const index = async (_req: Request, res: Response): Promise<void> => {
    try {
        const indexUsers = await store.index();
        res.json(indexUsers);
    } catch (err) {
        res.status(400)
        res.json(err)
    }
}

const show = async (req: Request, res: Response): Promise<void> => {
    try {
        const showUser = await store.show(req.params.email);
        res.json(showUser);
    } catch (err) {
        res.status(400)
        res.json(err)
    }
}

const create = async (req: Request, res: Response): Promise<void> => {
    try {
        const salt = await genSalt(parseInt(config.saltRounds))
        const hash = hashSync(req.body.password + config.pepper, salt)
        const users: User = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: hash,
        }
        const createUsers = await store.create(users);
        res.json(createUsers);
    } catch (err) {
        res.status(400)
        res.json(err)
    }
}

const authentication = async (req: Request, res: Response): Promise<void> => {
    try {
        const createUsers = await store.authentication(req.body.email, req.body.password);
        res.json(createUsers);
    } catch (err) {
        res.status(400)
        res.json(err)
    }
}

const user_routes = (app: Application) => {
    app.get("/user", index);
    app.get("/user/:email", show);
    app.post("/user", create);
    app.post("/authentication", authentication);
}

export default user_routes;