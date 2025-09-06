import tagApiRequest from "@/apiRequests/tag";

export async function GET() {
  try {
    const { payload } = await tagApiRequest.getTags();
    return Response.json(payload);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch tags";
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
