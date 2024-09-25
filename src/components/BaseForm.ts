import { IEvents } from "./base/events";
import { Component } from "./Component";

export abstract class BaseForm<T extends BaseForm<T>> extends Component<T> {
  protected events: IEvents;
  protected submitBtn: HTMLButtonElement;
  protected errElement: HTMLElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    
    this.submitBtn = this.container.querySelector('.button');
    this.errElement = this.container.querySelector('.form__errors');

    this.container.addEventListener('input', this.handleValidation.bind(this));
  }

  ///Асбтрактный метод получения инпутов
  abstract getInputElements(): HTMLInputElement[];

  ///Получаем инпуты которые пусты
  getInvalidInputs(): HTMLInputElement[] {
    const inputElements = this.getInputElements();
    return inputElements.filter((input) => input.value.trim() === '');
  }

  ///Получаем инпуты, содержимое которых не пусто
  getValidInputs(): HTMLInputElement[] {
    const inputElements = this.getInputElements();
    return inputElements.filter((input) => input.value.trim() !== '');
  }

  ///Проверка инпутов на 'пустоту'
  validateFormInputs(): boolean {
    const inputElements = this.getInputElements();
    return inputElements.every((input) => input.value.trim() !== '');
  }

  ///Сама валидация
  handleValidation() {
    this.events.emit('form: changes');
    if(this.validateFormInputs()) {
      this.submitBtn.removeAttribute('disabled');
      this.hideError();
    } else {
      this.submitBtn.setAttribute('disabled', 'true');
      this.showError();
    }
  }

  ///Отобразить ошибку
  showError() {
    const invalidInputs = this.getInvalidInputs();
    invalidInputs.forEach((input) => {
      input.setCustomValidity('invalid');
    });
    this.errElement.textContent = 'Пожалуйста, заполните все обязательные поля.';
  }

  ///Скрыть ошибку
  hideError() {
    const validInputs = this.getValidInputs();
    validInputs.forEach((input) => {
      input.setCustomValidity('');
    });
    this.errElement.textContent = '';
  }

  ///Метод для реста содержимого инпута
  resetInputs() {
    const validInputs = this.getValidInputs();
    validInputs.forEach((input) => {
      input.value = '';
    });
  }

  ///Установка режима "Ожидания" на кнопку сабмита
  setAwaitBtn() {
    if(!this.submitBtn.disabled) {
      this.submitBtn.setAttribute('disabled', 'true');
      this.submitBtn.textContent = 'Загрузка..';
    } else {
      this.submitBtn.removeAttribute('disabled');
      this.submitBtn.textContent = 'Оплатить';
    }
  }

  ///Очистка валидации
  clearValidation() {
    const invalidInputs = this.getInvalidInputs();
    invalidInputs.forEach((input) => {
      input.setCustomValidity('');
    });
    this.resetInputs();
    this.errElement.textContent = '';
    this.submitBtn.setAttribute('disabled', 'true');
  }
}