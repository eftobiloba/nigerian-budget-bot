"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import ChatMessage from "@/components/chat-message"
import FileUploadArea from "@/components/file-upload-area"
import { Spinner } from "@/components/ui/spinner"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm the Nigerian Budget Bot. I can help you find accurate information about Nigerian budgets, spending allocations, and financial data from the Nigerian open system. You can ask me questions or upload budget documents to analyze.",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFileName(file.name)
      setShowUploadModal(false)
      console.log("[v0] File uploaded for knowledge base:", file.name)

      const confirmationMessage: Message = {
        id: Math.random().toString(),
        role: "assistant",
        content: `I've successfully added "${file.name}" to my knowledge base. I'll use this document to provide more accurate information about Nigerian budgets.`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, confirmationMessage])
    }
  }

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Math.random().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          uploadedFile: uploadedFileName,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: Math.random().toString(),
        role: "assistant",
        content: data.content,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("[v0] Error:", error)
      const errorMessage: Message = {
        id: Math.random().toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/20 dark:from-background dark:to-muted/10 flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">₦</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Nigerian Budget Bot</h1>
                <p className="text-sm text-muted-foreground">Accurate budget information at your fingertips</p>
              </div>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="p-2 rounded-lg hover:bg-accent/10 transition-colors text-muted-foreground hover:text-accent"
              aria-label="Upload budget document"
              title="Upload budget document"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Chat Messages */}
          <div className="space-y-6 mb-8">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-center items-center py-8">
                <div className="flex items-center gap-2">
                  <Spinner />
                  <span className="text-muted-foreground">Analyzing budget data...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </main>

      <div className="border-t border-border bg-background sticky bottom-0 z-10">
        <div className="max-w-4xl mx-auto px-4 w-full">
          <Card className="border-none shadow-none py-0">
            <div className="p-3">
              <label htmlFor="message-input" className="sr-only">
                Message input
              </label>

              <div className="relative">
                {/* INPUT */}
                <Input
                  id="message-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      sendMessage()
                    }
                  }}
                  placeholder="Ask me about Nigerian budgets, spending, or upload documents..."
                  className="pr-12 bg-input border-border text-foreground placeholder:text-muted-foreground h-15"
                  disabled={isLoading}
                />

                {/* SEND ICON BUTTON (inside input) */}
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Send message"
                >
                  {/* Paper plane icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 19l9-7-9-7v14z"
                    />
                  </svg>
                </button>
              </div>

              {/* FILE UPLOAD INPUT */}
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,.xlsx,.csv"
                aria-label="Upload budget document"
              />
            </div>
          </Card>
        </div>
      </div>


      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="border-border shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Upload Budget Document</h2>
              <FileUploadArea
                uploadedFileName={uploadedFileName}
                onFileUpload={handleFileUpload}
                fileInputRef={fileInputRef}
              />
              <Button onClick={() => setShowUploadModal(false)} variant="outline" className="w-full mt-4">
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
