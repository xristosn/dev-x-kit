export type GradientValue = {
  type: 'linear' | 'radial';
  rotation: number;
  colorStops: GradientStop[];
};

export type GradientStop = {
  id: string;
  color: string;
  offset: number;
};
