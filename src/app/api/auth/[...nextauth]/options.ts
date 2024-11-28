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
    };
  }
}

export const authOptions: NextAuthOptions = {
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
            // const response = await fetch("http://localhost:3000/api/user", {
            //   method: "POST",
            //   headers: {
            //     "Content-Type": "application/json",
            //   },
            //   body: JSON.stringify({ name, email }),
            // });
            await connectDB();
            await User.create({ name, email });

            // if (!response.ok) {
            //   console.error(`Failed to create user: ${response.statusText}`);
            //   return false;
            // }
          }
          return true;
        } catch (error) {
          console.error("Error during sign-in:", error);
          return false;
        }
      }
      return false;
    },

    async jwt({ token, user }) {
      if (user) {
        await connectDB();
        const dbUser = await User.findOne({ email: user.email });
        if (dbUser) {
          token.id = dbUser._id.toString(); // Lưu id dưới dạng string
        }
      }
      return token;
    },

    // callback session: Gán id từ token vào session
    async session({ session }) {
      const userExists = await User.findOne({ email: session.user.email });
      session.user.id = userExists.id;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET as string,
};
