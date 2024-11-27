import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Category from "@/models/Category";
import Transaction from "@/models/Transaction";
export async function POST(request: Request) {
  try {
    const {
      userId,
      categoryId,
      transactionDate,
      transactionType,
      actualAmount,
      estimatedAmount,
    } = await request.json();

    if (!userId || !categoryId) {
      return NextResponse.json(
        { message: "Missing userId or categoryId" },
        { status: 400 }
      );
    }

    await connectDB();

    // Tạo transaction mới
    const transaction = await Transaction.create({
      user: userId,
      category: categoryId,
      transactionType: transactionType,
      transactionDate: transactionDate,
      actualAmount: actualAmount,
      estimatedAmount: estimatedAmount,
    });

    await User.findByIdAndUpdate(userId, {
      $push: { transaction: transaction._id },
    });
    await Category.findByIdAndUpdate(categoryId, {
      $push: { transaction: transaction._id },
    });

    return NextResponse.json(
      { message: "Create new transaction success", transaction },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to create category" },
      { status: 500 }
    );
  }
}
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url); // Lấy searchParams từ URL

  const session = await getServerSession();
  if (!session) {
    return new NextResponse(null, { status: 401 });
  }

  const month = Number(searchParams.get("month") || "0");
  const year = Number(searchParams.get("year") || new Date().getFullYear());
  const transactionType = searchParams.get("transactionType");

  try {
    await connectDB();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Tạo bộ lọc thời gian
    const dateFilter: any = {};
    if (year) {
      const startOfYear = new Date(year, 0, 1); // Ngày đầu năm
      const endOfYear = new Date(year + 1, 0, 1); // Ngày đầu năm tiếp theo
      dateFilter.$gte = startOfYear;
      dateFilter.$lt = endOfYear;

      if (month > 0) {
        const startOfMonth = new Date(year, month - 1, 1); // Ngày đầu tháng
        const endOfMonth = new Date(year, month, 1); // Ngày đầu tháng kế tiếp
        dateFilter.$gte = startOfMonth;
        dateFilter.$lt = endOfMonth;
      }
    }
    // Tạo query lọc
    const query: any = {
      user: user.id,
      transactionDate: dateFilter, // Lọc theo ngày
    };

    if (transactionType) {
      query.transactionType = transactionType; // Lọc theo loại giao dịch nếu có
    }

    // Tìm transactions
    const transactions = await Transaction.find(query)
      .sort({ transactionDate: -1 })
      .populate("category");

    return NextResponse.json({
      success: true,
      data: transactions,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url); // Lấy searchParams từ URL
    const transactionId = searchParams.get("id");

    if (!transactionId) {
      return NextResponse.json(
        { message: "Transaction ID is required" },
        { status: 400 }
      );
    }

    // Kết nối tới database
    await connectDB();

    // Lấy session người dùng
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Xác định người dùng hiện tại
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Tìm transaction
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return NextResponse.json(
        { message: "Transaction not found" },
        { status: 404 }
      );
    }

    // Kiểm tra quyền sở hữu giao dịch
    if (transaction.user.toString() !== user._id.toString()) {
      return NextResponse.json(
        { message: "You are not authorized to delete this transaction" },
        { status: 403 }
      );
    }

    // Xóa transaction
    await Transaction.findByIdAndDelete(transactionId);

    // Xóa transaction ID khỏi mảng transaction trong User và Category
    await User.findByIdAndUpdate(user._id, {
      $pull: { transaction: transactionId },
    });

    await Category.findByIdAndUpdate(transaction.category, {
      $pull: { transaction: transactionId },
    });

    return NextResponse.json(
      { message: "Transaction deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to delete transaction" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const {
      transactionId,
      categoryId,
      transactionDate,
      transactionType,
      actualAmount,
      estimatedAmount,
    } = await request.json();

    if (!transactionId) {
      return NextResponse.json(
        { message: "Transaction ID is required" },
        { status: 400 }
      );
    }

    if (
      actualAmount !== undefined &&
      (isNaN(Number(actualAmount)) || actualAmount < 0)
    ) {
      return NextResponse.json(
        { message: "Invalid actualAmount" },
        { status: 400 }
      );
    }

    if (
      estimatedAmount !== undefined &&
      (isNaN(Number(estimatedAmount)) || estimatedAmount < 0)
    ) {
      return NextResponse.json(
        { message: "Invalid estimatedAmount" },
        { status: 400 }
      );
    }

    await connectDB();

    // Lấy session người dùng
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Xác định người dùng hiện tại
    const user = await User.findOne({ email: session.user.email }).select(
      "_id"
    );
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Tìm transaction
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return NextResponse.json(
        { message: "Transaction not found" },
        { status: 404 }
      );
    }

    // Kiểm tra quyền sở hữu giao dịch
    if (transaction.user.toString() !== user._id.toString()) {
      return NextResponse.json(
        { message: "You are not authorized to update this transaction" },
        { status: 403 }
      );
    }

    // Cập nhật các trường
    transaction.category = categoryId || transaction.category;
    transaction.transactionDate =
      transactionDate || transaction.transactionDate;
    transaction.transactionType =
      transactionType || transaction.transactionType;
    transaction.actualAmount = actualAmount ?? transaction.actualAmount;
    transaction.estimatedAmount =
      estimatedAmount ?? transaction.estimatedAmount;

    // Nếu categoryId thay đổi, cập nhật danh mục liên quan
    if (categoryId && categoryId !== transaction.category.toString()) {
      // Xóa transaction khỏi danh mục cũ nếu tồn tại
      if (transaction.category) {
        await Category.findByIdAndUpdate(transaction.category, {
          $pull: { transaction: transaction._id },
        });
      }

      // Thêm transaction vào danh mục mới
      await Category.findByIdAndUpdate(categoryId, {
        $push: { transaction: transaction._id },
      });

      transaction.category = categoryId;
    }

    // Lưu thay đổi
    await transaction.save();

    return NextResponse.json(
      { message: "Transaction updated successfully", transaction },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in updating transaction:", error); // Thêm log lỗi để hỗ trợ gỡ lỗi
    return NextResponse.json(
      { message: error.message || "Failed to update transaction" },
      { status: 500 }
    );
  }
}
