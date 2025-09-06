import blogApiRequest from "@/apiRequests/blog";

export async function GET() {
  try {
    const { payload } = await blogApiRequest.getBlogs();
    return Response.json(payload);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch blogs";
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
