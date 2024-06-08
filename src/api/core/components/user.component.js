
import { loginUserWithEmailAndPassword } from "../../../services/auth.service.js";
import { generateAuthTokens } from "../../../services/token.service.js";
import { createUser, getUserByEmail } from "../../../services/user.service.js";
import { catchAsync } from "../../../utils/catchAsync.js";

export const register = catchAsync(async (req, res) => {
    try {
        const user = await createUser(req.body);
        return { success: true, message: "user created successfully" }
    } catch (err) {
        return { success: false, message: err.message }
    }
})

export const getLogin = catchAsync(async (req, res) => {
    try {
        const { email, password } = req.query;
        console.log(email, password)
        const user = await loginUserWithEmailAndPassword(email, password);
        const tokens = await generateAuthTokens(user);
        return { success: true, tokens: tokens }
    } catch (err) {
        return { success: false, message: err.message }
    }
})

const validateUserRegisterPayload = () => { }