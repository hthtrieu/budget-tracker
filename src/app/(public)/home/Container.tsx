// app/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SignInButton from "./SignInButton";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-300 to-rose-400 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Quản lý chi tiêu dễ dàng hơn bao giờ hết!
          </h1>
          <p className="text-lg mb-8">
            Theo dõi tài chính cá nhân của bạn với ứng dụng thông minh và dễ sử
            dụng.
          </p>
          <SignInButton />
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-8">
          Tính năng nổi bật
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Theo dõi chi tiêu</CardTitle>
            </CardHeader>
            <CardContent>
              Ghi lại giao dịch và phân loại chi tiêu một cách nhanh chóng.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Phân tích thông minh</CardTitle>
            </CardHeader>
            <CardContent>
              Biểu đồ trực quan giúp bạn hiểu rõ hơn về tình hình tài chính.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Nhắc nhở hóa đơn</CardTitle>
            </CardHeader>
            <CardContent>
              Không bao giờ bỏ lỡ hóa đơn với tính năng nhắc nhở tự động.
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
