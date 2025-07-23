"use client";

import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { X } from "lucide-react";

interface ChatEvent {
  id: string;
  type: string;
  timestamp: string;
  message_text?: string;
  role?: string;
}

interface ChatDetailsProps {
  chatId: string | null;
  onClose: () => void;
}

export default function ChatDetails({ chatId, onClose }: ChatDetailsProps) {
  const [events, setEvents] = useState<ChatEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChatDetails = async () => {
      if (!chatId) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/chats/${chatId}/events`);
        if (!response.ok) {
          throw new Error(`Failed to fetch chat details: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("Chat details:", data);
        
        if (!data.events || !Array.isArray(data.events)) {
          console.error("Invalid events data:", data);
          throw new Error("Invalid response format");
        }

        setEvents(data.events);
      } catch (error) {
        console.error("Failed to fetch chat details:", error);
        setError(error instanceof Error ? error.message : "Failed to fetch chat details");
      } finally {
        setLoading(false);
      }
    };

    fetchChatDetails();
  }, [chatId]);

  if (!chatId) return null;

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

  const getEventColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'user_message':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'assistant_message':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'tool_call_message':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-accent text-accent-foreground';
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
      <div className="fixed inset-4 bg-background border border-border rounded-lg shadow-lg overflow-hidden z-50 md:inset-x-1/4 md:inset-y-16">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold">Chat Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-accent rounded-full transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <p className="text-muted-foreground">Loading chat details...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : events.length === 0 ? (
              <p className="text-muted-foreground">No events found</p>
            ) : (
              <div className="space-y-4">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="p-3 rounded-lg border border-border hover:bg-accent/5 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className={`text-xs font-medium px-2 py-1 rounded ${getEventColor(event.type)}`}>
                        {event.type}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(event.timestamp)}
                      </span>
                    </div>
                    {event.message_text && (
                      <p className="text-sm whitespace-pre-wrap">
                        {event.role && <strong>{event.role}: </strong>}
                        {event.message_text}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 