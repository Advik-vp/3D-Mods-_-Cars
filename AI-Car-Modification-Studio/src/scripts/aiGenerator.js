/* ===========================
   AI GENERATION SERVICE
   =========================== */

export default class AIGenerator {
  constructor() {
    this.apiEndpoint = process.env.AI_API_ENDPOINT || '/api/ai-design';
    this.isProcessing = false;
    this.generationHistory = [];
  }

  /**
   * Generate a car modification based on text prompt
   * @param {string} prompt - User's modification prompt
   * @returns {Promise<Object>}
   */
  async generateModification(prompt) {
    if (this.isProcessing) {
      console.warn('⚠️ Generation already in progress');
      return null;
    }

    if (!prompt.trim()) {
      console.error('❌ Prompt cannot be empty');
      return null;
    }

    this.isProcessing = true;

    try {
      console.log('🤖 Sending prompt to AI service:', prompt);

      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      this.generationHistory.push({
        prompt,
        result: data,
        timestamp: new Date(),
      });

      console.log('✅ AI generation completed');
      return data;
    } catch (error) {
      console.error('❌ AI generation failed:', error);

      // Return mock data for demonstration
      console.log('📝 Using mock response for demonstration');
      return this.getMockResponse(prompt);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Generate multiple variations of a design
   * @param {string} basePrompt - Base modification prompt
   * @param {number} count - Number of variations to generate
   * @returns {Promise<Object[]>}
   */
  async generateVariations(basePrompt, count = 3) {
    const variations = [];

    for (let i = 0; i < count; i++) {
      const modifiedPrompt = `${basePrompt} variation ${i + 1}`;
      const result = await this.generateModification(modifiedPrompt);
      if (result) {
        variations.push(result);
      }
    }

    return variations;
  }

  /**
   * Analyze an uploaded image and detect car modifications
   * @param {File|Blob} imageFile - Image file
   * @returns {Promise<Object>}
   */
  async analyzeImage(imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      console.log('🖼️ Analyzing image:', imageFile.name);

      const response = await fetch(`${this.apiEndpoint}/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Image analysis completed');
      return data;
    } catch (error) {
      console.error('❌ Image analysis failed:', error);
      return this.getMockImageAnalysis(imageFile.name);
    }
  }

  /**
   * Apply a preset style to the model
   * @param {string} styleName - Name of the preset style
   * @returns {Promise<Object>}
   */
  async applyPresetStyle(styleName) {
    const styles = {
      'racing': {
        modifications: ['lowered suspension', 'wide body kit', 'performance wheels'],
        colors: ['matte black', 'bright red', 'neon yellow'],
      },
      'luxury': {
        modifications: ['chrome trim', 'leather interior', 'smooth curves'],
        colors: ['pearl white', 'metallic silver', 'champagne gold'],
      },
      'futuristic': {
        modifications: ['sharp angles', 'LED lights', 'aerodynamic design'],
        colors: ['neon cyan', 'electric blue', 'holographic'],
      },
      'classic': {
        modifications: ['vintage style', 'round lights', 'simple lines'],
        colors: ['cherry red', 'forest green', 'ocean blue'],
      },
    };

    const style = styles[styleName.toLowerCase()];
    if (!style) {
      console.warn(`⚠️ Style "${styleName}" not found`);
      return null;
    }

    return {
      style: styleName,
      ...style,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get generation history
   * @returns {Object[]}
   */
  getHistory() {
    return this.generationHistory;
  }

  /**
   * Clear generation history
   */
  clearHistory() {
    this.generationHistory = [];
    console.log('✅ History cleared');
  }

  /**
   * Mock response for demonstration
   * @param {string} prompt
   * @returns {Object}
   */
  getMockResponse(prompt) {
    const modifications = [
      {
        type: 'color',
        value: '#' + Math.floor(Math.random() * 16777215).toString(16),
        intensity: Math.random() * 0.5 + 0.5,
      },
      {
        type: 'metalness',
        value: Math.random() * 0.5 + 0.5,
      },
      {
        type: 'roughness',
        value: Math.random() * 0.3 + 0.3,
      },
      {
        type: 'scale',
        target: 'wheels',
        value: Math.random() * 0.2 + 0.9,
      },
    ];

    return {
      success: true,
      prompt: prompt,
      modifications: modifications,
      confidence: Math.random() * 0.3 + 0.7,
      estimatedTime: Math.random() * 3 + 1,
      message: '🎨 Mock design generated (demo mode)',
    };
  }

  /**
   * Mock image analysis response
   * @param {string} imageName
   * @returns {Object}
   */
  getMockImageAnalysis(imageName) {
    return {
      success: true,
      image: imageName,
      detectedParts: [
        { part: 'body', confidence: 0.95, color: '#' + Math.floor(Math.random() * 16777215).toString(16) },
        { part: 'wheels', confidence: 0.88, size: 'medium' },
        { part: 'windows', confidence: 0.92, tint: 'light' },
        { part: 'lights', confidence: 0.85, type: 'LED' },
      ],
      suggestedModifications: [
        'Upgrade to performance wheels',
        'Add neon underglow',
        'Install a widebody kit',
      ],
      message: '🖼️ Image analysis completed (demo mode)',
    };
  }

  /**
   * Get available preset styles
   * @returns {string[]}
   */
  getAvailableStyles() {
    return ['racing', 'luxury', 'futuristic', 'classic'];
  }

  /**
   * Rate a generated design
   * @param {number} designId - ID of the design
   * @param {number} rating - Rating from 1 to 5
   */
  rateDesign(designId, rating) {
    if (rating < 1 || rating > 5) {
      console.error('Rating must be between 1 and 5');
      return;
    }

    console.log(`⭐ Design ${designId} rated ${rating}/5`);

    // In a real app, this would send feedback to the backend
    // to improve future AI generations
  }

  /**
   * Get design recommendations based on history
   * @returns {string[]}
   */
  getRecommendations() {
    if (this.generationHistory.length === 0) {
      return [
        'Try describing a specific car style (e.g., "racing", "luxury")',
        'Mention car parts (e.g., "lower the suspension")',
        'Specify colors or materials (e.g., "metallic blue")',
      ];
    }

    return [
      'Refine your previous prompt with more details',
      'Try combining multiple styles',
      'Ask for variations of successful designs',
    ];
  }
}
