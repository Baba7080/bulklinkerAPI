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
    number_registered: {
        type: String,
        required: true,
    },
    user_assigned: {
        type: String,
        required: true,
    },
    subscribed_apps: {
        type: String,
        required: true,
    },
    phone_number_details: {
        type: mongoose.Schema.Types.Mixed, // Allow flexibility in data type
        required: true
    }
}, {
    timestamps: true,
});

const Account = mongoose.model('Account', accountSchema);

export default Account;
