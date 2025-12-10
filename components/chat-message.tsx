import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface ChatMessageProps {
  message: {
    role: "user" | "assistant"
    content: string
    timestamp: Date
  }
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-2xl rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "bg-primary text-primary-foreground rounded-br-none"
            : "bg-card border border-border/50 text-foreground rounded-bl-none shadow-sm"
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          // Wrap ReactMarkdown in a div with prose classes (react-markdown v8 removed className prop)
          <div className="prose prose-sm prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              // Optionally, add `components` here to style certain markdown elements
              components={{
                table: ({ node, ...props }) => (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm" {...props} />
                  </div>
                ),
                th: ({ node, ...props }) => <th className="px-3 py-2 text-left font-medium" {...props} />,
                td: ({ node, ...props }) => <td className="px-3 py-2 align-top" {...props} />,
                code: ({ node, inline, className, children, ...props }) =>
                  inline ? (
                    <code className="rounded px-1 py-0.5 bg-muted text-sm" {...props}>
                      {children}
                    </code>
                  ) : (
                    <pre className="rounded bg-muted p-3 overflow-x-auto text-xs" {...props}>
                      <code>{children}</code>
                    </pre>
                  ),
                a: ({ node, ...props }) => <a className="underline hover:text-accent" {...props} />,
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}

        {/* Timestamp + Info Icon */}
        <div
          className={cn(
            "text-xs mt-2 flex items-center gap-1",
            isUser ? "text-primary-foreground/70" : "text-muted-foreground",
          )}
        >
          <span>
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>

          {!isUser && (
            <div className="group relative cursor-help">
              <svg
                className="w-3.5 h-3.5 text-muted-foreground hover:text-accent transition-colors"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>

              <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground w-48 whitespace-normal opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg z-50">
                Data sourced from the Nigerian open system. Always verify critical financial information.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
