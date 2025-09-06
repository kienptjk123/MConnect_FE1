"use client";
import { useAppContext } from "@/components/app-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface UserInfo {
  role: "MENTOR" | "MENTEE" | "STAFF" | "ADMIN";
  email: string;
}

export default function DashboardPage() {
  const { role, setRole } = useAppContext();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    console.log("🏠 Dashboard mounted, checking authentication...");

    // Check if user is logged in
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      const userRole = localStorage.getItem("userRole") as
        | "MENTOR"
        | "MENTEE"
        | "STAFF"
        | "ADMIN";
      const userEmail = localStorage.getItem("userEmail");

      if (!token) {
        console.log("🔒 No access token found, redirecting to login...");
        router.push("/login");
        return;
      }

      if (userRole && userEmail) {
        const userData = {
          role: userRole,
          email: userEmail,
        };
        setUserInfo(userData);
        setRole(userRole);
        console.log("👤 User info loaded:", userData);
      }
    }
  }, [router, setRole]);

  const handleLogout = () => {
    console.log("🚪 Logging out user...");

    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userEmail");
      console.log("🧹 Cleared all user data from localStorage");
    }

    setRole(undefined);
    setUserInfo(null);
    router.push("/login");
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "text-red-600 bg-red-50 border border-red-200";
      case "STAFF":
        return "text-purple-600 bg-purple-50 border border-purple-200";
      case "MENTOR":
        return "text-blue-600 bg-blue-50 border border-blue-200";
      case "MENTEE":
        return "text-green-600 bg-green-50 border border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border border-gray-200";
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "Quản trị viên hệ thống";
      case "STAFF":
        return "Nhân viên";
      case "MENTOR":
        return "Người hướng dẫn";
      case "MENTEE":
        return "Người được hướng dẫn";
      default:
        return "Không xác định";
    }
  };

  if (!role || !userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div>Đang tải thông tin người dùng...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="text-3xl">Dashboard</CardTitle>
            <p className="opacity-90">
              Chào mừng bạn đến với hệ thống MConnect
            </p>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            {/* User Info Section */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  Thông tin cá nhân
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Email
                    </label>
                    <p className="text-lg text-gray-900">{userInfo.email}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Trạng thái đăng nhập
                    </label>
                    <span className="inline-block px-3 py-1 rounded-full text-sm bg-green-100 text-green-700 border border-green-200">
                      Đã đăng nhập
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  Vai trò & Quyền hạn
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Vai trò
                    </label>
                    <span
                      className={`inline-block px-4 py-2 rounded-lg text-lg font-semibold ${getRoleColor(
                        role
                      )}`}
                    >
                      {role}
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Mô tả
                    </label>
                    <p className="text-gray-700">{getRoleDescription(role)}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Thời gian đăng nhập
                    </label>
                    <p className="text-gray-700">
                      {new Date().toLocaleDateString("vi-VN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Section */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  Đăng xuất
                </Button>

                <Button
                  onClick={() => {
                    console.group("📊 USER INFO DEBUG");
                    console.log("Role:", role);
                    console.log("Email:", userInfo.email);
                    console.log("Tokens:", {
                      accessToken:
                        localStorage.getItem("accessToken")?.substring(0, 20) +
                        "...",
                      refreshToken:
                        localStorage.getItem("refreshToken")?.substring(0, 20) +
                        "...",
                    });
                    console.groupEnd();
                  }}
                  variant="outline"
                  className="text-blue-600 border-blue-600 hover:bg-blue-50"
                >
                  Debug Info (Console)
                </Button>
              </div>
            </div>

            {/* Test Accounts Info */}
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-4">
                Tài khoản test có sẵn:
              </h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium text-red-600">ADMIN:</div>
                  <div className="text-gray-600">
                    sandilove59@gmail.com - 123Kien@@
                  </div>
                </div>
                <div>
                  <div className="font-medium text-purple-600">STAFF:</div>
                  <div className="text-gray-600">
                    staff@gmail.com - 123Kien@@
                  </div>
                </div>
                <div>
                  <div className="font-medium text-blue-600">MENTOR:</div>
                  <div className="text-gray-600">
                    mentor@gmail.com - 123Kien@@
                  </div>
                </div>
                <div>
                  <div className="font-medium text-green-600">MENTEE:</div>
                  <div className="text-gray-600">
                    locleabcd@gmail.com - 123Kien@@
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
