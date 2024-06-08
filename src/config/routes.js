import e, { Router } from 'express';
import * as fs from 'fs';
import { catchAsync } from '../utils/catchAsync.js';
import { config as dafaultConfig } from '../etc/index.config.js';
import { middleWareDiParamControl, createPath } from './helper/routes.helper.js';
import path from 'path';
import logger from './logger.js';
import auth from '../middlewares/auth.js';
import httpStatus from 'http-status';

const router = Router();

const rootFolder = path.resolve() + "/src/api/";
// LOGGER(rootFolder);

try {
    main();
    logger.info("Routes loaded");
} catch (error) {
    logger.error("error: ", error);
}


function main() {
    // start from SRC folder
    fs.readdirSync(rootFolder).forEach(file => {
        traverseRouteFolders(file);
    });
}

function traverseRouteFolders(file) {
    // check if folder has routes folder
    if (fs.existsSync(rootFolder + file + '/routes')) {
        const newRoutePath = rootFolder + file + '/routes';
        traverseRouteFiles(newRoutePath, file);
    }
}

function traverseRouteFiles(newRoutePath, file) {
    // loop through all files in routes folder and pick only route files which contains .route.js
    try {
        fs.readdirSync(newRoutePath).forEach(async (routefile) => {
            if (routefile.indexOf('.route.js') > -1) {
                /**  import route file and add it to express router */
                await import(newRoutePath + '/' + routefile).then((route) => {
                    // route is the object of route file which contains all the routes of that file 
                    // LOGGER(route.default);
                    if (route.default && typeof route.default === "object" && route.default.length > 0) {
                        // loop through all the routes of that file
                        traverseObject(route.default, routefile, file);
                    }
                }).catch(e => {
                    console.log(e)
                    logger.error({ msg: e.stack.split('\n'), code: e.code, file: 'exception', type: 'error' });
                });
            }
        });
    } catch (error) {
        logger.error(error);
    }
}

function traverseObject(route, routefile, file) {
    try {
        route.forEach((r) => {
            // r is the object of each route which contains path, method and function
            if (r.method && typeof r.method === "string") {
                // if method is not valid then we are not adding the route
                if (!versionValidation(r.version)) {
                    logger.error("version is not valid : ", r.version, " for route : ", r.path);
                    return false;
                }
                const path = createPath(r, routefile, file);
                // we are adding the route to express router with the method type and path and also adding the middleware and function to it 
                router[r.method ?? 'get'](path,
                    auth(r.auth),
                    async (req, res, next) => {
                        // console.log(req)
                        // console.log(req)
                        // r.function is the function which we have defined in route file
                        if (r.function && typeof r.function === "function") {
                            // we are calling the function and passing the request, response and next to it
                            let response = null;
                            try {
                                response = await catchAsync(r.function)(await middleWareDiParamControl(req, res, next), res);
                                // console.log(response)
                            } catch (error) {
                                logger.error(error, "Error: in CatchAsync Controller");
                            }
                            if (res.headersSent) {
                                // if the function returns already then we are exiting
                                // res.headersSent is used to check if the response is already sent or not
                                return true;
                            }
                            // const response = r.function(req, res, next);
                            // if the function returns the response then we are sending the response to the user
                            // console.log(response)
                            if (response) {
                                // return res.status(response['status_code'] ?? 200).send(response);
                                res.status(response['status_code'] ?? 200).send(response);
                            } else {
                                // res.status(400).send({ success: false, message: "content_missing: this route does not contain any content" });
                                return true;
                            }
                        } else {
                            // if the function is not defined then we are sending the error to the user
                            res.status(400).send({ success: false, message: "access_forbidden: this route does not contain any function!" });
                        }
                    }, errorHandleMiddleWare);
            }
        });
    } catch (error) {
        logger.error(error);
    }
}

function versionValidation(version) {
    try {
        // LOGGER(typeof value, value, "???")
        if (dafaultConfig.version === null) {
            throw new Error("Route_error: Cannot find version in redis");
        }
        const value = dafaultConfig.version;
        let flag = false;
        if (typeof value === "object" && value.length > 0) {
            Object.values(value).forEach(e => {
                if (e === version) flag = true;
            })
        }
        return flag;
    } catch (error) {
        logger.error(error, "Error : versionValidation");
        return false;
    }
}

const errorHandleMiddleWare = (err, req, res, next) => {
    console.log(res.status, "fddf")
    res.send({ success: false, message: err.message })
    logger.error(err, res.headersSent);
}

export default router;
