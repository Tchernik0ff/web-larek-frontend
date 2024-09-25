import { IEvents } from "../base/events";
import { Component } from "../Component";

export interface IModal {
  _content: HTMLElement;
}

export class Modal extends Component<IModal> {
  protected modal: HTMLElement;
  protected content: HTMLElement;
  protected events: IEvents;
  protected closeBtn: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;

    this.content = this.container.querySelector('.modal__content');
    this.closeBtn = this.container.querySelector('.modal__close');
    
    this.closeBtn.addEventListener('click', this.close.bind(this));
    this.container.addEventListener('mousedown', (evt => {
      if (evt.target === evt.currentTarget) {
        this.close();
      }
    }))
    this.handleEscKeyUp = this.handleEscKeyUp.bind(this);
  }

  ///Сеттер содержимого модалки
  set _content(value: HTMLElement) {
    this.content = value;
    const contentContainer = this.container.querySelector('.modal__content');
    if (contentContainer) {
      contentContainer.innerHTML = '';
      contentContainer.appendChild(this.content);
    }
  }

  ///Открытие модалки
  open() {
    this.container.classList.add('modal_active');
    document.addEventListener('keyup', this.handleEscKeyUp);
    this.events.emit('modal: open');
  }

  ///Закрытие модалки
  close() {
    this.container.classList.remove('modal_active');
    document.removeEventListener('keyup', this.handleEscKeyUp);
    this.events.emit('modal: close');
  }

  ///Хэндрел закрытия по Esc
  handleEscKeyUp(evt: KeyboardEvent) {
    if (evt.key === 'Escape') {
      this.close();
    }
  }

  render(data: IModal): HTMLElement {
    super.render(data);
    this.open();
    return this.container;
  }
}