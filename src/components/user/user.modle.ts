import mongoose from "mongoose";
import {compareSync } from "bcrypt";
import { config } from "../../config";

export type User = {
  id?: Number;
  firstname: string;
  lastname: string;
  username: string;
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
  username: {
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
      throw new Error(`Unable to index Users. Error: ${err}`)
    }
  }

  async show(id: string): Promise<User> {
    try {
      const result = await users.findById(id)
      return result;
    } catch (err) {
      throw new Error(`Unable to Show Users. Error: ${err}`)
    }
  }

  async create(user: User): Promise<User> {
    try {
      const createUsers = new users(user)
      const result = await createUsers.save()
      return result;
    } catch (err) {
      throw new Error(`Unable to index Users. Error: ${err}`)
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