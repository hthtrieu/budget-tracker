import { NextResponse } from "next/server";
import Category from "@/models/Category";
import Transaction from "@/models/Transaction";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";
import { getServerSession } from "next-auth";

function parseDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split("/").map(Number);
  if (!day || !month || !year)
    throw new Error(`Invalid date format: ${dateStr}`);
  return new Date(`${year}-${month}-${day}`);
}

type DataItem = {
  "Ngày tháng năm": string;
  "Nội dung": string;
  "Dự kiến": string;
  "Thực tế": string;
  Loại: string;
};

type RequestBody = {
  data: DataItem[];
};

export async function POST(request: Request) {
  await connectDB();
  const session = await getServerSession();
  if (!session) {
    return new NextResponse(null, { status: 401 });
  }

  try {
    const { data } = (await request.json()) as RequestBody;

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      throw new Error("User not found");
    }

    for (const item of data) {
      const cleanedItem = Object.fromEntries(
        Object.entries(item)
          .filter(
            ([key, value]) =>
              typeof key === "string" &&
              typeof value === "string" &&
              key.trim() !== "" &&
              value !== "" &&
              key !== "\r"
          )
          .map(([key, value]) => [key.trim(), value])
      );

      const {
        "Ngày tháng năm": date = "",
        "Nội dung": content = "",
        "Dự kiến": estimatedAmount = "",
        "Thực tế": actualAmount = "",
        Loại: type = "",
      } = cleanedItem;

      if (!date || !content || !estimatedAmount || !actualAmount || !type) {
        throw new Error("Missing required fields in the imported data.");
      }

      const parsedDate = parseDate(date);
      const estimated = parseFloat(estimatedAmount);
      const actual = parseFloat(actualAmount);

      if (isNaN(estimated) || isNaN(actual)) {
        throw new Error(`Invalid number format in estimated or actual amount.`);
      }

      let category = await Category.findOne({ name: content, user: user._id });
      if (!category) {
        category = new Category({
          name: content,
          user: user._id,
        });
        const savedCategory = await category.save();
        user.categories.push(savedCategory._id);
        await user.save();
      }

      const transaction = new Transaction({
        user: user._id,
        category: category._id,
        transactionDate: parsedDate,
        estimatedAmount: estimated,
        actualAmount: actual,
        transactionType: type === "Thu" ? "Thu" : "Chi",
      });

      const savedTransaction = await transaction.save();
      category.transactions.push(savedTransaction._id);
      await category.save();

      user.transactions.push(savedTransaction._id);
      await user.save();
    }

    return NextResponse.json(
      { message: "Import CSV Data success" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to import CSV data" },
      { status: 500 }
    );
  }
}
