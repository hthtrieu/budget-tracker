import Header from "@/components/common/header/Header";
import Footer from "@/components/common/footer/Footer";
import MaxWidthWrapper from "@/components/common/MaxWidthWrapper";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="bg-gradient-to-br from-pink-50 via-pink-100 to-pink-300">
      <div className="flex flex-col">
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
