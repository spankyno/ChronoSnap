import { GoogleGenAI } from "@google/genai";

// Ensure API Key is present (handled by environment/user provided key usually, 
// but here we assume process.env per instructions, or we will fail gracefully if missing).
const apiKey = process.env.API_KEY || ''; 

const ai = new GoogleGenAI({ apiKey });

export async function generateTimeTravelImage(
  userImageBase64: string,
  scenePrompt: string
): Promise<string> {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  // Remove data URL prefix if present for the API call
  const base64Data = userImageBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
  
  // Model selection: gemini-2.5-flash-image is fast and good for general image tasks.
  // We use the image + text prompt strategy.
  const model = 'gemini-2.5-flash-image';

  // Construct a strong prompt for the model
  const fullPrompt = `
    Transform this image. 
    Put the person from the input image into the following scene: "${scenePrompt}".
    
    Instructions:
    1. Preserve the person's facial features and likeness (identity) as much as possible.
    2. Adjust the person's clothing and lighting to match the scene perfectly.
    3. The style should be photorealistic.
    4. Ensure high quality composition.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            text: fullPrompt,
          },
          {
            inlineData: {
              mimeType: 'image/jpeg', // Assuming JPEG for simplicity, works with PNG too usually
              data: base64Data,
            },
          },
        ],
      },
    });

    // Check for image in response
    // The response structure for images in Gemini 2.5 Flash Image might be in inlineData of candidates
    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      const candidate = candidates[0];
      // Explicitly check for content and parts existence before accessing
      if (candidate?.content?.parts) {
        const parts = candidate.content.parts;
        for (const part of parts) {
          if (part.inlineData && part.inlineData.data) {
             return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
          }
        }
      }
    }

    throw new Error("No image generated.");

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
