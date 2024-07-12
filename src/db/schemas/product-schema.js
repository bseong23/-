import mongoose, { Schema } from "mongoose";
import { CategorySchema } from "./category-schema.js";

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    attribute: {
        type: String,
        default: 'new'
    },
    productId: {
        type: String,
        required: true,
        unique: true
    },
},
{
    collection: "products",
    timestamp: true,
}
);

export { ProductSchema };
