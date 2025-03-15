import mongoose from "mongoose";

const umkSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique: true,
    },
    year:{
        type:Number,
        required:true,
    },
    });

const UMK = mongoose.model('UMK', umkSchema);
export default UMK;