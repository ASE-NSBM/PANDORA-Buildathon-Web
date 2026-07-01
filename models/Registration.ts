import mongoose, { Schema } from "mongoose";

const MemberSchema = new Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },

  studentId: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    lowercase: true,
  },

  contactNumber: {
    type: String,
    required: true,
  },

  whatsappNumber: {
    type: String,
    required: true,
  },
});

const RegistrationSchema = new Schema(
  {
    teamName: {
      type: String,
      required: true,
      trim: true,
    },

    memberCount: {
      type: Number,
      required: true,
    },

    members: {
      type: [MemberSchema],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Registration ||
  mongoose.model("Registration", RegistrationSchema);