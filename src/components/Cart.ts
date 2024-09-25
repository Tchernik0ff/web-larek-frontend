import { ICart } from "../types";
import { IEvents } from "./base/events";
import { Component } from "./Component";

export class Cart extends Component<ICart> {
  protected events: IEvents;
  protected _itemsList: HTMLElement;
  protected basketBtn: HTMLButtonElement;
  protected basketPriceContainer: HTMLElement;

  constructor(protected container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;

    this.basketBtn = this.container.querySelector('.basket__button');
    this.basketPriceContainer = this.container.querySelector('.basket__price');
    this._itemsList = this.container.querySelector('.basket__list');
    
    this.basketBtn.addEventListener('click', () => {
      this.events.emit('order: start');
    })
  }

  set total(total: number) {
    this.basketPriceContainer.textContent = `${total.toString()} синапсов`;
  }

  set itemsList(items: HTMLElement[]) {
    this._itemsList.replaceChildren(...items);
  }

  setButton(value: boolean) {
    if(value) {
      this.basketBtn.setAttribute('disabled', 'true');
    } else {
      this.basketBtn.removeAttribute('disabled');
    }
  }
}