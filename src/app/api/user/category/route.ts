import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Category from "@/models/Category";
import Transaction from "@/models/Transaction";

export async function POST(request: Request) {
  try {
    const { userId, categoryName } = await request.json();

    // Kiểm tra thông tin hợp lệ
    if (!userId || !categoryName) {
      return NextResponse.json(
        { message: "Missing userId or categoryName" },
        { status: 400 }
      );
    }

    await connectDB();

    // Tạo category mới
    const category = await Category.create({
      name: categoryName,
      user: userId,
    });

    // Cập nhật danh mục vào user
    await User.findByIdAndUpdate(userId, {
      $push: { categories: category._id },
    });

    return NextResponse.json(
      { message: "Create new Category success", category },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to create category" },
      { status: 500 }
    );
  }
}
export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return new NextResponse(null, { status: 401 });
  }

  try {
    await connectDB();
    const user = await User.findOne({ email: session.user.email }).populate(
      "categories"
    );

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        data: user.categories, // Trả về danh sách categories
        message: "Fetched categories successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { categoryId, name } = await request.json();

    if (!categoryId) {
      return NextResponse.json(
        { message: "Category ID is required" },
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
    const category = await Category.findById(categoryId);
    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    // Kiểm tra quyền sở hữu giao dịch
    if (category.user.toString() !== user._id.toString()) {
      return NextResponse.json(
        { message: "You are not authorized to update this category" },
        { status: 403 }
      );
    }

    // Cập nhật các trường
    category.name = name || category.name;
    // Lưu thay đổi
    await category.save();

    return NextResponse.json(
      { message: "Category updated successfully", category },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in updating Category:", error);
    return NextResponse.json(
      { message: error.message || "Failed to update Category" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url); // Lấy searchParams từ URL
    const categoryId = searchParams.get("id");

    if (!categoryId) {
      return NextResponse.json(
        { message: "Category ID is required" },
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
    const category = await Category.findById(categoryId);
    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    // Kiểm tra quyền sở hữu giao dịch
    if (category.user.toString() !== user._id.toString()) {
      return NextResponse.json(
        { message: "You are not authorized to delete this category" },
        { status: 403 }
      );
    }

    // Xóa transaction
    await Category.findByIdAndDelete(categoryId);

    // Xóa transaction ID khỏi mảng transaction trong User và Category
    await User.findByIdAndUpdate(user._id, {
      $pull: { category: categoryId },
    });

    await Transaction.findByIdAndUpdate(category, {
      $pull: { category: categoryId },
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
