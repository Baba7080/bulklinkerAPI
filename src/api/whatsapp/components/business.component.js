import { createAccount, getAccountById, getAccountByUserId } from "../../../services/account.service.js"
import { catchAsync } from "../../../utils/catchAsync.js"
import { getData, postData } from "../api/callAPI.js"
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { sendMessage } from "./SQS.helper.js";

// export const getBusinessAccount = catchAsync(async (req, res) => {
//     try {
//         let res = await getData(`me?access_token=${req.body.token}`, req.body.token)
//         return { "success": true, "message": "valid", res }
//     } catch (err) {
//         return { success: false, message: err.message }
//     }
// })

// export const getBusinessAccountID = catchAsync(async (req, res) => {
// try {
//     let res = await getData(`${req.body.id}/phone_numbers?access_token=${req.body.token}`, req.body.token)
//     return { "success": true, "message": "valid", res, url: `https://graph.facebook.com/v19.0/${req.body.id}/connected_whatsapp_businesses?access_token=${req.body.token}` }
// } catch (err) {
//     return { success: false, message: err.message }
// }
// })

export const setUpUser = catchAsync(async (req, res) => {
    let user = req.getUser();
    let user_id = user._id;
    let { code, waba_id, phone_number_id } = req.body
    let resp = { success: false, message: "Please Try again" };
    let whatsapp_business_account_id = "";
    let access_token = "12345"
    let name = "";
    let message_template_namespace = ""
    let number_registered = 'false';
    let user_assigned = 'false';
    let subscribed_apps = 'false';
    let phone_number_details = 'false';
    try {
        if (waba_id && phone_number_id) {
            let userData = await getAccountById(waba_id, phone_number_id, user_id)
            if (userData) {
                number_registered = userData.number_registered ?? "false";
                user_assigned = userData.user_assigned ?? "false";
                subscribed_apps = userData.subscribed_apps ?? "false";
            }
            resp = await getData(`${waba_id}`);
            if (resp.success) {
                if (resp.res) {
                    whatsapp_business_account_id = waba_id;
                    name = resp.res.name ?? "";
                    message_template_namespace = resp.res.message_template_namespace ?? ""
                }
            }
            resp = await getData(`${phone_number_id}`);
            if (resp.success && resp.res) {
                phone_number_details = resp.res
            }
            if (number_registered === "false") {
                resp = await postData({ messaging_product: "whatsapp", pin: "123456" }, `${phone_number_id}/register`)
                if (resp.success) {
                    number_registered = 'true';
                }
            }
            if (user_assigned === "false") {
                resp = await postData({}, `${waba_id}/assigned_users?user=122098793498353532&tasks=['MANAGE']`)
                if (resp.success && resp.res && resp.res.success) {
                    user_assigned = 'true';
                }
            }
            // resp = await getData(`${waba_id}/assigned_users?business=259526040233373`)
            if (subscribed_apps === "false") {
                resp = await postData({}, `${waba_id}/subscribed_apps`)
                if (resp.success) {
                    subscribed_apps = 'true';
                }
            }
            resp = await createAccount({ user_id, whatsapp_business_account_id, phone_number_id, access_token, name, message_template_namespace, number_registered, user_assigned, subscribed_apps, phone_number_details });
            return { success: true, message: "successful", resp }
        }
        return resp;
        // resp = await getData(`oauth/access_token?client_id=1075467237089677&client_secret=9422f9734dc9a21e0894721d20b4e419&code=${code}`, code)
        // console.log(resp)
        // if (resp.success) {
        // let token = "EAAPSIbqiYY0BO51zVbLwwWSF3ZAVF3BiberprXyq5hpkSCDIx5eA7htA3eyANCmpJZC6KVngBJBeTw6LOxoLGyXM0WqslJ86zmEYt82b26VZC1ZCvGzcaJaHl1nyokdSAoFYIugHbUfDCVh0vSAU4kCZCZAVMTLvX0VLvjUUDwBVZCt4c7s8jo09WVtOfUf6JFTZB51ZC2qZBGpO7olEAhSkpgb3obtZAtJxTrYwPpZAssDu6rAzWvHVPRCeghDv9OgW"
        // resp.res.access_token
        // console.log(token)
        // resp = await getData(`debug_token?input_token=${token}`, code)
        // if (resp.success) {
        //     if (resp.res && resp.res.data && resp.res.data.granular_scopes) {
        //         let granular_scopes = resp.res.data.granular_scopes;
        //         console.log(granular_scopes)
        //         let waba_ID = granular_scopes.find(x => x.scope === "whatsapp_business_management") ? granular_scopes.find(x => x.scope === "whatsapp_business_management").target_ids[0] : false;
        //         console.log(waba_ID)
        //         if(waba_ID){
        //             resp = await getData(`${waba_ID}/phone_numbers`);
        //             console.log(resp)
        //         }
        //     }
        //     return resp
        // }
        // }else{
        //     return resp;
        // }
        // return { "success": true, "message": "valid" }
    } catch (err) {
        return { success: false, message: err.message }
    }

})

