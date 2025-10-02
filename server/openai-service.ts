import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
// This is using OpenAI's API, which points to OpenAI's API servers and requires your own API key.
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateMedicalIllustration(
  prompt: string
): Promise<string> {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Medical illustration in a friendly, modern, accessible style: ${prompt}. Clean, professional, welcoming aesthetic suitable for all ages, especially elderly patients. Use warm, trustworthy colors.`,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    return response.data[0].url || "";
  } catch (error: any) {
    console.error("Error generating image:", error.message);
    throw new Error("Failed to generate illustration");
  }
}

export async function generateSpecialtyIcon(
  specialtyName: string
): Promise<string> {
  const prompt = `A simple, clear medical icon representing ${specialtyName} specialty. Minimalist, friendly design with medical symbols. High contrast, easy to understand for elderly patients.`;
  return generateMedicalIllustration(prompt);
}

export async function generateNewsImage(
  newsTitle: string,
  category: string
): Promise<string> {
  const prompt = `Illustration for health news article titled "${newsTitle}" in category ${category}. Warm, educational, accessible style showing diverse Brazilian people in healthcare context. Positive, encouraging mood.`;
  return generateMedicalIllustration(prompt);
}
