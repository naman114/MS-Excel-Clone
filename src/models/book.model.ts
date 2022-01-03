import { Document, Schema, model } from "mongoose";

// Create the interface
export interface IBook extends Document {
  bookName: string;
  bookData: string;
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
});

// Create and export book model
export const BookModel = model<IBook>("Book", BookSchema);
