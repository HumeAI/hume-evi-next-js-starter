import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.HUME_API_KEY;
    if (!apiKey) {
      return new NextResponse("API key not found", { status: 500 });
    }

    // Build URL with query parameters
    const url = new URL("https://api.hume.ai/v0/evi/chats");
    url.searchParams.append("page_number", "0");
    url.searchParams.append("page_size", "10");
    url.searchParams.append("ascending_order", "false");

    const response = await fetch(url.toString(), {
      headers: {
        "X-Hume-Api-Key": apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch chats: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Raw API response:", JSON.stringify(data, null, 2)); // Debug log

    // Map the response to include required fields
    const chats = (data.chats_page || []).map((chat: any) => {
      // Handle Unix timestamp (in milliseconds)
      let timestamp = chat.start_timestamp;
      if (typeof timestamp === 'number') {
        timestamp = new Date(timestamp).toISOString();
      }

      return {
        id: chat.id,
        chat_group_id: chat.chat_group_id,
        created_at: timestamp || chat.created_at || new Date().toISOString(),
        duration: chat.duration || 0,
        event_count: chat.event_count || 0
      };
    });

    return NextResponse.json({ chats });
  } catch (error) {
    console.error("Failed to fetch chats:", error);
    return new NextResponse("Failed to fetch chats", { status: 500 });
  }
} 