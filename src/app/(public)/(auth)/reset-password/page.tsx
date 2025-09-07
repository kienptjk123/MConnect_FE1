import ResetPasswordForm from "@/app/(public)/(auth)/reset-password/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          RESET PASSWORD
        </h1>
        <nav className="text-sm text-gray-600">
          <span>Home</span> /{" "}
          <span className="text-gray-800">Reset Password</span>
        </nav>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          RESET PASSWORD
        </h2>
        <ResetPasswordForm />
      </div>
    </div>
  );
}
