import jwt from "jsonwebtoken";
import User from "../app/user/models.js";
import { getToken, policyFor } from "../utils/index.js";
import config_env from "../app/config.js";

export function decodeToken() {
  return async function (req, res, next) {
    try {
      const token = getToken(req);
      console.log(token);
      if (!token) return next();
      req.user = jwt.verify(token, config_env.secretkey);
      const user = await User.findOne({ token: { $in: [token] } });
      if (!user) return res.json({ errorNumber: 1, message: "token expired" });
    } catch (error) {
      if (error && error.name === "JsonWebTokenError") {
        return res.json({
          errorNumber: 1,
          message: error.message,
        });
      }
      next(error);
    }
    return next();
  };
}

export function policy_check(action, subject) {
  return function (req, res, next) {
    console.log(req.user);
    const policy = policyFor(req.user);
    if (!policy.can(action, subject)) {
      return res.json({
        errorNumber: 1,
        message: `You are not allowed to ${action} ${subject}`,
      });
    }
    next();
  };
}
