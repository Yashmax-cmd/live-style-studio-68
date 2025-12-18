import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userImage, clothingDescription } = await req.json();
    
    const HF_TOKEN = Deno.env.get("HUGGING_FACE_ACCESS_TOKEN");
    if (!HF_TOKEN) {
      throw new Error("HUGGING_FACE_ACCESS_TOKEN is not configured");
    }

    // Validate the user image
    if (!userImage || userImage === "data:," || userImage.length < 100) {
      throw new Error("Invalid or empty user image. Please try capturing again.");
    }

    console.log("Processing virtual try-on request with Hugging Face...");
    console.log("Clothing description:", clothingDescription);

    // Generate a fashion model image wearing the described clothing
    const prompt = `A professional fashion photography photo of a person wearing ${clothingDescription}. Full body shot, studio lighting, white background, high quality fashion catalog style, realistic and detailed clothing texture.`;

    console.log("Generating image with prompt:", prompt);

    // Use the new Hugging Face router endpoint directly
    const response = await fetch("https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Hugging Face API error:", response.status, errorText);
      throw new Error(`Image generation failed: ${response.status}`);
    }

    // Get the image as array buffer
    const imageBuffer = await response.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(imageBuffer)));
    const generatedImage = `data:image/png;base64,${base64}`;

    console.log("Image generated successfully");

    return new Response(
      JSON.stringify({ 
        success: true, 
        resultImage: generatedImage,
        message: `Generated preview of: ${clothingDescription}` 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Virtual try-on error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Something went wrong. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