export const getUser = catchAsync(async (req, res) => {
    let user = req.getUser();
    let user_id = user._id;
    try {
        let res = await getAccountByUserId(user_id);
        return { success: true, message: "successful", res }
    } catch (err) {
        return { success: false, message: err.message }
    }
})

export const getUserTemplates = catchAsync(async (req, res) => {
    let user = req.getUser();
    let user_id = user._id;
    try {
        // console.log(req)
        let url = `${req.body.id}/message_templates`;
        let res = await getData(url)
        return res
    } catch (err) {
        return { success: false, message: err.message }
    }
})
export const saveUserTemplates = catchAsync(async (req, res) => {
    let user = req.getUser();
    let user_id = user._id;
    try {
        // console.log(req)
        let url = `${req.body.id}/message_templates`;
        let res = await postData(req.body.payload, url)
        // console.log(res)
        return res
    } catch (err) {
        return { success: false, message: err.message }
    }
})
export const uploadCSV = catchAsync(async (req, res) => {
    let user = req.getUser();
    let user_id = user._id.toString();

    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }
        const uploadedFile = req.files.file;
        const uploadDir = path.resolve(process.cwd() + "/uploads", user_id);
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        const uploadPath = path.resolve(process.cwd() + "/uploads/" + user_id, uploadedFile.name);
        uploadedFile.mv(uploadPath, (err) => {
            if (err) {
                return res.status(500).send(err);
            }
        })
        return { success: true, message: "file uploaded" }
    } catch (err) {
        return { success: false, message: err.message }
    }
})

export const getCSV = catchAsync(async (req, res) => {
    let user = req.getUser();
    let user_id = user._id.toString();
    try {
        const uploadDir = path.resolve(process.cwd() + "/uploads", user_id);
        let filess = [];

        if (fs.existsSync(uploadDir)) {
            fs.readdir(uploadDir, (err, files) => {
                if (err) {
                    return res.status(500).send('Unable to scan files: ' + err);
                }
                console.log(files)
                files.map((ele) => {
                    console.log(path.extname(ele).toLowerCase() === ".csv", files.filter(file => path.extname(file).toLowerCase() === '.csv'))
                })
                filess = files.filter(file => path.extname(file).toLowerCase() === '.csv');
                res.status(200).send({ success: true, files: filess });
            })
        }
    } catch (err) {
        return { success: false, message: err.message }
    }
})

export const sendMessages = catchAsync(async (req, res) => {
    const user = req.getUser();
    let user_id = user._id.toString();
    const payload = req.body.payload;
    const url = `${req.body.id}/messages`;
    try {
        const uploadDir = path.resolve(process.cwd(), 'uploads', user_id, req.body.csv);

        if (!fs.existsSync(uploadDir)) {
            return res.status(404).json({ success: false, message: "CSV not found" });
        }

        const results = [];
        // let res = { success: false, message: "Unable to initiate process" }
        fs.createReadStream(uploadDir)
            .pipe(csv())
            .on('data', (row) => {
                results.push(row.phone); // Assume 'phone' is the column name in the CSV
            })
            .on('end', async () => {
                try {
                    const chunkedNumbers = chunkPhoneNumbers(results, process.env.CHUNK_SIZE ?? 200);
                    for (const chunk of chunkedNumbers) {
                         await sendMessage({ user_id, payload, csv: req.body.csv, url, chunk });
                    }
                    res.status(200).json({ success: true, message: "Process Initiated Successfully" });
                } catch (error) {
                    res.status(500).json({ success: false, message: error.message });
                }
            })
            .on('error', (error) => {
                res.status(500).json({ success: false, message: error.message });
            });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});


function chunkPhoneNumbers(phoneNumbers, chunkSize = 200) {
    const chunks = [];
    for (let i = 0; i < phoneNumbers.length; i += chunkSize) {
        chunks.push(phoneNumbers.slice(i, i + chunkSize));
    }
    return chunks;
}