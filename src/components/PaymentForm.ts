import { IEvents } from "./base/events";
import { BaseForm } from "./BaseForm";

export class PaymentForm extends BaseForm<PaymentForm> {
  protected onlineBtn: HTMLButtonElement;
  protected onDeliveryBtn: HTMLButtonElement;
  protected addresInput: HTMLInputElement;
  protected submitBtn: HTMLButtonElement;

  constructor(protected container: HTMLElement, events: IEvents) {
    super(container, events)

    this.onlineBtn = this.container.querySelector('button[name = "card"]');
    this.onDeliveryBtn = this.container.querySelector('button[name = "cash"]');
    this.addresInput = this.container.querySelector('.form__input');
    this.submitBtn = this.container.querySelector('.order__button');

    this.onDeliveryBtn.addEventListener('click', () => {
      this.handleClick(this.onDeliveryBtn);
      this.handleValidation();
    })

    this.onlineBtn.addEventListener('click', () => {
      this.handleClick(this.onlineBtn);
      this.handleValidation();
    })
    
    ///Передает объект со значением инпута адрес и способ оплаты
    this.submitBtn.addEventListener('click', (evt) => {
      evt.preventDefault();
      const paymentMethod = this.onlineBtn.classList.contains('button_alt-active') ? 'online' : 'onDelivery';
      this.events.emit('firstStepForm: complete', { address: this.addresInput.value, paymentMethod });
    });
  }
  
  ///Сеттер для сброса кнопок при повторном открытии платежной формы
  set buttons(value: string) {
    if (value === 'disabled') {
      this.onDeliveryBtn.classList.replace('button_alt-active', 'button');
      this.onlineBtn.classList.replace('button_alt-active', 'button');
      this.submitBtn.setAttribute('disabled', 'true');
    } else {
      throw console.error('incorrect value, must be "disabled"');
    }
  }

  ///Метод для получения инпутов
  getInputElements(): HTMLInputElement[] {
    return [this.addresInput];
  }

  ///Метод для получения кнопок формы
  getBtnElem() :HTMLButtonElement[] {
    return [this.onlineBtn, this.onDeliveryBtn];
  }

  ///Метод переопределен для того чтобы проверять выбран ли метод оплаты
  validateFormInputs(): boolean {
    const inputElements = this.getInputElements();
    return inputElements.every((input) => input.value.trim() !== "" && this.validateSelection());
  }

  ///Метод для проверки нажата ли одна из кнопок оплаты
  validateSelection(): boolean {
    const btnElements = this.getBtnElem();
    return btnElements.some((btn) => btn.classList.contains('button_alt-active'));
  }

  ///Функция проверка нажатой кнопки, для сокращения кода
  handleClick(targetBtn: HTMLButtonElement) {
    const otherTarget = targetBtn === this.onlineBtn ? this.onDeliveryBtn : this.onlineBtn;
    if(targetBtn.classList.contains('button')) {
      targetBtn.classList.replace('button', 'button_alt-active');
      otherTarget.classList.replace('button_alt-active', 'button');
    } else {
      targetBtn.classList.replace('button_alt-active', 'button');
    }
  }
}