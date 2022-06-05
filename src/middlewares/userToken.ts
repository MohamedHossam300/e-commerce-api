<<<<<<< HEAD
import { config } from '../config'
import {Request ,Response, NextFunction} from 'express'
import { verify } from 'jsonwebtoken'

const userToken = (req: Request, res: Response, next:NextFunction) => {
    try {
        const authorizationHeader:string|undefined = req.headers.authorization!
        const token: string = authorizationHeader.split(' ')[1] 
            verify(<string>token, <string>config.tokenSecret)
=======
// import express, {Request ,Response, NextFunction} from 'express'
// import { verify } from 'jsonwebtoken'
// import dotenv from 'dotenv'
// dotenv.config();

// const userToken = (req: Request, res: Response, next:NextFunction) => {
//     try {
//         const authorizationHeader:string|undefined = req.headers.authorization!
//         const token:string = authorizationHeader.split(' ')[1] 
//         const jwt:unknown = process.env.JWT_SECRET
//          verify(token ,jwt as string)
>>>>>>> e5253fd6f4d6df577cc97b57bb13a0221cf4cc5f

//         next()
//     } catch (err) {
//         res.status(401)
//         res.json( `could not access,  your token is invalid . Error${err}`)
//     }
// }

<<<<<<< HEAD
export default userToken;
=======
// export default userToken
>>>>>>> e5253fd6f4d6df577cc97b57bb13a0221cf4cc5f
