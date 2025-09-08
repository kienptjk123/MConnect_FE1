import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  try {
    // Clear cookies
    cookieStore.set("accessToken", "", {
      path: "/",
      httpOnly: true,
      maxAge: 0,
    });

    cookieStore.set("refreshToken", "", {
      path: "/",
      httpOnly: true,
      maxAge: 0,
    });

    cookieStore.set("role", "", {
      path: "/",
      httpOnly: true,
      maxAge: 0,
    });

    return Response.json(
      { message: "Logged out successfully" },
      {
        status: 200,
      }
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Logout failed";
    return Response.json(
      {
        message: errorMessage,
      },
      {
        status: 500,
      }
    );
  }
}
