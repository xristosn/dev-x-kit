export interface GradientValue {
  type: 'linear' | 'radial';
  rotation: number;
  colorStops: GradientStop[];
}

export interface GradientStop {
  id: string;
  color: string;
  offset: number;
}
