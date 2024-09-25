import { IProduct, IProductsData } from "../types";
import { IEvents } from "./base/events";

export class ProductsData implements IProductsData {
  protected _products: IProduct[];
  protected _preview: string | null;
  protected events: IEvents;


  constructor(events: IEvents) {
    this.events = events;
  }

  set items(products: IProduct[]) {
    this._products = products;
    this.events.emit('products: changed');
  }

  get items() {
    return this._products
  }

  getProductCard(productId: string): IProduct | undefined {
    return this._products.find((product) => product.id === productId);
  }
}