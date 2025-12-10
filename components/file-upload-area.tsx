"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FileUploadAreaProps {
  uploadedFileName: string | null
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  fileInputRef: React.RefObject<HTMLInputElement>
}

export default function FileUploadArea({ uploadedFileName, onFileUpload, fileInputRef }: FileUploadAreaProps) {
  return (
    <Card
      className={cn(
        "border-2 border-dashed border-border/50 bg-card/30 p-6 cursor-pointer transition-all",
        "hover:border-accent hover:bg-accent/5",
      )}
    >
      <div className="flex flex-col items-center justify-center gap-3 text-center">
        <div className="text-4xl">📄</div>
        <div>
          <p className="font-semibold text-foreground">Upload Budget Documents</p>
          <p className="text-sm text-muted-foreground">
            Add PDFs, spreadsheets, or documents to enhance my knowledge base
          </p>
        </div>
        {uploadedFileName && (
          <div className="mt-2 p-2 bg-accent/10 border border-accent/30 rounded-lg text-sm text-accent-foreground">
            ✓ Loaded: {uploadedFileName}
          </div>
        )}
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          className="mt-2 border-accent/50 hover:bg-accent/10"
        >
          Choose File
        </Button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        onChange={onFileUpload}
        className="hidden"
        accept=".pdf,.doc,.docx,.txt,.xlsx,.csv"
        aria-label="Upload budget document"
      />
    </Card>
  )
}
