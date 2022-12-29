import mongoose from 'mongoose';

const MerchantSchema = new mongoose.Schema({
    merchantId: Number,
    merchantName: String,
    userId:String,
    createdOn: Date,
    platforms: Object
});

mongoose.model('Merchants', MerchantSchema, 'merchants');