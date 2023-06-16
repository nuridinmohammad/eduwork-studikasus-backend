import { subject } from "@casl/ability";
import { policyFor } from "../../utils/index.js";
import Invoice from "./model.js";

const invoicesController = {
  show: async (req, res, next) => {
    try {
      const policy = policyFor(req.user);
      if (!policy.can("read", subjectInvoice)) {
        return res.status(403).json({
          errorNumber: 1,
          message: "Anda tidak memiliki akses untuk melihat invoice ini",
        });
      }
      const { order_id } = req.params;
      const invoice = await Invoice.findOne({ order: order_id })
        .populate("order")
        .populate("user");
      const subjectInvoice = subject("Invoice", {
        ...invoice,
        user_id: invoice.user._id,
      });

      return res.json(invoice);
    } catch (error) {
      if (error && error.name === "ValidationError") {
        return res.status(400).json({
          errorNumber: 1,
          response: "Error when getting invoices",
          message: error.message,
          fields: error.errors,
        });
      }

      next(error);
    }
  },
};

export default invoicesController;
