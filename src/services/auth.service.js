import httpStatus from "http-status";
import ApiError from "../utils/ApiError.js";
import { getUserByEmail } from "./user.service.js";

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
export const loginUserWithEmailAndPassword = async (email, password) => {
    const user = await getUserByEmail(email);
    console.log(user)
    if (!user || !(await user.isPasswordMatch(password))) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
    }
    return user;
};
