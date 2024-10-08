import express from "express"
import config from "./config/config.js";
import { errorHandler as errorHandle, successHandler } from "./config/morgan.js";
import helmet from "helmet";
import cors from 'cors';
import passport from "passport";
import { jwtStrategy } from "./config/passport.js";
import { authLimiter } from "./middlewares/rateLimiter.js";
import { errorConverter, errorHandler } from "./middlewares/error.js";
import httpStatus from "http-status";
import ApiError from "./utils/ApiError.js";
import router from "./config/routes.js";
import fileUpload from "express-fileupload";
// import "./bootstrap.js"
const app = express();

if (config.env !== "test") {
    app.use(successHandler);
    app.use(errorHandle)
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));


// enable cors
app.use(cors());
app.options('*', cors());
// Webhook verification endpoint
app.get('/api/webhook', (req, res) => {
    const VERIFY_TOKEN = 'sourabh123456789@shuklatest';

    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});

// Webhook event endpoint
app.post('/api/webhook', (req, res) => {
    const body = req.body;

    if (body.object) {
        console.log('Received webhook:', JSON.stringify(body, null, 2));
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
});
// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// // limit repeated failed requests to auth endpoints
// if (config.env === 'production') {
//     app.use('/v1/auth', authLimiter);
// }
// Use express-fileupload middleware
app.use(fileUpload());
// // v1 api routes
app.use('/api', router);

// // send back a 404 error for any unknown api request
app.use((req, res, next) => {
    // console.log(req, res)
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// // convert error to ApiError, if needed
app.use(errorConverter);

// // handle error
app.use(errorHandler);

export default app;