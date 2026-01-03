import * as THREE from 'three';

export const COLORS = {
  EMERALD: '#023020',
  GOLD: '#C5A059',
  RED: '#8A0303',
  SILVER: '#E5E5E5',
  WHITE: '#FFFFFF',
};

export const PARTICLE_COUNT = 400;
export const PHOTO_COUNT = 12;

// Math Helpers
export const randomRange = (min: number, max: number) => Math.random() * (max - min) + min;

export const generateTreePosition = (index: number, total: number, height: number = 15, radius: number = 6): [number, number, number] => {
  const y = (index / total) * height - (height / 2); // -7.5 to 7.5
  const normY = (y + height / 2) / height; // 0 to 1
  const currentRadius = radius * (1 - normY); // Cone shape
  const angle = index * 137.5 * (Math.PI / 180); // Golden angle
  const x = Math.cos(angle) * currentRadius;
  const z = Math.sin(angle) * currentRadius;
  return [x, y, z];
};

export const generateExplodedPosition = (radius: number = 15): [number, number, number] => {
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(Math.random() * 2 - 1);
  const r = Math.cbrt(Math.random()) * radius;
  return [
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta),
    r * Math.cos(phi)
  ];
};
