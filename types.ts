export enum AppMode {
  TREE = 'TREE',       // Closed cone shape
  EXPLODED = 'EXPLODED', // Floating chaos
  FOCUS = 'FOCUS',     // Zoomed into a photo
}

export enum GestureType {
  IDLE = 'IDLE',
  FIST = 'FIST',
  OPEN_HAND = 'OPEN_HAND',
  PINCH = 'PINCH',
  POINT = 'POINT',
}

export interface HandLandmark {
  x: number;
  y: number;
  z: number;
}

export interface GestureState {
  type: GestureType;
  position: { x: number; y: number }; // Normalized 0-1
  pinchDistance?: number;
}

export interface ParticleData {
  id: number;
  position: [number, number, number]; // Current pos
  treePosition: [number, number, number]; // Target tree pos
  explodedPosition: [number, number, number]; // Target exploded pos
  scale: number;
  color: string;
  type: 'SPHERE' | 'CUBE' | 'CANDY';
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      instancedMesh: any;
      icosahedronGeometry: any;
      meshStandardMaterial: any;
      group: any;
      circleGeometry: any;
      meshBasicMaterial: any;
      color: any;
      ambientLight: any;
      spotLight: any;
      pointLight: any;
    }
  }
}