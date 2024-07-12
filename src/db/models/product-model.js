import { model } from "mongoose";
import { ProductSchema } from "../schemas/product-schema.js";
import mongoose from "mongoose";

const Product = model("products", ProductSchema);

export class ProductModel {
    async create(productInfo) {
        const createdNewProduct = await Product.create(productInfo);
        return createdNewProduct;
    }

    async findById(productId) {
        const product = await Product.findOne({productId: productId});
        return product;
    }

    async findAll() {
        const products = await Product.find({});
        return products;
    }

    async countDocuments(filter = {}) {
        const count = await Product.countDocuments(filter);
        return count;
    }

    async delete(productId) {
        await Product.deleteOne({ productId });
    }

    async update(productId, toUpdate) {
        const updatedProduct = await Product.findOneAndUpdate(
            { productId: productId },
            { $set: toUpdate },
            { new: true }
        );
        return updatedProduct;
    }
}

const productModel = new ProductModel();

export { productModel };
