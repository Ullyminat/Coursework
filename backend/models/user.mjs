import mongoose from "mongoose";
import Pasport from "./pasport.mjs";
import Cabinet from "./cabinet.mjs";
import Schemas from "./schemas.mjs";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    surname:{
        type:String,
        required:true,
    },
    patronymic:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        unique: true,
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default: 'user',
        enum: ["user", "admin"],
    },
    cabinets: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Cabinet'
    }],
    schemas: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Schemas'
    }],
    pasports: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Pasport'
    }]
    });

const User = mongoose.model('User',userSchema);
export default User;