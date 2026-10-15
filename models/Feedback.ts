import mongoose, { Schema, Document } from "mongoose";

export interface IFeedback extends Document {
  recipientId: mongoose.Types.ObjectId;
  requestId?: mongoose.Types.ObjectId;
  message: string;
  category: string;
  isRead: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackSchema: Schema<IFeedback> = new Schema(
  {
    recipientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    requestId: {
      type: Schema.Types.ObjectId,
      ref: "FeedbackRequest",
      index: true,
      default: null,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      minlength: [10, "Feedback must be at least 10 characters"],
      maxlength: [1500, "Feedback cannot exceed 1500 characters"],
    },
    category: {
      type: String,
      default: "General",
      index: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

FeedbackSchema.index({ recipientId: 1, createdAt: -1 });

const Feedback =
  mongoose.models.Feedback || mongoose.model<IFeedback>("Feedback", FeedbackSchema);

export default Feedback;
