import { GoogleGenAI } from "@google/genai";
import { RestorationConfig } from "../types";

/**
 * Restores the image using Gemini 2.5 Flash Image.
 * This model allows usage without forcing the user to bring their own key.
 */
export const restoreImage = async (
  base64Image: string,
  config: RestorationConfig
): Promise<string> => {
  // Use the environment API Key directly. No user prompt needed.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Clean the base64 string if it contains the data URL prefix
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

  // Construct a prompt focused on restoration and fidelity
  const prompt = `
    Actua como un experto en restauración fotográfica digital. 
    Tu tarea es restaurar esta imagen y adaptarla al formato solicitado.
    
    Instrucciones estrictas:
    1. Aumenta la nitidez y la calidad visual general.
    2. Elimina ruido digital, manchas o imperfecciones visibles.
    3. Mejora la iluminación y el contraste de manera natural.
    4. IMPORTANTE: Mantén la fidelidad absoluta a la imagen original. No inventes objetos, no cambies caras, no alteres la esencia.
    5. Solo genera la imagen restaurada.
    ${config.promptEnhancement ? `Nota adicional del usuario: ${config.promptEnhancement}` : ""}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: prompt,
          },
          {
            inlineData: {
              mimeType: 'image/png',
              data: cleanBase64,
            },
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: config.aspectRatio,
          // imageSize is not supported in gemini-2.5-flash-image, so we rely on the model's default high quality
        },
      },
    });

    // Extract image from response
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("No se pudo generar la imagen. Intenta de nuevo.");

  } catch (error: any) {
    console.error("Gemini Restoration Error:", error);
    throw new Error(error.message || "Error al procesar la imagen.");
  }
};