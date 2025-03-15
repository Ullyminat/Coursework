import mongoose from "mongoose";

const specSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique: true,
    },
    });

const Spec = mongoose.model('Spec', specSchema);
export default Spec;