
import Account from "../models/account.model.js";
export const createAccount = async (data) => {
    try {
        const { user_id, whatsapp_business_account_id, phone_number_id, access_token, name, message_template_namespace, number_registered, user_assigned, subscribed_apps, phone_number_details } = data;

        // Configure options for upsert operation
        const options = {
            upsert: true, // Creates a new document if a document with the given wabaid and phonenumberid does not exist
            new: true, // Returns the updated document if one is found or created
            setDefaultsOnInsert: true // Sets default values for any fields not provided in the update
        };

        // Define update operation
        const update = {
            user_id,
            whatsapp_business_account_id,
            phone_number_id,
            access_token,
            name,
            message_template_namespace,
            number_registered,
            user_assigned,
            subscribed_apps,
            phone_number_details
        };

        // Perform the upsert operation
        const savedAccount = await Account.findOneAndUpdate(
            { whatsapp_business_account_id, phone_number_id },
            update,
            options
        );

        return savedAccount;
    } catch (error) {
        throw new Error(`Could not create or update account: ${error.message}`);
    }
};

export const getAccountByUserId = async (user_id) => {
    try {
        const account = await Account.find({ user_id });
        return account;
    } catch (error) {
        throw new Error(`Could not fetch account: ${error.message}`);
    }
};
export const getAccountById = async (waba_id, phone_number_id, user_id) => {
    try {
        const account = await Account.findOne({ whatsapp_business_account_id: waba_id, phone_number_id, user_id });
        return account;
    } catch (error) {
        throw new Error(`Could not fetch account: ${error.message}`);
    }
};