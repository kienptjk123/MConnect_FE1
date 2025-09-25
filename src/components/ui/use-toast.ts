import { toast as sonnerToast } from "sonner";

export function toast({
  title,
  description,
  variant,
  duration,
}: {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
}) {
  if (variant === "destructive") {
    sonnerToast.error(title || description || "Có lỗi xảy ra", {
      duration: duration || 5000,
    });
  } else {
    sonnerToast.success(description || title || "Thành công", {
      duration: duration || 3000,
    });
  }
}
