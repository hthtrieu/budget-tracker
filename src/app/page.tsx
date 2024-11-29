import Header from "../components/common/header/Header";
import Footer from "@/components/common/footer/Footer";
import MaxWidthWrapper from "@/components/common/MaxWidthWrapper";
import HomeContainer from "./(public)/home/page";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
export default async function Page() {
  const session = await getServerSession();
  console.log("session: ", session);
  if (session && !session.user?.isNewUser) {
    redirect("/overview");
  } else if (session?.user?.isNewUser) {
    redirect("/start");
  }
  return (
    <div className="bg-gradient-to-br from-pink-50 via-pink-100 to-pink-300">
      <div className="flex flex-col overflow-y-auto space-y-4">
        <Header />
        <main className="min-h-screen ">
          <MaxWidthWrapper>
            <HomeContainer />
          </MaxWidthWrapper>
        </main>
        <Footer />
      </div>
    </div>
  );
}
