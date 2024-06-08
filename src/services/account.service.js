
import Account from "../models/account.model.js";
export const createAccount = async (data) => {
    try {
        const { name, message_template_namespace, user_id, whatsapp_business_account_id, phone_number_id, access_token } = data;
        const newAccount = new Account({
            user_id,
            whatsapp_business_account_id,
            access_token,
            phone_number_id,
            name,
            message_template_namespace
        });

        const savedAccount = await newAccount.save();
        return savedAccount;
    } catch (error) {
        throw new Error(`Could not create account: ${error.message}`);
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
