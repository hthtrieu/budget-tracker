import mongoose, { Schema, model, Document } from "mongoose";

export interface UserDocument extends Document {
  _id: string;
  email: string;
  name: string;
  categories: mongoose.Types.ObjectId[]; // Mảng tham chiếu đến Category
  transactions: mongoose.Types.ObjectId[];
}

const UserSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Email is invalid",
      ],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category", // Tên của model Category
      },
    ],
    transactions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction", // Tên của model Category
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models?.User || model<UserDocument>("User", UserSchema);

export default User;
