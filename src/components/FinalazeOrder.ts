import { IEvents } from "./base/events";
import { Component } from "./Component";

export class FinalazeOrder extends Component<FinalazeOrder> {
  protected totalCost: HTMLElement;
  protected continiueShoppingBtn: HTMLButtonElement;
  protected events: IEvents;

  constructor(protected container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;

    this.totalCost = this.container.querySelector('.order-success__description');
    this.continiueShoppingBtn = this.container.querySelector('.order-success__close');

    this.continiueShoppingBtn.addEventListener('click', () => {
      this.events.emit('order: final');
    })
  }

  set _totalCost(total: string) {
    this.totalCost.textContent = `Списано ${total} синапсов`;
  }
}