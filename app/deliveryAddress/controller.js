import { subject } from "@casl/ability";
import { policyFor } from "../../utils/index.js";
import DeliveryAddress from "./models.js";

const deliveryAddressController = {
  index: async (req, res, next) => {
    try {
      const { skip = 0, limit = 10 } = req.query;
      const count = await DeliveryAddress.find({
        user: req.user._id,
      }).countDocuments();
      const address = await DeliveryAddress.find({ user: req.user._id })
        .skip(parseInt(skip))
        .limit(parseInt(limit))
        .sort("-createdAt");
      return res.status(200).json({ data: address, count });
    } catch (error) {
      if (error && error.name === "ValidationError") {
        return res.status(400).json({
          errorNumber: 1,
          message: error.message,
          fields: error.errors,
        });
      }

      next(error);
    }
  },
  destroy: async (req, res, next) => {
    try {
      const policy = policyFor(req.user);
      const { id } = req.params;
      let address = await DeliveryAddress.findById(id);
      const subjectAddress = subject("DeliveryAddress", {
        ...address,
        user_id: address.user,
      });
      if (!policy.can("delete", subjectAddress)) {
        return res.status(403).json({
          errorNumber: 1,
          message: "You are not allowed to modify this resource",
        });
      }
      address = await DeliveryAddress.findByIdAndDelete(id);
      res.status(200).json({ response: "Success deletet address ", data: address });
    } catch (error) {
      if (error && error.name === "ValidationError") {
        return res.status(400).json({
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
      const payload = req.body;
      const user = req.user;
      const address = await DeliveryAddress({ ...payload, user: user._id });
      await address.save();
      return res.status(201).json(address);
    } catch (error) {
      if (error && error.name === "ValidationError") {
        return res.status(400).json({
          errorNumber: 1,
          message: error.message,
          fields: error.errors,
        });
      }

      next(error);
    }
  },
  update: async (req, res, next) => {
    try {
      const policy = policyFor(req.user);
      const { _id, ...payload } = req.body;
      const { id } = req.params;
      let address = await DeliveryAddress.findById(id);
      const subjectAddress = subject("DeliveryAddress", {
        ...address,
        user_id: address.user,
      });
      if (!policy.can("update", subjectAddress)) {
        return res.status(403).json({
          errorNumber: 1,
          message: `You are not allowed to modify this resource`,
        });
      }
      address = await DeliveryAddress.findByIdAndUpdate(id, payload, {
        new: true,
      });
      return res.status(201).json(address);
    } catch (error) {
      if (error && error.name === "ValidationError") {
        return res.status(400).json({
          errorNumber: 1,
          message: error.message,
          fields: error.errors,
        });
      }

      next(error);
    }
  },
};

export default deliveryAddressController;
