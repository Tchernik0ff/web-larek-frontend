import { IProduct } from "../types";
import { CDN_URL } from "../utils/constants";
import { IEvents } from "./base/events";
import { Component } from "./Component";

export class ProductCard extends Component<IProduct>{
  protected events: IEvents;
  protected cardCategory: HTMLElement;
  protected categoryClassList: Record<string, string> = {
    'софт-скил': 'card__category_soft',
    'хард-скил': 'card__category_hard',
    'другое': 'card__category_other',
    'дополнительное': 'card__category_additional',
    'кнопка': 'card__category_button'
  }
  protected cardTitle: HTMLElement;
  protected cardImage: HTMLImageElement;
  protected cardPrice: HTMLElement;
  protected productId: string;
  protected _description: HTMLElement;
  protected buyBtn: HTMLButtonElement;
  protected removeBtn: HTMLButtonElement;
  protected prodcutIndex: HTMLElement;
  
  constructor(protected container: HTMLElement, events: IEvents) {
    super(container)
    this.events = events;

    this._description = this.container.querySelector('.card__text');
    this.cardCategory = this.container.querySelector('.card__category');
    this.cardTitle = this.container.querySelector('.card__title');
    this.cardImage = this.container.querySelector('.card__image');
    this.cardPrice = this.container.querySelector('.card__price');
    this.buyBtn = this.container.querySelector('.button');
    this.removeBtn = this.container.querySelector('.basket__item-delete');
    this.prodcutIndex = this.container.querySelector('.basket__item-index');
    
    this.handleClick = this.handleClick.bind(this);
    ///Проверяю не открыта ли карточка
    if(!this._description) {
      this.container.addEventListener('click', this.handleClick);
    }

    if(this.buyBtn) {
      this.buyBtn.addEventListener('click', () => {
        this.events.emit('product: addToCart', {product:this});
      })
    }

    if(this.removeBtn) {
      this.removeBtn.addEventListener('click', () => {
        this.events.emit('product: removeFromCart', {product: this});
      })
    }
  }

  ///Хэндлер клика на карточку
  handleClick() {
    this.events.emit('product: selected', {product:this});
  }

  ///Удаление слушателя с карточки, во избежание повторных открытий
  removeListener() {
    this.container.removeEventListener('click', this.handleClick);
  }

  render(productData: Partial<IProduct>) {
    const {...otherProductData} = productData;
    return super.render(otherProductData);
  }

  ///Сеттер порядкового номера
  set index(index: number) {
    this.prodcutIndex.textContent = index.toString();
  }

  ///Сеттер категории
  set category (category: string) {
    this.cardCategory.textContent = category;
    this.cardCategory.classList.remove(
      'card__category_soft',
      'card__category_hard',
      'card__category_other',
      'card__category_additional',
      'card__category_button');
    this.cardCategory.classList.add(this.categoryClassList[category]);
  }

  ///Сеттер титла
  set title (title: string) {
    this.cardTitle.textContent = title;
  }

  ///Сеттер описания
  set description (desc: string) {
    if (this._description) {
      this._description.textContent = desc;
    }
  }

  ///Сеттер изображения
  set image (image: string) {
    this.cardImage.src = `${CDN_URL}${image}`;
  }

  ///Сеттер цены
  set price (price: string) {
    if (price === null){
      this.cardPrice.textContent = 'Бесценно';
    } else {
      this.cardPrice.textContent = `${price} синапсов`;
    }
  }

  ///Сеттер для деактивации кнопки в корзину
  set selected(value: boolean) {
    if (value || this.cardPrice.textContent === 'Бесценно') {
      this.buyBtn.setAttribute('disabled', 'true');
    } else {
      this.buyBtn.removeAttribute('disabled');
    }
  }

  set id(id) {
    this.productId = id;
  }

  get id() {
    return this.productId;
  }
}