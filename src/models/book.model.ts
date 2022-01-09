import { Document, Schema, Types, model } from "mongoose";

// Create the interface
export interface IBook extends Document {
  bookName: string;
  bookData: string;
  selectedSheet: string;
  totalSheets: number;
  lastAddedSheet: number;
  user: Types.ObjectId;
}

// Create the schema
const BookSchema = new Schema<IBook>(
  {
    bookName: {
      type: String,
      required: true,
      default: "Untitled Book",
    },
    bookData: {
      type: String,
      default: JSON.stringify({
        "Sheet 1": {},
      }),
    },
    selectedSheet: {
      type: String,
      default: "Sheet 1",
    },
    totalSheets: {
      type: Number,
      default: 1,
    },
    lastAddedSheet: {
      type: Number,
      default: 1,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

// Create and export book model
export const BookModel = model<IBook>("Book", BookSchema);
