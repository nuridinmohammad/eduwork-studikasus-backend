import { Types } from "mongoose";
import CartItem from "../cart-item/model.js";
import DeliveryAddress from "../deliveryAddress/models.js";
import Order from "../order/model.js";
import OrderItem from "../order-item/model.js";

const orderController = {
  index: async (req, res, next) => {
    try {
      const { skip = 0, limit = 10 } = req.query;
      const count = await Order.find({ user: req.user._id }).countDocuments();
      const orders = await Order.find({ user: req.user._id })
        .skip(parseInt(skip))
        .limit(parseInt(limit))
        .populate("order_items")
        .sort("-createdAt");
      return res.json({
        data: orders.map((order) => order.toJSON({ virtuals: true })),
        count,
      });
    } catch (error) {
      if (error && error.name === "ValidationError") {
        return res.json({
          errorNumber: 1,
          message: error.message,
          fields: error.errors,
        });
      }

      next(error);
    }
  },
  store: async (req, res, next) => {
    try {
      const { delivery_fee, delivery_address } = req.body;
      const items = await CartItem.find({ user: req.user._id }).populate(
        "product"
      );
      if (!items) {
        return res.json({
          errorNumber: 1,
          message:
            "You are not create order because you have not items in cart",
        });
      }
      const address = await DeliveryAddress.findById(delivery_address);
      const order = new Order({
        _id: new Types.ObjectId(),
        status: "waiting_payment",
        delivery_fee: delivery_fee,
        delivery_address: {
          provinsi: address.provinsi,
          kabupaten: address.kabupaten,
          kecamatan: address.kecamatan,
          kelurahan: address.kelurahan,
          detail: address.detail,
        },
        user: req.user._id,
      });
      let orderItems = await OrderItem.insertMany(
        items.map((item) => ({
          ...item,
          name: item.product.name,
          qty: parseInt(item.qty),
          order: order._id,
          product: item.product._id,
        }))
      );
      orderItems.forEach((item) => order.order_items.push(item));
      order.save();
      await CartItem.deleteMany({ user: req.user._id });
      return res.json(order);
    } catch (error) {
      if (error && error.name === "ValidationError") {
        return res.json({
          errorNumber: 1,
          message: error.message,
          fields: error.errors,
        });
      }

      next(error);
    }
  },
};

export default orderController;
