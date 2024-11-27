import Header from "@/components/common/header/Header";
import Footer from "@/components/common/footer/Footer";
import MaxWidthWrapper from "@/components/common/MaxWidthWrapper";
// import { redirect } from "next/navigation";
// import { getServerSession } from "next-auth";
const layout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  // const session = await getServerSession();
  // if (!session || !session.user) {
  //   redirect("/api/auth/signin");
  // }
  return (
    <div className="bg-gradient-to-br from-pink-50 via-pink-100 to-pink-300">
      <div className="flex flex-col  space-y-4 overflow-y-auto">
        <Header />
        <main className="min-h-screen">
          <MaxWidthWrapper className="">{children}</MaxWidthWrapper>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default layout;
