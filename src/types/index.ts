///Интерфейс продукта
export interface IProduct {
  id: string;
  description: HTMLElement;
  image: string;
  title: string;
  category: string;
  price: number | null;
  selected: boolean;
}

export interface IOrderPost {
  id: string[],
  total: number;
}

///Интерфейс заказа
export interface IOrder {
  _payment: string;
  _email: string;
  _phone: string;
  _addres: string;
  _total: number;
  _items: string[];
}

///Интерфейс ответа с карточками от сервера
export interface IProductsData {
  total?: number;
  items: IProduct[];
}

///Интерфейс объекта корзины
export interface ICart {
  items: TProductInCart[];///Переделать на один итем
  total: number;
}

// Интерфейс для элемента корзины
export interface ICartItem {
  product: TProductInCart;
}

export interface TProductInCart {
  id: string,
  title: string,
  price: number | null,
  index: number
}

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
  baseUrl: string;
  get<T>(url: string): Promise<T>;
  post<T>(url: string, data: object, method?: ApiPostMethods): Promise<T>;
}
