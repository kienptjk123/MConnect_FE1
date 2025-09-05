const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

export async function getTags(): Promise<any> {
  try {
    const response = await fetch(`${API_ENDPOINT}/tags`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching tags:", error);
    throw error;
  }
}
