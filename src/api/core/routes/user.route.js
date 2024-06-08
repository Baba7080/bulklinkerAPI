import { getLogin, register } from "../components/user.component.js";

const routes = [
    {
        path: '/register',
        method: 'all',
        version: 'v1',
        auth: 'register',
        function: register
    },
    {
        path: '/login',
        method: 'get',
        version: 'v1',
        auth: 'login',
        function: getLogin
    }
]

export default routes;