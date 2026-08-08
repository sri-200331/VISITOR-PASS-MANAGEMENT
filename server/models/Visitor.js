import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema({
  name: { 
    type: String,
     required: true,
      trim: true
     },
  email: { 
    type: String,
     default: "", 
     trim: true, 
     lowercase: true
     },
  phone: { 
    type: String, 
    required: true,
     trim: true
     },
  company: {
     type: String,
      default: "",
       trim: true 
      },
  employee: {
     type: mongoose.Schema.Types.ObjectId,
      ref: "User",
       required: true 
      },
  visitDate: {
     type: String,
      required: true
     },
  expectedArrival: { 
    type: String,
     required: true
     },
  purpose: { 
    type: String, 
    required: true,
     trim: true
     },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "checked-in", "checked-out", "cancelled"],
    default: "pending"
  },
  remarks: {
     type: String,
      default: "" 
    },
  checkedInAt: {
     type: Date,
      default: null
     },
  checkedOutAt: { 
    type: Date,
     default: null
     },
  createdBy: {
     type: mongoose.Schema.Types.ObjectId, 
     ref: "User",
      required: true
     }
}, { timestamps: true });

visitorSchema.index({ phone: 1, visitDate: 1 });
visitorSchema.index({ status: 1, visitDate: 1 });

export default mongoose.model("Visitor", visitorSchema);
