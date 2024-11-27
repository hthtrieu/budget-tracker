import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function POST(request: Request) {
  try {
    const { name, email } = await request.json();
    await connectDB();
    await User.create({ name, email });
    return NextResponse.json({ message: "User Registered" }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to register user" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return new NextResponse(null, { status: 401 }); // Unauthorized
  }

  try {
    await connectDB();
    const users = await User.find();
    return NextResponse.json(
      {
        success: true,
        data: users,
        message: "Fetched users successfully",
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
