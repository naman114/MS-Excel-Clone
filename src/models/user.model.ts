import { Document, Schema, Types, model } from "mongoose";

// user interface
export interface IUser extends Document {
  email: string;
  password: string;
}

// user schema
const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// create and export post model
export const UserModel = model<IUser>("User", UserSchema);
