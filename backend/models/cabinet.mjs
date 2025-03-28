import mongoose from "mongoose";

const cabinetSchema = new mongoose.Schema({
    cabinet:{
        type:String,
        required:true,
        unique: true,
    },
    name:{
        type:String,
    },  
    year:{
        type:Number,
        required:true,
    },
    S: {
        type:Number,
        required:true,
    }
    });

const Cabinet = mongoose.model('Cabinet', cabinetSchema);
export default Cabinet;