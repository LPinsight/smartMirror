import { Widget } from "./widget";

export interface Display {
  Id: string,
  Name: string,
  Height: number,
  Width: number,
  Columns: number,
  Rows: number
  Point_size: number, // point-size value list: [16,32,64,128,256]
  grid?: Widget[],
  Widgets: Widget[]
}
