'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ActiveTool = 'import' | 'ai-generator' | 'parts' | 'photo' | 'export';
export type TransformMode = 'translate' | 'rotate' | 'scale' | null;

export interface CarConfig {
  paintColor: string;
  glossiness: number;
  metallic: number;
  rimColor: string;
  rimStyle: string;
  neonEnabled: boolean;
  neonColor: string;
  neonIntensity: number;
  frontSplitter: boolean;
  rearSpoiler: boolean;
  widebody: boolean;
  importedModelUrl?: string | null;
}

interface StudioContextProps {
  activeTool: ActiveTool;
  setActiveTool: (tool: ActiveTool) => void;
  carConfig: CarConfig;
  updateCarConfig: (updates: Partial<CarConfig>) => void;
  resetConfig: () => void;
  transformMode: TransformMode;
  setTransformMode: (mode: TransformMode) => void;
  selectedPart: string | null;
  setSelectedPart: (part: string | null) => void;
}

const defaultConfig: CarConfig = {
  paintColor: '#111111',
  glossiness: 85,
  metallic: 70,
  rimColor: '#b4b4b4',
  rimStyle: 'Aero V1',
  neonEnabled: true,
  neonColor: '#00f3ff',
  neonIntensity: 100,
  frontSplitter: true,
  rearSpoiler: false,
  widebody: true,
  importedModelUrl: null,
};

const StudioContext = createContext<StudioContextProps | undefined>(undefined);

export const StudioProvider = ({ children }: { children: ReactNode }) => {
  const [activeTool, setActiveTool] = useState<ActiveTool>('ai-generator');
  const [carConfig, setCarConfig] = useState<CarConfig>(defaultConfig);
  const [transformMode, setTransformMode] = useState<TransformMode>(null);
  const [selectedPart, setSelectedPart] = useState<string | null>(null);

  const updateCarConfig = (updates: Partial<CarConfig>) => {
    setCarConfig((prev) => ({ ...prev, ...updates }));
  };

  const resetConfig = () => {
    setCarConfig(defaultConfig);
    setTransformMode(null);
    setSelectedPart(null);
  };

  return (
    <StudioContext.Provider
      value={{
        activeTool,
        setActiveTool,
        carConfig,
        updateCarConfig,
        resetConfig,
        transformMode,
        setTransformMode,
        selectedPart,
        setSelectedPart
      }}
    >
      {children}
    </StudioContext.Provider>
  );
};

export const useStudioContext = () => {
  const context = useContext(StudioContext);
  if (!context) {
    throw new Error('useStudioContext must be used within a StudioProvider');
  }
  return context;
};
