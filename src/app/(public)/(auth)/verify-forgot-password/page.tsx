import VerifyForgotPasswordForm from "@/app/(public)/(auth)/verify-forgot-password/verify-forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          FORGOT PASSWORD
        </h1>
        <nav className="text-sm text-gray-600">
          <span>Home</span> /{" "}
          <span className="text-gray-800">Forgot Password</span>
        </nav>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          FORGOT PASSWORD
        </h2>

        <VerifyForgotPasswordForm />
      </div>
    </div>
  );
}
