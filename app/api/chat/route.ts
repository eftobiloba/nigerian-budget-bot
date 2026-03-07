import { GoogleGenAI } from "@google/genai"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "GEMINI_API_KEY"

export async function POST(request: Request) {
  try {
    const { message, uploadedFile, history } = await request.json()

    if (!message) {
      return Response.json({ error: "Message is required" }, { status: 400 })
    }

    const systemPrompt = `You are the Nigerian Budget Bot, an expert AI assistant specializing in Nigerian government budgets and financial information from the Nigerian open system.

${uploadedFile ? `The user has uploaded a document called "${uploadedFile}" which is now part of your knowledge base. Reference this document when relevant to provide more specific information.` : ""}

Your responsibilities:
1. Provide accurate information about Nigerian budgets, spending allocations, and financial data
2. Explain budget allocations across different sectors
3. Discuss government revenue and expenditure patterns
4. Answer questions about fiscal policy and budget implementation
5. Always cite sources from Nigerian open system data when possible
6. Clarify when information may have changed or needs verification

Always be professional, accurate, and helpful. If you don't have specific information, acknowledge it and provide general context about where that information can be found.`

    const groundingTool = { googleSearch: {} }

    // Build Gemini messages from provided history (client-side localStorage)
    const messagesForGemini = Array.isArray(history)
      ? history.map((m: any) => ({ role: m.role === "user" ? "user" : "model", parts: [{ text: m.content }] }))
      : []

    // Add current user message
    messagesForGemini.push({ role: "user", parts: [{ text: message }] })

    const config = {
      tools: [groundingTool],
      systemInstruction: systemPrompt,
    }

    const client = new GoogleGenAI({ apiKey: GEMINI_API_KEY })

    // Generate response
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: messagesForGemini,
      config,
    })

    const assistantContent = response.text || "No response generated"

    return Response.json({ content: assistantContent })
  } catch (error) {
    console.error("[API Error]:", error)
    return Response.json({ error: "Failed to process request" }, { status: 500 })
  }
}