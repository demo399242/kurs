export interface IDoneResult {
  done: boolean;
  message: string;
  data?: any;
}

export interface ICollectionItems {
  collection: string;
  count: number;
  items: Array<any>;
}
