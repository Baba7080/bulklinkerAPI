import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    message_template_namespace: {
        type: String,
        required: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    whatsapp_business_account_id: {
        type: String,
        required: true,
    },
    phone_number_id: {
        type: String,
        required: true,
    },
    access_token: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

const Account = mongoose.model('Account', accountSchema);

export default Account;
