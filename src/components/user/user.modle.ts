import { Schema, model } from "mongoose";
import { compareSync } from "bcrypt";
import { config } from "../../config";

export type User = {
  id?: Number;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

// `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VycyI6eyJmaXJzdG5hbWUiOiJNb2hhbWVkIiwibGFzdG5hbWUiOiJIb3NzYW0iLCJ1c2VybmFtZSI6Ik1vaGFtZWRIb3NzYW0iLCJlbWFpbCI6Im1vaGFtZWRob3NzYW1AeWFob28uY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkUExRdU45ZzRlUHNjazMwQ1I3NHBydUtLUXBzMzVPNThWb2J2em1ZWUhSeEs3Y1dhWFZVdC4iLCJpc0FkbWluIjp0cnVlLCJfaWQiOiI2MjlmNjlmYWVkMjBlZGZkZDdjMmU3ZTAiLCJfX3YiOjB9LCJpYXQiOjE2NTQ2MTQ1MjJ9.a7k6MUt9A8eLjZTg7AeniA_1q2tjQ4k28xUd6NHmrzA`
// `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VycyI6eyJmaXJzdG5hbWUiOiJNb2hhbWVkIiwibGFzdG5hbWUiOiJIb3NzYW0iLCJ1c2VybmFtZSI6Ik1vaGFtZWRIb3NzYW0iLCJlbWFpbCI6Im1vaGFtZWRob3NzYW1AeWFob28uY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkbDBPUGJ2eWtzSlhBdHUvQUlRRkh4TzhWaG9MUlVWT3lTNGdvTm5id1ZUN2VZN0hEYVJTdzYiLCJpc0FkbWluIjpmYWxzZSwiX2lkIjoiNjI5ZjZhMTljMWJkZWZiNzZkMWMzODJjIiwiX192IjowfSwiaWF0IjoxNjU0NjE0NTUzfQ.oTqaCxKLQGaC-e9I5UPlZS8WOzFOgbuIippqM49abhA`

const userSchema = new Schema({
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

  async show(username: string): Promise<User> {
    try {
      const result = await users.findOne({}).where({username: username})
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