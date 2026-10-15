import mongoose, { Schema, Document } from "mongoose";

export interface IFeedbackRequest extends Document {
  ownerId: mongoose.Types.ObjectId;
  title: string;
  question: string;
  category: string;
  slug: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackRequestSchema: Schema<IFeedbackRequest> = new Schema(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    question: {
      type: String,
      required: [true, "Question prompt is required"],
      trim: true,
      maxlength: [300, "Question prompt cannot exceed 300 characters"],
    },
    category: {
      type: String,
      default: "General",
      enum: ["General", "Career", "Portfolio", "Personality", "Communication", "Work/Projects", "Other"],
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

FeedbackRequestSchema.index({ ownerId: 1, slug: 1 });

const FeedbackRequest =
  mongoose.models.FeedbackRequest ||
  mongoose.model<IFeedbackRequest>("FeedbackRequest", FeedbackRequestSchema);

export default FeedbackRequest;
