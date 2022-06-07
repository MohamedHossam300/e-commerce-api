import { Application, Request, Response } from "express";
import { hashSync, genSalt } from "bcrypt";
import { sign } from "jsonwebtoken";
import { UserStore, User } from "./user.modle";
import { config } from "../../config";
import userToken from "../../middlewares/userToken";
import adminToken from "../../middlewares/adminToken";

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
        const showUser = await store.show(req.params.username);
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
            username: req.body.username,
            email: req.body.email,
            password: hash,
            isAdmin: req.body.isAdmin,
        }
        const createUsers = await store.create(users);
        const token = sign(
            { users: createUsers },
            <string>config.tokenSecret
        );
        res.json(token);
    } catch (err) {
        res.status(400)
        res.json(err)
    }
}


const updateUser = async (req: Request, res: Response) => {
    try {
        const salt = await genSalt(parseInt(config.saltRounds))
        const hash = hashSync(req.body.password + config.pepper, salt)
        const users: User = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            username: req.body.username,
            email: req.body.email,
            password: hash,
            isAdmin: req.body.isAdmin,
        }

        const theNewUser = await store.update(parseInt(req.params.id), users)
        res.json(theNewUser)
    } catch (err) {
        res.status(400)
        res.json(err)
    }
}

const deleteUser = async (req: Request, res: Response) => {
    try {
        const user = await store.delete(req.params.id);
        res.json(user);
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

const user_store = (app: Application) => {
    app.get("/users", [userToken, adminToken], index);
    app.get("/users/:username", [userToken, adminToken], show);
    app.post("/users", create);
    app.put("/users/:id", userToken, updateUser);
    app.delete("/users/:id", [userToken, adminToken], deleteUser);
    app.post("/auth", authentication);
}

export default user_store;