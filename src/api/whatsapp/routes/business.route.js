import { getCSV, getUser, getUserTemplates, saveUserTemplates, sendMessages, setUpUser, uploadCSV } from "../components/business.component.js";

const routes = [
    // {
    //     path: '/getBusinessAccount',
    //     method: 'all',
    //     version: 'v1',
    //     auth: false,
    //     function: getBusinessAccount
    // },
    // {
    //     path: '/getBusinessAccountID',
    //     method: 'all',
    //     version: 'v1',
    //     auth: false,
    //     function: getBusinessAccountID
    // },
    {
        path: "/setUpUser",
        method: "post",
        version: "v1",
        auth: "setUpUser",
        function: setUpUser
    },
    {
        path: "/getUser",
        method: "get",
        version: "v1",
        auth: "getUser",
        function: getUser
    },
    {
        path: "/getUserTemplates",
        method: "all",
        version: "v1",
        auth: "getUserTemplates",
        function: getUserTemplates
    },
    {
        path: "/saveUserTemplates",
        method: "all",
        version: "v1",
        auth: "saveUserTemplates",
        function: saveUserTemplates
    },
    {
        path: "/uploadCSV",
        method: "post",
        version: "v1",
        auth: false,
        function: uploadCSV
    },
    {
        path: "/getCSV",
        method: "all",
        version: "v1",
        auth: false,
        function: getCSV
    },
    {
        path: "/sendMessages",
        method: "post",
        version: "v1",
        auth: false,
        function: sendMessages
    },
]

export default routes;

// 249632854897704/phone_numbers