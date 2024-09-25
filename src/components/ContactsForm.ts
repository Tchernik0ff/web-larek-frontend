import { IEvents } from "./base/events";
import { BaseForm } from "./BaseForm";

export class ContactForm extends BaseForm<ContactForm> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;
  protected submitBtn: HTMLButtonElement;
  
  constructor(protected container: HTMLElement, events: IEvents) {
    super(container, events);
    
    this.emailInput = this.container.querySelector('input[name = "email"]');
    this.phoneInput = this.container.querySelector('input[name = "phone"]');
    this.submitBtn = this.container.querySelector('.button');

    this.submitBtn.addEventListener('click', (evt) => {
      evt.preventDefault();
      this.events.emit('order: place', {phone: this.phoneInput.value, email: this.emailInput.value});
    })
  }

  ///Метод для получения инпутов
  getInputElements(): HTMLInputElement[] {
    return [this.emailInput, this.phoneInput];
  }
}