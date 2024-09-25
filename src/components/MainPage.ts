import { IEvents } from "./base/events";
import { Component } from "./Component";

export interface IMainPage {
  catalog: HTMLElement[];
}

///Класс вью главной страницы
export class MainPage extends Component<IMainPage>{
  protected events: IEvents;
  protected _catalog: HTMLElement;
  protected cartBtn: HTMLButtonElement;
  protected _cartCounter: HTMLElement;
  protected pageWrapper: HTMLElement;

  constructor(protected container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    
    this.pageWrapper = this.container.querySelector('.page__wrapper');
    this._catalog = this.container.querySelector('.gallery')
    this.cartBtn = this.container.querySelector('.header__basket');
    this._cartCounter = this.container.querySelector('.header__basket-counter');

    this.cartBtn.addEventListener('click', () => this.events.emit('cart: open'));
  }

  ///Сеттер карточек
  set catalog(items: HTMLElement[]) {
    this._catalog.replaceChildren(...items);
  }

  ///Сеттер счетчика корзины
  set cartCounter(count: string) {
    this._cartCounter.textContent = count.toString();
  }

  ///Заблокировать элемент
  lockElement() {
    this.pageWrapper.classList.replace('page__wrapper', 'page__wrapper_locked');
  }

  ///Разблокировать элемент
  unlockElement() {
    this.pageWrapper.classList.replace('page__wrapper_locked', 'page__wrapper');
  }
}