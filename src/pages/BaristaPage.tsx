import { useEffect, useRef, useState } from "react";
import {
  Coffee,
  Loader2,
  MessagesSquare,
  Send,
  Trash2,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/useToast";
import { useAskMutation } from "@/store/gen/agent";
import { cn } from "@/lib/utils";

type Role = "user" | "assistant";

interface ChatMessage {
  id: string;
  role: Role;
  content: string;
}

const SUGGESTIONS = [
  "What's on the menu today?",
  "Recommend me a drink",
];

function AssistantAvatar() {
  return (
    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
      <Coffee className="size-4" />
    </span>
  );
}

function UserAvatar() {
  return (
    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground">
      <User className="size-4" />
    </span>
  );
}

function MessageRow({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex items-end gap-2.5",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      {!isUser && <AssistantAvatar />}
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          isUser
            ? "rounded-br-md bg-primary text-primary-foreground"
            : "rounded-bl-md bg-muted text-foreground",
        )}
      >
        <p className="whitespace-pre-wrap wrap-break-word">{message.content}</p>
      </div>
      {isUser && <UserAvatar />}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2.5">
      <AssistantAvatar />
      <div className="rounded-2xl rounded-bl-md bg-muted px-4 py-3.5">
        <span className="flex gap-1.5">
          <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-300ms]" />
          <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-150ms]" />
          <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground" />
        </span>
      </div>
    </div>
  );
}

export default function BaristaPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [ask, { isLoading }] = useAskMutation();
  const { error: showError } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  const nextId = () => `msg-${++idRef.current}`;

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  const sendPrompt = async (raw: string) => {
    const text = raw.trim();
    if (!text || isLoading) return;

    setMessages((prev) => [
      ...prev,
      { id: nextId(), role: "user", content: text },
    ]);
    setInput("");

    try {
      const reply = await ask({ body: text }).unwrap();
      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: "assistant", content: reply },
      ]);
    } catch (err) {
      console.error("Failed to reach the barista:", err);
      showError(
        "Barista is unavailable",
        "Something went wrong. Please try again.",
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendPrompt(input);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Barista</h1>
          <p className="text-sm text-muted-foreground">
            Chat with our AI barista about the menu, drinks, and more.
          </p>
        {messages.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMessages([])}
            disabled={isLoading}
          >
            <Trash2 />
            Clear chat
          </Button>
        )}
      </div>

      <Card className="flex h-[calc(100svh-20rem)] min-h-96 flex-col gap-0 overflow-hidden p-0">
        <div
          ref={scrollRef}
          className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6"
        >
          {messages.length === 0 && !isLoading ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <span className="grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
                <MessagesSquare className="size-6" />
              </span>
              <div>
                <p className="font-heading text-lg font-medium">
                  Welcome to the coffee bar
                </p>
                <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
                  Ask our barista anything — or start with one of these.
                </p>
              </div>
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <Button
                    key={s}
                    variant="outline"
                    size="sm"
                    onClick={() => void sendPrompt(s)}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((m) => (
                <MessageRow key={m.id} message={m} />
              ))}
              {isLoading && <TypingIndicator />}
            </>
          )}
        </div>

        <div className="flex items-end gap-2 border-t border-border p-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask the barista…"
            rows={1}
            aria-label="Message the barista"
            className="min-h-11 max-h-40 flex-1 resize-none field-sizing-content rounded-lg border border-input bg-transparent px-3 py-2.5 text-sm text-foreground outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          <Button
            onClick={() => void sendPrompt(input)}
            disabled={isLoading || !input.trim()}
            size="icon"
            aria-label="Send message"
            className="size-11"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
          </Button>
        </div>
      </Card>
    </div>
  );
}
