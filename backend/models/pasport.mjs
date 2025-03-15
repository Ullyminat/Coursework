import mongoose from "mongoose";
import Cabinet from "./cabinet.mjs";
import UMK from "./umk.mjs";
import Spec from "./spec.mjs";

const pasportSchema = new mongoose.Schema({
    created_at: {
        type: Date,
        default: Date.now
    },
    file:{
        type:String,
    },
    cabinets: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Cabinet'
    }],
    UMK: [{
        type: mongoose.Schema.ObjectId,
        ref: 'UMK'
    }],
    specs: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Spec'
    }]
    });

const Pasport = mongoose.model('Pasport', pasportSchema);
export default Pasport;