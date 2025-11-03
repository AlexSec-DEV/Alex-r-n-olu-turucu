import { AspectRatio } from '../types';

export const generateMockupImage = async (
  productName: string,
  aspectRatio: AspectRatio['value'],
  customPrompt: string | undefined,
  apiKey: string
): Promise<string> => {
  if (!apiKey) {
    throw new Error("API anahtarı sağlanmadı.");
  }

  // Map UI aspect ratio to DALL-E 3 supported sizes
  const sizeMap: Record<AspectRatio['value'], string> = {
    "1:1": "1024x1024",
    "16:9": "1792x1024",
    "9:16": "1024x1792",
    "4:3": "1024x1024", // DALL-E 3 doesn't support 4:3, falling back to square
    "3:4": "1024x1792", // DALL-E 3 doesn't support 3:4, falling back to portrait
  };
  const imageSize = sizeMap[aspectRatio];

  const fullPrompt = `Professional product photography of a ${productName}. Clean, minimalist studio background in deep blue and purple tones. Photorealistic, 8K, high detail, commercial mockup. ${customPrompt || ''}`;

  try {
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: fullPrompt,
        n: 1,
        size: imageSize,
        response_format: 'b64_json'
      })
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data?.error?.message || "OpenAI API'sinden bir hata alındı.";
      throw new Error(errorMessage);
    }

    if (data.data && data.data.length > 0 && data.data[0].b64_json) {
      return `data:image/png;base64,${data.data[0].b64_json}`;
    } else {
      throw new Error("API'den resim verisi alınamadı.");
    }
  } catch (error) {
    console.error("Error generating image with OpenAI:", error);
    // Re-throw the original error so it can be handled by the calling component.
    throw error;
  }
};
