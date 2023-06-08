import Tag from "./models.js";

const tagController = {
  index: async (req, res, next) => {
    try {
      const tag = await Tag.find();
      return res.json(tag);
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
      const tag = await Tag(payload);
      await tag.save();
      return res.json(tag);
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
      const tag = await Tag.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
      });
      await tag.save();
      return res.json(tag);
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
      const tag = await Tag.findByIdAndDelete(id);
      return res.json({
        response: "Success Deleted Tag",
        message: "Success Deleted Tag By Id" + tag._id,
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

export default tagController;
