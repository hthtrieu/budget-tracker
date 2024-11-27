import mongoose, { Schema, model, Document } from "mongoose";

export interface CategoryDocument extends Document {
  _id: string;
  name: string;
  user: mongoose.Types.ObjectId; // Tham chiếu đến User
  transactions: mongoose.Types.ObjectId[];
}

const CategorySchema = new Schema<CategoryDocument>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Tên của model User
      required: true,
    },
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

const Category =
  mongoose.models?.Category ||
  model<CategoryDocument>("Category", CategorySchema);

export default Category;
