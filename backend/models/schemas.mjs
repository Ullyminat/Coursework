import mongoose from "mongoose";

const schemasSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cabinet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cabinet'
  },
  schema_data: {
    type: Object,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Schemas = mongoose.model('Schemas', schemasSchema);
export default Schemas;