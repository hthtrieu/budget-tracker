import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Category from "@/models/Category";

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
