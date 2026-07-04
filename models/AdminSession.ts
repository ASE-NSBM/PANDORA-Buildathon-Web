import mongoose, { Schema } from "mongoose";

const AdminSessionSchema = new Schema(
  {
    // SHA-256 hash of the opaque session token (raw token lives only in the cookie).
    tokenHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    adminId: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },

    username: {
      type: String,
      required: true,
    },

    // TTL index: Mongo auto-removes the document once this date passes.
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.AdminSession ||
  mongoose.model("AdminSession", AdminSessionSchema);
