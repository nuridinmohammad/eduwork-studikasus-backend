import express from "express";
import { policy_check } from "../../middlewares/index.js";
import deliveryAddressController from "./controller.js";

const router = express();

router.post(
  "/delivery-address",
  policy_check("create", "DeliveryAddress"),
  deliveryAddressController.store
);

router.put(
  "/delivery-address/:id",
  deliveryAddressController.update
);

router.delete(
  "/delivery-address/:id",
  deliveryAddressController.destroy
);

router.get(
  "/delivery-address",
  policy_check("view", "DeliveryAddress"),
  deliveryAddressController.index
);
export default router;
