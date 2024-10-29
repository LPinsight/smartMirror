import { Widget } from "./widget";

export interface Eventping {
  label: eventLabel,
  object: Widget
}

export enum eventLabel { 
  create,
  update,
  delete
}