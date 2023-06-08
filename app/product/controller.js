import path from "path";
import fs from "fs";

import config_env from "../config.js";
import Product from "./models.js";
import Category from "../category/models.js";
import Tag from "../tag/models.js";

const productController = {
  // store product
  store: async (req, res, next) => {
    try {
      let payload = req.body;

      if (payload.category) {
        let category = await Category.findOne({
          name: { $regex: payload.category, $options: "i" },
        });

        if (category) {
          payload = { ...payload, category: category._id };
        } else {
          delete payload.category;
        }
      }

      if (payload.tags && payload.tags.length > 0) {
        let tags = await Tag.find({
          name: { $in: payload.tags },
        });

        if (tags.length) {
          payload = { ...payload, tags: tags.map((tag) => tag._id) };
        } else {
          delete payload.tags;
        }
      }

      if (req.file) {
        let tmp_path = req.file.path;
        let originalExt =
          req.file.originalname.split(".")[
            req.file.originalname.split(".").length - 1
          ];
        let filename = req.file.filename + "." + originalExt;
        let target_path = path.resolve(
          config_env.rootPath,
          `BACKEND/public/images/products/${filename}`
        );
        const src = fs.createReadStream(tmp_path);
        const dest = fs.createWriteStream(target_path);
        src.pipe(dest);
        src.on("end", async () => {
          try {
            let product = new Product({ ...payload, image_url: filename });
            await product.save();
            return res.json(product);
          } catch (error) {
            fs.unlinkSync(target_path);
            if (err && err.name === "ValidationError") {
              return res.json({
                errorNumber: 1,
                message: error.message,
                fields: error.errors,
              });
            }
            next(error);
          }
        });

        src.on("error", async () => {
          next(error);
        });
      } else {
        let product = new Product(payload);
        await product.save();
        return res.json(product);
      }
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
      let payload = req.body;
      const { id } = req.params;

      if (payload.category) {
        let category = await Category.findOne({
          name: { $regex: payload.category, $options: "i" },
        });

        if (category) {
          payload = { ...payload, category: category._id };
        } else {
          delete payload.category;
        }
      }

      if (payload.tags && payload.tags.length > 0) {
        let tags = await Tag.find({
          name: { $in: payload.tags },
        });

        if (tags.length) {
          payload = { ...payload, tags: tags.map((tag) => tag._id) };
        } else {
          delete payload.tags;
        }
      }

      if (req.file) {
        let tmp_path = req.file.path;
        let originalExt =
          req.file.originalname.split(".")[
            req.file.originalname.split(".").length - 1
          ];
        let filename = req.file.filename + "." + originalExt;
        let target_path = path.resolve(
          config_env.rootPath,
          `BACKEND/public/images/products/${filename}`
        );
        const src = fs.createReadStream(tmp_path);
        const dest = fs.createWriteStream(target_path);
        src.pipe(dest);
        src.on("end", async () => {
          try {
            const productById = await Product.findById(id);
            const currentImage = `${config_env.rootPath}/BACKEND/public/images/products/${productById.image_url}`;

            if (fs.existsSync(currentImage)) {
              fs.unlinkSync(currentImage);
            }

            const product = await Product.findByIdAndUpdate(id, payload, {
              new: true,
              runValidators: true,
            });
            await product.save();
            return res.json(product);
          } catch (error) {
            fs.unlinkSync(target_path);
            if (err && err.name === "ValidationError") {
              return res.json({
                errorNumber: 1,
                message: error.message,
                fields: error.errors,
              });
            }
            next(error);
          }
        });

        src.on("error", async () => {
          next(error);
        });
      } else {
        const product = await Product.findByIdAndUpdate(id, payload, {
          new: true,
          runValidators: true,
        });
        await product.save();
        return res.json(product);
      }
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

  index: async (req, res, next) => {
    try {
      const {
        skip = 0,
        limit = 10,
        q = "",
        category = "",
        tags = [],
      } = req.query;
      let criteria = {};

      if (q.length) {
        criteria = {
          ...criteria,
          name: { $regex: `${q}`, $options: "i" },
        };
      }

      if (category.length) {
        let categoryResult = await Category.findOne({
          name: { $regex: `${category}`, $options: "i" },
        });
        if (categoryResult) {
          criteria = { ...criteria, category: categoryResult._id };
        }
      }

      if (tags.length) {
        let tagsResult = await Tag.find({
          name: { $in: tags },
        });
        if (tagsResult.length > 0) {
          criteria = {
            ...criteria,
            tags: { $in: tagsResult.map((tag) => tag._id) },
          };
        }
      }
      const count = await Product.find().countDocuments();
      const product = await Product.find(criteria)
        .skip(parseInt(skip))
        .limit(parseInt(limit))
        .populate("tags")
        .populate("category");
      return res.json({
        data: product,
        totalNet: count,
      });
    } catch (error) {
      next(error);
    }
  },

  destroy: async (req, res, next) => {
    try {
      const productById = await Product.findByIdAndDelete(req.params.id);
      const currentImage = `${config_env.rootPath}/BACKEND/public/images/products/${productById.image_url}`;

      if (fs.existsSync(currentImage)) {
        fs.unlinkSync(currentImage);
      }
      return res.json({
        response: "success delete",
        productId: productById._id,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default productController;
