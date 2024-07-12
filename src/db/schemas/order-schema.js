import { ProductSchema } from './product-schema.js';
import { CategorySchema } from './category-schema.js';
import { UserSchema } from './user-schema.js';
import mongoose, { Schema } from "mongoose";

// Product와 User 모델 생성
const Product = mongoose.model("Product", ProductSchema);
const User = mongoose.model("User", UserSchema);

const OrderSchema = new Schema({
    products: [
        {
            productId: {
                type: String,
                ref: Product,
                required: false
            },
            quantity: {
                type: Number,
                required: true
            },
            _id: false
        }
    ],
    userStatus: {
        type: String,
        required: false
    },
    userName:{
        type: String,
        ref: User,
        required: true
    },
    userEmail: {
        type: String,
        ref: "User",
        required: true
    },
    userAddress: {
        type: String,
        ref: "User",
        required: true
    },
    userPhoneNumber: {
        type: String,
        ref: "User",
        required: true
    },
    orderNumber: {
        type: String,
        unique: true,
        required: true
    },
    paymentMethod: {
        type: String,
        required: false
    },
    orderStatus: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    },
    customerMessage: {
        type: String
    }
});

export { OrderSchema };
