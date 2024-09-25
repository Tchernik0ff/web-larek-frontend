import { ICart, TProductInCart } from "../types";
import { IEvents } from "./base/events";

///Класс данных корзины
export class CartData implements ICart {
  protected _items: TProductInCart[];
  protected _total: number;
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
    
    this._items = [];
    this._total = 0;
  }

  get items(): TProductInCart[] {
    return this._items;
  }

  ///Геттер суммы корзины
  get total(): number {
    return this._total;
  }

  ///Добавление товара
  addItem(product: TProductInCart): void {
    this._items.push(product);
    this._total = this.calculateTotalPrice();
    this.events.emit('cartItem: changed');
    this.updateIndex();
  }

  ///Удаление товара
  removeItem(productId: string): void {
    const index = this._items.findIndex(item => item.id === productId);
    if (index !== -1) {
      this._items.splice(index, 1);
      this._total = this.calculateTotalPrice();
      this.events.emit('cartItem: changed');
      this.updateIndex();
    }
  }

  ///Сброс массива корзины
  resetCartData() {
    this._items = [];
    this._total = 0;
  }

  ///Обновление порядкового номера товара в корзине
  updateIndex() { ///Возможно нужно делать при обработке события картитем ченжед
    this._items.forEach((item, index) => {
      item.index = index + 1;
    });
  }

  ///Есть ли товар с таким айди уже в корзине
  hasInCart(productId: string) { 
    return this._items.some(item => item.id === productId);
  }

  ///Получаем массив айдишников товаров которые находятся в корзине
  getItemIds(): string[] {
    return this._items.map(item => item.id);
  }

  ///Рассчет суммы
  calculateTotalPrice(): number {
    return this._items.reduce((total, item) => total + (item.price || 0), 0);
  }

  ///Обновление данных счетчика
  updateCartCounter(): string { /// Возможно переделать на гет
    return this._items.length.toString();
  }
}