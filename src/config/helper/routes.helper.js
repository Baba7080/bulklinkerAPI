// import client from '../../services/redis.js';
// import { getUserData } from '../TokenManager.js';

const middleWareDiParamControl = async (req, res, next) => {
    // mongo user id
    let user = {};
    // if (req?.decoded?.username) {
    //     user = await getUserData({ username: req.decoded.username });
    // }
    let request = {
        params: req.params,
        query: req.query,
        body: req.body,
        headers: req.headers,
        files: req.files,
        cookies: req.cookies,
        ip: req.ip,
        method: req.method,
        url: req.url,
        getUser: () => {
            return req['user'] ?? [];
        },
        // getConfig: async (key) => {
        //     let config = await client.get(key);
        //     if (config) {
        //         config = JSON.parse(config);
        //     }
        //     return config;
        // },
        // setConfig: async (key, value) => {
        //     await client.set(key, JSON.stringify(value));
        // }
    };
    return request;
};

function createPath(r, routefile, file) {
    // path is the combination of folder name, file name and route path and also conatins the method type
    // let say we have a file name user.route.js in user folder and it has a route path /getUserToken and method type is get
    const path = '/' + r.version + '/' + file + "/" + routefile.replace('.route.js', '') + r.path;
    return path;
}

export { middleWareDiParamControl, createPath };