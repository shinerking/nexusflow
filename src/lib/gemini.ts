import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

export type ProcurementAnalysis = {
  name: string;
  category: string;
  estimatedPrice: number;
  priority: "LOW" | "MEDIUM" | "HIGH";
  reason: string;
};

function cleanJsonResponse(text: string): string {
  let cleaned = text.trim();
  // Remove markdown code blocks (```json ... ``` or ``` ... ```)
  const jsonBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonBlockMatch) {
    cleaned = jsonBlockMatch[1].trim();
  }
  return cleaned;
}

export async function analyzeRequest(text: string): Promise<ProcurementAnalysis | null> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `Extract procurement request data from the following user description. Return ONLY a valid JSON object with exactly these keys (no other text, no markdown):
- name: string (title of the request)
- category: string (e.g. Electronics, Office, etc.)
- estimatedPrice: number (numeric value in Indonesian Rupiah (IDR) only, no currency symbols)
- priority: string (must be exactly one of: LOW, MEDIUM, HIGH)
- reason: string (brief justification)

RULE FOR PRICE: If the user does not mention a specific price, you MUST ESTIMATE the average market price in Indonesian Rupiah (IDR).

Assume the context is the Indonesian market (Tokopedia/Shopee prices).

Example: If user asks for "1 Laptop Gaming", estimate around 15000000 (15 Juta).

IMPORTANT: Return the price as a pure number (integer). Do NOT use dots, commas, or "Rp" symbols in the JSON output.

User description:
"""
${text}
"""

Return only the JSON object, no explanation.`;

  const result = await model.generateContent(prompt);
  const response = result.response.text();
  if (!response) return null;

  const cleaned = cleanJsonResponse(response);

  try {
    const parsed = JSON.parse(cleaned) as ProcurementAnalysis;
    // Validate and normalize priority
    const validPriorities = ["LOW", "MEDIUM", "HIGH"] as const;
    const priority = validPriorities.includes(parsed.priority)
      ? parsed.priority
      : "MEDIUM";

    return {
      name: String(parsed.name ?? "").trim() || "Untitled Request",
      category: String(parsed.category ?? "").trim() || "General",
      estimatedPrice: typeof parsed.estimatedPrice === "number"
        ? Math.max(0, parsed.estimatedPrice)
        : 0,
      priority,
      reason: String(parsed.reason ?? "").trim() || "",
    };
  } catch {
    return null;
  }
}
