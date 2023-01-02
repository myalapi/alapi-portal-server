import mongoose from 'mongoose';

const PlatformSchema = new mongoose.Schema({
    platformKey: String,
    platformName: String,
    platformUrl:String,
    icon:String,
    type: String,
    credentials:Array,
    
});

mongoose.model('Platforms', PlatformSchema, 'platforms');