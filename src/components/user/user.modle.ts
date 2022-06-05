import mongoose from "mongoose";
import {compareSync } from "bcrypt";
import { config } from "../../config";

export type User = {
  id?: Number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    trim: true
  },
  lastname: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
})

const users = mongoose.model("User", userSchema)

export class UserStore {
  async index(): Promise<User[]> {
    try {
      const result = await users.find({})
      return result;
    } catch (err) {
      throw new Error(`Unable to display Users. Error: ${err}`)
    }
  }

  async show(email: string): Promise<User> {
    try {
      const result = await users.findOne().where({email:email})
      return result;
    } catch (err) {
      throw new Error(`Unable to display User. Error: ${err}`)
    }
  }

  async create(user: User): Promise<User> {
    try {
      const createUsers = new users(user)
      const result = await createUsers.save()
      return result;
    } catch (err) {
      throw new Error(`Unable create Users. Error: ${err}`)
    }
  }

  async authentication(email: string, password: string): Promise<User | null> {
    try {
      const result = await users.findOne({email}).exec()
      if (result) {
        if (compareSync(password + config.pepper, result.password)) {
          return result;
        }
      }
      return null
    }catch (err) {
      throw new Error(`Invalid email or password`)
    }
  }
}