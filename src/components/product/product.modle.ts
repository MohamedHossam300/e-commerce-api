import mongoose from "mongoose";

export interface Product {
  id?: number
  name: string
  desc: string
  color: string
  size : string
  price: number
  category: string

}
const productSchema = new mongoose.Schema({
    name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  desc: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    trim: true
  },
  size: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
})

const products = mongoose.model("Product", productSchema)


export class TheProductStore {

  // index method
  
  async index(): Promise<Product[]> {
    try {
      const result = await products.find({})
      return result
    } catch (err) {
      throw new Error(`Unable to display Products. Error: ${err}`)
    }
  }


//show method
  async show(name: string): Promise<Product> {
      try {
        const result = await products.findOne().where({name: name})
       return result;
      } catch (err) {
        throw new Error(`Unable to display Product. Error: ${err}`)
      }
    }
  //creat method
  async create(product: Product): Promise<Product> {
    try {
      const createProdcut = new products(product)
      const result = await createProdcut.save()
      return result;
    } catch (err) {
      throw new Error(`Unable to creat Product. Error: ${err}`)
    }
  }


  //delete method
  async delete(name: string): Promise<Product> {
    try {
      const result = await products.findOneAndDelete({name :name})
      //.where({name: name})
      return result.rows[0]
    } catch (err) {
        throw new Error(`unable to delete this product. Error: ${err}`);
    
    }
  }

 
  
}