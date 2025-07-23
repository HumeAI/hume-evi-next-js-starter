"use client";

import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import ChatDetails from "./ChatDetails";

interface ChatHistory {
  id: string;
  chat_group_id: string;
  created_at: string;
  duration: number;
  event_count: number;
}

export default function Sidebar() {
  const [chats, setChats] = useState<ChatHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch("/api/chats");
        if (!response.ok) {
          throw new Error(`Failed to fetch chats: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("Chats response:", data); // Debug log
        setChats(data.chats || []);
      } catch (error) {
        console.error("Failed to fetch chats:", error);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchChats();

    // Fetch every 30 seconds
    const interval = setInterval(fetchChats, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "No date";
    try {
      // Try parsing as ISO string first
      let date = parseISO(dateString);
      
      // If invalid, try parsing as Unix timestamp (milliseconds)
      if (isNaN(date.getTime())) {
        const timestamp = parseInt(dateString);
        if (!isNaN(timestamp)) {
          date = new Date(timestamp);
        }
      }

      // If still invalid, return error message
      if (isNaN(date.getTime())) {
        console.error("Invalid date:", dateString);
        return "Invalid date";
      }

      return format(date, "M/d/yyyy, h:mm:ss a");
    } catch (error) {
      console.error("Error formatting date:", dateString, error);
      return "Invalid date";
    }
  };

  return (
    <>
      <aside className="w-64 min-h-screen bg-background border-r border-border overflow-y-auto fixed left-0 top-14 bottom-0 z-10">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Past Conversations</h2>
          {loading ? (
            <p className="text-muted-foreground">Loading conversations...</p>
          ) : chats.length === 0 ? (
            <p className="text-muted-foreground">No conversations yet</p>
          ) : (
            <div className="space-y-2">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className="p-3 rounded-lg border border-border hover:bg-accent cursor-pointer transition-colors"
                  onClick={() => setSelectedChatId(chat.id)}
                >
                  <p className="font-medium truncate text-sm">
                    Conversation {chat.id.slice(-6)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(chat.created_at)}
                  </p>
                  <div className="flex gap-2 mt-1 text-xs text-muted-foreground">
                    <span>{chat.event_count || 0} events</span>
                    <span>•</span>
                    <span>{Math.round(chat.duration || 0)}s</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>

      {selectedChatId && (
        <ChatDetails
          chatId={selectedChatId}
          onClose={() => setSelectedChatId(null)}
        />
      )}
    </>
  );
} 