import mongoose, { Schema, model, Document } from "mongoose";
import { Types } from "mongoose";

interface CategoryPopulated {
  _id: Types.ObjectId | string;
  name: string;
}
import { CategoryDocument } from "./Category";
export interface TransactionDocument extends Document {
  _id: string;
  user: Types.ObjectId;
  category: CategoryDocument | CategoryPopulated; // Cho phép kiểu dữ liệu sau populate
  transactionDate: Date;
  actualAmount: string;
  estimatedAmount: string;
  transactionType: "Thu" | "Chi";
}

const TransactionSchema = new Schema<TransactionDocument>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Tên của model User
      required: [true, "Người dùng là bắt buộc"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", // Tên của model Category
      required: [true, "Danh mục là bắt buộc"],
    },
    transactionDate: {
      type: Date, // Sử dụng kiểu Date để làm việc với thời gian
      required: [true, "Ngày giao dịch là bắt buộc"],
    },
    actualAmount: {
      type: String,
      required: [true, "Số tiền thực tế là bắt buộc"],
    },
    estimatedAmount: {
      type: String,
      required: [true, "Số tiền dự kiến là bắt buộc"],
    },
    transactionType: {
      type: String,
      enum: ["Thu", "Chi"], // Chỉ chấp nhận "Thu" hoặc "Chi"
      required: [true, "Loại giao dịch là bắt buộc"],
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

// Kiểm tra và tránh việc ghi đè model nếu đã tồn tại
const Transaction =
  mongoose.models.Transaction ||
  model<TransactionDocument>("Transaction", TransactionSchema);

export default Transaction;
