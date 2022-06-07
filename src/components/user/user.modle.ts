import { Schema, model } from "mongoose";
import { compareSync } from "bcrypt";
import { config } from "../../config";

export type User = {
  id?: Number;
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
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
  isAdmin: {
    type: Boolean,
  },
})

const users = model("User", userSchema)

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

  async delete(id: string): Promise<User> {
    try {
      const result = await users.findByIdAndRemove(id)
      return result;
    } catch (err) {
        throw new Error(`unable to delete this user. Error: ${err}`);
    
    }
  }

  async update(id: Number, u:User): Promise<User> {
    try {
      const result = await users.findOneAndUpdate(id, u, { returnOriginal: false })
      return result;
    } catch (err) {
        throw new Error(`unable to Update the user. Error: ${ err }`)
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