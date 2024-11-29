import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

// Mở rộng interface Session để thêm trường id vào user
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      isNewUser?: boolean;
    };
  }
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/auth/signin",
    newUser: "/start", // Đảm bảo trang `/start` tồn tại
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    // callback signIn: xác thực người dùng qua Google
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const { name, email } = user;

        if (!email) {
          console.error("Email is missing in user object");
          return false;
        }

        try {
          await connectDB();
          const userExists = await User.findOne({ email });

          if (!userExists) {
            await connectDB();
            await User.create({ name, email });
          }
          return true;
        } catch (error) {
          console.error("Error during sign-in:", error);
          return false;
        }
      }
      return false;
    },

    // async jwt({ token, user }) {
    //   if (user) {
    //     await connectDB();
    //     const dbUser = await User.findOne({ email: user.email });
    //     if (dbUser) {
    //       token.id = dbUser._id.toString(); // Lưu id dưới dạng string
    //     }
    //   }
    //   return token;
    // },

    async jwt({ token, user }) {
      if (user) {
        await connectDB();
        const dbUser = await User.findOne({ email: user.email });
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.isNewUser = dbUser.isNewUser || false; // Thêm flag isNewUser
        }
      }
      return token;
    },

    // callback session: Gán id từ token vào session
    // async session({ session }) {
    //   const userExists = await User.findOne({ email: session.user.email });
    //   session.user.id = userExists.id;
    //   return session;
    // },
    async session({ session }) {
      const userExists = await User.findOne({ email: session.user.email });
      session.user.id = userExists.id;
      session.user.isNewUser = userExists ? false : true;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET as string,
};
