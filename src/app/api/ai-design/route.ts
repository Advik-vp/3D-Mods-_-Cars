import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      // Fallback for development if no key is provided, mimicking the mock behavior
      console.warn('OPENAI_API_KEY not found. Using fallback design logic.');
      const lowerPrompt = prompt.toLowerCase();
      type DesignConfig = {
        paintColor: string;
        neonEnabled: boolean;
        neonColor: string;
        glossiness: number;
        metallic: number;
        rimColor: string;
        rimStyle: string;
        frontSplitter: boolean;
        rearSpoiler: boolean;
        widebody: boolean;
      };

      let simulatedConfig: DesignConfig = {
        paintColor: '#ff0055',
        neonEnabled: true,
        neonColor: '#00f3ff',
        glossiness: 85,
        metallic: 50,
        rimColor: '#b4b4b4',
        rimStyle: 'Aero V1',
        frontSplitter: false,
        rearSpoiler: true,
        widebody: false
      };
      
      if (lowerPrompt.includes('cyberpunk') || lowerPrompt.includes('neon')) {
        simulatedConfig = { paintColor: '#111111', neonEnabled: true, neonColor: '#9d00ff', rimColor: '#00f3ff', rimStyle: 'Cyber X', frontSplitter: true, rearSpoiler: true, widebody: true, glossiness: 90, metallic: 80 };
      } else if (lowerPrompt.includes('clean') || lowerPrompt.includes('white')) {
        simulatedConfig = { paintColor: '#ffffff', neonEnabled: false, neonColor: '#000000', rimColor: '#111111', rimStyle: 'Aero V1', rearSpoiler: false, frontSplitter: false, widebody: false, glossiness: 70, metallic: 20 };
      } else if (lowerPrompt.includes('racing') || lowerPrompt.includes('sport')) {
        simulatedConfig = { paintColor: '#ff0000', neonEnabled: false, neonColor: '#000000', rimColor: '#d4af37', rimStyle: 'Track Mesh', frontSplitter: true, rearSpoiler: true, widebody: true, glossiness: 95, metallic: 90 };
      }

      // Simulate generic network delay
      await new Promise(r => setTimeout(r, 1000));
      return NextResponse.json({ success: true, config: simulatedConfig });
    }

    const systemPrompt = `You are an expert AI Automotive Designer interface. 
The user provides a stylistic prompt for car styling. You MUST output ONLY raw JSON data adhering to this structure describing their car:
{
  "paintColor": "#hexcode",
  "glossiness": integer (0-100),
  "metallic": integer (0-100),
  "rimColor": "#hexcode",
  "rimStyle": string (e.g. "Aero V1", "Turbine X", "Mesh R"),
  "neonEnabled": boolean,
  "neonColor": "#hexcode",
  "neonIntensity": integer (0-100),
  "frontSplitter": boolean,
  "rearSpoiler": boolean,
  "widebody": boolean
}
Return absolutely NO markdown formats, ONLY valid JSON. Output sensible defaults for omissions based on the user's styling request.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'OpenAI API Error');
    }

    const content = data.choices[0].message.content.trim();
    // Strip markdown formatting if ChatGPT still outputs it
    const jsonStr = content.replace(/```json/gi, '').replace(/```/g, '').trim();
    const config = JSON.parse(jsonStr);

    return NextResponse.json({ success: true, config });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('AI Design Error:', message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
