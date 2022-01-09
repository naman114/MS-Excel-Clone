import { Document, Schema, Types, model } from "mongoose";

// user interface
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
}

// user schema
const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// create and export post model
export const UserModel = model<IUser>("User", UserSchema);
