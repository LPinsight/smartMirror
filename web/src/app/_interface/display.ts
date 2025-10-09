import { Widget } from "./widget";

export interface Display {
  id: string,
  name: string,
  height: number,
  width: number,
  columns: number,
  rows: number
  point_size: number, // point-size value list: [16,32,64,128,256]
  grid?: Widget[],
  widgets: Widget[]
}
