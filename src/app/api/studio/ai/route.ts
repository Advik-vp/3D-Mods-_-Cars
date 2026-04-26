import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    
    // Simulate AI parsing prompt
    const lowerPrompt = prompt.toLowerCase();
    
    type StudioAIConfig = {
      paintColor: string;
      neonEnabled: boolean;
      neonColor: string;
      rearSpoiler: boolean;
      rimColor?: string;
      frontSplitter?: boolean;
      widebody?: boolean;
    };

    // Default safe fallback
    const simulatedConfig: StudioAIConfig = {
      paintColor: '#ff0055',
      neonEnabled: true,
      neonColor: '#00f3ff',
      rearSpoiler: true
    };
    
    if (lowerPrompt.includes('cyberpunk') || lowerPrompt.includes('neon')) {
      simulatedConfig.paintColor = '#111111';
      simulatedConfig.neonEnabled = true;
      simulatedConfig.neonColor = '#9d00ff';
      simulatedConfig.rimColor = '#00f3ff';
      simulatedConfig.frontSplitter = true;
      simulatedConfig.rearSpoiler = true;
      simulatedConfig.widebody = true;
    } else if (lowerPrompt.includes('clean') || lowerPrompt.includes('white')) {
      simulatedConfig.paintColor = '#ffffff';
      simulatedConfig.neonEnabled = false;
      simulatedConfig.rimColor = '#111111';
      simulatedConfig.rearSpoiler = false;
      simulatedConfig.frontSplitter = false;
    }

    // Simulate short network delay for realism
    await new Promise(r => setTimeout(r, 1200));

    return NextResponse.json({ success: true, config: simulatedConfig });
  } catch {
    return NextResponse.json({ success: false, error: 'AI Processing Error' }, { status: 500 });
  }
}
