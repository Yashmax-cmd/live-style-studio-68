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
    const { userImage, clothingDescription, clothingImageUrl } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const HF_TOKEN = Deno.env.get("HUGGING_FACE_ACCESS_TOKEN");
    
    if (!LOVABLE_API_KEY && !HF_TOKEN) {
      throw new Error("No API key configured");
    }

    // Validate the user image
    if (!userImage || userImage === "data:," || userImage.length < 100) {
      throw new Error("Invalid or empty user image. Please try capturing again.");
    }

    console.log("Processing virtual try-on request...");
    console.log("Clothing description:", clothingDescription);
    console.log("User image length:", userImage.length);

    // Try Lovable AI first (supports image editing)
    if (LOVABLE_API_KEY) {
      try {
        const prompt = `Edit this photo to change ONLY the person's clothing/shirt/top to: ${clothingDescription}. 

CRITICAL REQUIREMENTS:
- Keep the EXACT same person - same face, hair, skin tone, glasses, expression
- Keep the EXACT same pose and body position
- Keep the EXACT same background
- ONLY change the clothing to: ${clothingDescription}
- Make the new clothing look natural and realistic
- Maintain proper lighting and shadows consistent with the original photo
- The result should look like the same photo but with different clothes`;

        console.log("Using Lovable AI for image editing...");

        const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-image",
            messages: [
              {
                role: "user",
                content: [
                  { type: "text", text: prompt },
                  { type: "image_url", image_url: { url: userImage } },
                ],
              },
            ],
            modalities: ["image", "text"],
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const generatedImage = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

          if (generatedImage) {
            console.log("Lovable AI image editing successful");
            return new Response(
              JSON.stringify({ 
                success: true, 
                resultImage: generatedImage,
                message: `Virtual try-on complete with ${clothingDescription}` 
              }),
              { headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
        } else {
          const errorText = await response.text();
          console.log("Lovable AI error:", response.status, errorText);
          
          if (response.status === 402) {
            console.log("Credits exhausted, falling back to Hugging Face...");
          } else if (response.status === 429) {
            console.log("Rate limited, falling back to Hugging Face...");
          }
        }
      } catch (lovableError) {
        console.log("Lovable AI failed, trying fallback:", lovableError);
      }
    }

    // Fallback to Hugging Face if available
    if (HF_TOKEN) {
      console.log("Using Hugging Face fallback...");
      
      // Use InstructPix2Pix for image editing
      const editInstruction = `Change the person's clothing to ${clothingDescription}. Keep the same person, face, pose, and background.`;
      
      // Convert base64 to blob for HF API
      const base64Data = userImage.split(',')[1];
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const response = await fetch("https://router.huggingface.co/hf-inference/models/timbrooks/instruct-pix2pix", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: {
            image: base64Data,
            prompt: editInstruction,
          },
          parameters: {
            image_guidance_scale: 1.5,
            guidance_scale: 7.5,
          }
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Hugging Face API error:", response.status, errorText);
        
        // If instruct-pix2pix fails, generate a preview image instead
        console.log("Falling back to generating preview image...");
        
        const previewResponse = await fetch("https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${HF_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: `A professional fashion photo of a person wearing ${clothingDescription}. Full body shot, studio lighting, high quality.`,
          }),
        });

        if (!previewResponse.ok) {
          throw new Error("Image generation failed. Please try again later.");
        }

        const imageBuffer = await previewResponse.arrayBuffer();
        const base64Result = btoa(String.fromCharCode(...new Uint8Array(imageBuffer)));
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            resultImage: `data:image/png;base64,${base64Result}`,
            message: `Preview of: ${clothingDescription} (Note: For best results with your actual photo, please add Lovable AI credits)` 
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const imageBuffer = await response.arrayBuffer();
      const base64Result = btoa(String.fromCharCode(...new Uint8Array(imageBuffer)));
      
      console.log("Hugging Face image editing successful");
      return new Response(
        JSON.stringify({ 
          success: true, 
          resultImage: `data:image/png;base64,${base64Result}`,
          message: `Virtual try-on complete with ${clothingDescription}` 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    throw new Error("No AI service available. Please check your API configuration.");
  } catch (error) {
    console.error("Virtual try-on error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Something went wrong. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
