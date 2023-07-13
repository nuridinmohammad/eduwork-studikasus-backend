import bcrypt from "bcrypt";
import passport from "passport";
import jsonwebtoken from "jsonwebtoken";

import config from "../config.js";
import AutoIncrement from "../user/auto_increment.js";
import User from "../user/models.js";
import { getToken } from "../../utils/index.js";

const authController = {
  register: async (req, res, next) => {
    try {
      const payload = req.body;
      const autoIncrement = await AutoIncrement.findOneAndUpdate(
        { id: "customer_id" },
        { $inc: { seq: 1 } },
        { new: true }
      );
      const result = {
        ...payload,
        customer_id: autoIncrement.seq,
      };
      const user = await User(result);
      await user.save();
      return res.status(201).json(user);
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
  localStrategy: async (email, password, done) => {
    try {
      const user = await User.findOne({ email }).select(
        "-__v -createAt -updateAt -cart_items -token"
      );
      if (!user) return done();
      if (bcrypt.compareSync(password, user.password)) {
        const { password, ...userWithoutPassword } = user.toJSON();
        // ({ password, ...userWithoutPassword } = user.toJSON());
        return done(null, userWithoutPassword);
      }
    } catch (error) {
      done(error, null);
    }
    done();
  },
  login: async (req, res, next) => {
    passport.authenticate("local", async function (error, user) {
      if (error) return next(error);
      if (!user) {
        return res.status(401).json({
          errorNumber: 1,
          message: "Email or Password incorrect",
        });
      }

      const signed = jsonwebtoken.sign(user, config.secretkey);
      const signIn = await User.findByIdAndUpdate(user._id, {
        $push: { token: signed },
      });
      res.status(200).json({
        message: "Login Success!",
        user,
        token: signed,
      });
      return signIn;
    })(req, res, next);
  },
  logout: async (req, res, next) => {
    const token = getToken(req);
    const user = await User.findOneAndUpdate(
      { token: { $in: [token] } },
      { $pull: { token: token } },
      { useFindAndModify: false }
    );
    if (!token || !user) {
      return res
        .status(401)
        .json({ errorNumber: 1, message: "No user Found!" });
    }
    return res.status(200).json({ errorNumber: 0, message: "Logout Berhasil" });
  },
  me: async (req, res, next) => {
    if (!req.user) {
      res.status(401).json({
        errorNumber: 1,
        message: "Anda sedang tidak login atau token expired",
      });
    }
    res.status(200).json({ response: "Sedang Login", data: req.user });
  },
};

export default authController;
