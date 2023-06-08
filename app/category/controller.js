import Category from "./models.js";

const categoryController = {
  index: async (req, res, next) => {
    try {
      const category = await Category.find();
      return res.json(category);
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
      const payload = req.body;
      const category = await Category(payload);
      await category.save();
      return res.json(category);
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
  update: async (req, res, next) => {
    try {
      const payload = req.body;
      const { id } = req.params;
      const category = await Category.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
      });
      await category.save();
      return res.json(category);
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
  destroy: async (req, res, next) => {
    try {
      const { id } = req.params;
      const category = await Category.findByIdAndDelete(id);
      return res.json({
        response: "Success Deleted Category",
        message: "Success Deleted Category By Id" + category._id,
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
};

export default categoryController;
