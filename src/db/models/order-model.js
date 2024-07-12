import { model } from "mongoose";
import { OrderSchema } from "../schemas/order-schema.js";
import mongoose from "mongoose";

const Order = model("orders", OrderSchema);

export class OrderModel {
    async create(orderInfo) {
        const newOrder = await Order.create(orderInfo);
        return newOrder;
    }

    async findById(orderId) {
        const order = await Order.findOne({orderId: orderId});
        return order;
    }

    async findAll() {
        const orders = await Order.find({});
        return orders;
    }

    async countDocuments(filter = {}) {
        const count = await Order.countDocuments(filter);
        return count;
    }

    async delete(orderId) {
        await Order.deleteOne({ orderId });
    }

    async update(orderId, toUpdate) {
        const updatedOrder = await Order.findOneAndUpdate(
            { orderId: orderId },
            { $set: toUpdate },
            { new: true }
        );
        return updatedOrder;
    }
}

const orderModel = new OrderModel();

export { orderModel };
