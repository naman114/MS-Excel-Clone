import { Document, Schema, Types, model } from "mongoose";

// Create the interface
export interface IBook extends Document {
  bookName: string;
  bookData: string;
  user: Types.ObjectId;
}

// Create the schema
const BookSchema = new Schema<IBook>({
  bookName: {
    type: String,
    required: true,
    default: "Untitled Book",
  },
  bookData: {
    type: String,
    required: true,
    default: JSON.stringify({
      "Sheet 1": {},
    }),
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// Create and export book model
export const BookModel = model<IBook>("Book", BookSchema);
