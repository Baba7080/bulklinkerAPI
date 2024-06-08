import httpStatus from "http-status";
import ApiError from "../utils/ApiError.js";
import { roleRights } from "../config/roles.js";
import passport from "passport";

const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
    if (err || info || !user) {
        if (!user) return reject(new ApiError(httpStatus.UNAUTHORIZED, "Token Expired"));
        return reject(new ApiError(httpStatus.UNAUTHORIZED, info?.message));
    }
    req.user = user;
    // console.log(req.user)
    if (requiredRights.length) {
        const userRights = roleRights.get(user.role);
        const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight) || userRights.includes("*") );
        if (!hasRequiredRights) {
            return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
        }
    }

    resolve();
};

const auth = (...requiredRights) => async (req, res, next) => {
    if (requiredRights.includes(false)) {
        return next()
    }
    return new Promise((resolve, reject) => {
        passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
    })
        .then(() => next())
        .catch((err) => next(err));
};

export default auth
