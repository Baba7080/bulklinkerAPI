import { createAccount, getAccountByUserId } from "../../../services/account.service.js"
import { catchAsync } from "../../../utils/catchAsync.js"
import { getData, postData } from "../api/callAPI.js"
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

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
    let whatsapp_business_account_id = "249632854897704";
    let phone_number_id = "248166918380550";
    let access_token = "EAAGBjyPxpC8BOZBUKx2Gzm564vbEqPFDZAh9Mw4W6FU0QFkfhDy4yPCZC7W9N4nxd8jVjZASwJ72iDK9QZAk97yvdmXOCsuGsUj1afjXpn3cFqAk896l0jkZAQhiSKoZBafKuIikeHrFZB7xxgaawTzCZA5BJAmuHn2ctDVwAieUqbMQCCZCW7Ogwwdc14B4AmdBXzRv1or1y20malqzHUKM07L2jeeKpF9vJSbQZDZD"
    let name = "BYTELINKUP IT SOLUTIONS PVT LTD";
    let message_template_namespace = "a2bc147e_50cd_4aea_9a6f_757459f3753e"
    try {
        let res = await createAccount({ user_id, whatsapp_business_account_id, phone_number_id, access_token, name, message_template_namespace });
        return { success: true, message: "successful", res }
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
    let user_id = user._id;

    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }
        // console.log(req.files)
        // The name of the "input" field is "file"
        const uploadedFile = req.files.file;
        // console.log(uploadedFile)
        const uploadDir = path.resolve(process.cwd() + "/uploads", "1");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        const uploadPath = path.resolve(process.cwd() + "/uploads/" + "1", uploadedFile.name);

        console.log(uploadPath)
        // Use mv() method to place file on the server
        uploadedFile.mv(uploadPath, (err) => {
            if (err) {
                return res.status(500).send(err);
            }
            return { success: true, message: "file uploaded" }
            // Read and process the CSV file
            // const results = [];
            // fs.createReadStream(uploadPath)
            //     .pipe(csv())
            //     .on('data', (row) => {
            //         // Perform actions on the data here
            //         results.push(row);
            //         console.log(row);
            //     })
            //     .on('end', () => {
            //         console.log('CSV file successfully processed.');
            //         res.status(200).send({ message: 'File uploaded and processed successfully.', data: results });
            //     })
            //     .on('error', (error) => {
            //         res.status(500).send(error);
            //     });
        })
    } catch (err) {
        return { success: false, message: err.message }
    }
})

export const getCSV = catchAsync(async (req, res) => {
    let user = req.getUser();
    let user_id = user._id;
    try {
        const uploadDir = path.resolve(process.cwd() + "/uploads", "1");
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
    const payload = req.body.payload;
    const url = `${req.body.id}/messages`;

    try {
        const uploadDir = path.resolve(process.cwd(), 'uploads', '1', req.body.csv);

        if (!fs.existsSync(uploadDir)) {
            return res.status(404).json({ success: false, message: "CSV not found" });
        }

        const results = [];

        fs.createReadStream(uploadDir)
            .pipe(csv())
            .on('data', (row) => {
                results.push(row.phone); // Assume 'phone' is the column name in the CSV
            })
            .on('end', async () => {
                console.log('CSV file successfully processed.');
                try {
                    for (let i = 0; i < results.length; i++) {
                        const phoneNumber = results[i];
                        const response = await postData({ ...payload, to: phoneNumber }, url);
                        results.push(response)
                        console.log(`Message sent to ${phoneNumber}:`, response);
                    }
                    res.status(200).json({ message: 'File processed successfully.', data: results });
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


