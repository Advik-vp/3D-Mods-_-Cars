import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ success: false, error: 'No image bits provided' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      // Simulate GPT-4 Vision latency and mock extraction if no key is supplied
      console.warn('OPENAI_API_KEY missing. Providing mock Vision extraction response.');
      await new Promise(r => setTimeout(r, 2200));
      
      return NextResponse.json({ 
        success: true, 
        config: { 
          paintColor: '#d4af37', // Extracted metallic gold
          rimColor: '#111111', 
          glossiness: 90,
          metallic: 85,
          neonEnabled: true,
          neonColor: '#ff0055',
          widebody: true,
          frontSplitter: true,
          rearSpoiler: true
        } 
      });
    }

    // Ping GPT-4o for direct multi-modal Vision capabilities
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o', // Contains vision capabilities universally mapped
        messages: [
          { 
            role: 'system', 
            content: 'You are an advanced Automotive Computer Vision pipeline. Extract styling from the uploaded snapshot and output EXACTLY a raw JSON object detailing the configuration. Do not include markdown.' 
          },
          { 
            role: 'user', 
            content: [
              { type: 'text', text: 'Identify the aesthetic properties: paintColor, rimColor, glossiness (0-100), metallic (0-100), neonEnabled (boolean), frontSplitter (boolean), rearSpoiler (boolean), widebody (boolean).' },
              { type: 'image_url', image_url: { url: image } }
            ]
          }
        ],
        max_tokens: 300,
        temperature: 0.1
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'OpenAI Vision API Error');

    const content = data.choices[0].message.content.trim();
    const config = JSON.parse(content.replace(/```json/gi, '').replace(/```/g, '').trim());

    return NextResponse.json({ success: true, config });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Vision Parsing Error:', message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
