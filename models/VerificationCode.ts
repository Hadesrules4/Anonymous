import mongoose, { Schema, Document } from "mongoose";

export interface IVerificationCode extends Document {
  userId: mongoose.Types.ObjectId;
  code: string;
  expiresAt: Date;
  createdAt: Date;
}

const VerificationCodeSchema: Schema<IVerificationCode> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    code: {
      type: String,
      required: true,
      trim: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // MongoDB TTL index to auto-delete expired documents
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

VerificationCodeSchema.index({ userId: 1, code: 1 });

const VerificationCode =
  mongoose.models.VerificationCode ||
  mongoose.model<IVerificationCode>("VerificationCode", VerificationCodeSchema);

export default VerificationCode;
