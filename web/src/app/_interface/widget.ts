export interface Widget {
  id?: string;
  name: string
  point_start: point;
  point_end: point;
}

interface point {
  x: number;
  y: number;
}
