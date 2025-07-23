import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { chatId: string } }
) {
  try {
    const apiKey = process.env.HUME_API_KEY;
    if (!apiKey) {
      return new NextResponse("API key not found", { status: 500 });
    }

    // Build URL with query parameters
    const url = new URL(`https://api.hume.ai/v0/evi/chats/${params.chatId}`);
    url.searchParams.append("page_number", "0");
    url.searchParams.append("page_size", "100");
    url.searchParams.append("ascending_order", "true");

    const response = await fetch(url.toString(), {
      headers: {
        "X-Hume-Api-Key": apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch chat events: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Raw chat events:", JSON.stringify(data, null, 2)); // Debug log

    // Check if we have events in the response
    if (!data.events && data.events_page) {
      data.events = data.events_page;
    }

    // Map the response to include required fields and filter out SYSTEM_PROMPT events
    const events = (data.events || [])
      .filter((event: any) => event.type !== "SYSTEM_PROMPT") // Filter out SYSTEM_PROMPT events
      .map((event: any) => {
        // Log each event for debugging
        console.log("Processing event:", event);

        // Parse timestamp from Unix timestamp (milliseconds) if it's a number
        let timestamp = event.timestamp;
        if (typeof timestamp === 'number') {
          timestamp = new Date(timestamp).toISOString();
        }

        return {
          id: event.id || `event-${Math.random()}`,
          type: event.type || "UNKNOWN",
          timestamp: timestamp || event.created_at || new Date().toISOString(),
          message_text: event.message_text || event.text || event.content || "",
          role: event.role || event.speaker || event.source || ""
        };
      });

    console.log("Processed events:", events); // Debug log
    return NextResponse.json({ events });
  } catch (error) {
    console.error("Failed to fetch chat events:", error);
    return new NextResponse("Failed to fetch chat events", { status: 500 });
  }
} 