// types.ts
export interface Menu {
  id: number;
  name: string;
  price: number;
}

export interface LocationState {
  menu: Menu;
}