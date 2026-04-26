export const INDIAN_CARS = [
  { brand: 'Maruti Suzuki', models: ['Swift', 'Baleno', 'Brezza', 'WagonR', 'Dzire', 'Fronx'] },
  { brand: 'Hyundai', models: ['Creta', 'Venue', 'i20', 'Verna', 'Alcazar'] },
  { brand: 'Tata Motors', models: ['Nexon', 'Punch', 'Harrier', 'Safari', 'Tiago'] },
  { brand: 'Mahindra', models: ['Thar', 'Scorpio N', 'XUV700', 'Bolero', 'XUV300'] },
  { brand: 'Toyota', models: ['Fortuner', 'Innova Crysta', 'Glanza', 'Urban Cruiser Hyryder'] },
  { brand: 'Honda', models: ['City', 'Amaze', 'Elevate'] }
];

export const SUPERCARS = [
  { brand: 'Apollo Automobil', models: ['Intensa Emozione', 'Arrow', 'Project One', 'EVO'] },
];

export const EXTERNAL_MODELS = [
  { brand: 'BMW', models: ['X7 M60i'] },
];

export const ALL_CARS = [...INDIAN_CARS, ...SUPERCARS, ...EXTERNAL_MODELS];

/** Sketchfab embed IDs for external 3D models (keyed by full car name) */
export const SKETCHFAB_MODELS: Record<string, string> = {
  'BMW X7 M60i': '56642189e66d47519bb2e7e5e50e9de7', // skfb.ly/ptOSG
};

/** Returns true if a given car name has a Sketchfab-hosted model */
export function hasSketchfabModel(carName: string): boolean {
  return carName in SKETCHFAB_MODELS;
}

export const FLATTENED_CARS = ALL_CARS.flatMap(brand => brand.models.map(m => `${brand.brand} ${m}`));

export function determineBaseGeometry(carName: string) {
  const suvModels = ['Brezza', 'Creta', 'Venue', 'Alcazar', 'Nexon', 'Punch', 'Harrier', 'Safari', 'Thar', 'Scorpio N', 'XUV700', 'Bolero', 'XUV300', 'Fortuner', 'Innova Crysta', 'Urban Cruiser Hyryder', 'Elevate'];
  const hatchbackModels = ['Swift', 'Baleno', 'WagonR', 'Fronx', 'i20', 'Tiago', 'Glanza'];
  const supercarModels = ['Intensa Emozione', 'Arrow', 'Project One', 'EVO'];

  if (!carName) return 'sedan';

  for (const sc of supercarModels) {
    if (carName.includes(sc)) return 'supercar';
  }
  for (const suv of suvModels) {
    if (carName.includes(suv)) return 'suv';
  }
  for (const hatch of hatchbackModels) {
    if (carName.includes(hatch)) return 'hatchback';
  }
  return 'sedan';
}
