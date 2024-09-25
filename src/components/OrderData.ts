import { IOrder } from "../types";

///Класс данных заказа
export class Order implements IOrder {
  protected payment: string;
  protected email: string;
  protected phone: string;
  protected address: string;
  protected total: number;
  protected items: string[];

  constructor() {
    this._items = [];
  }

  ///Сеттеры и геттеры, возможно геттеры будут не нужны.
  set _payment(payment: string) {
    this.payment = payment;
  }

  get _payment() {
    return this.payment;
  }

  set _email(email: string) {
    this.email = email;
  }

  get _email() {
    return this.email;
  }

  set _phone(phone: string) {
    this.phone = phone;
  }

  get _phone() {
    return this.phone;
  }

  set _addres(addres: string) {
    this.address = addres;
  }

  get _addres() {
    return this.address;
  }

  set _total(total: number) {
    this.total = total;
  }

  get _total() {
    return this.total;
  }

  set _items(items: string[]) {
    this.items = items;
  }

  get _items() {
    return this.items;
  }

  ///Метод для сброса значений заказа
  resetOrder() {
    this.payment = null;
    this.email  = null;
    this.phone = null;
    this.address = null;
    this.total = null;
    this.items = [];
  }
}