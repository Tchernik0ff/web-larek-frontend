///Интерфейс продукта
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

///Интерфейс заказа
export interface IOrder {
  payment: string;
  email: string;
  phone: string;
  addres: string;
  total: number;
  items: string[];
}

///Интерфейс ответа с карточками от сервера
export interface IProductsData {
  total: number;
  products: IProduct[];
  preview: string | null;
  getProductCard(productId: string): IProduct;
  addToCart(productId: string): void; // Метод для добавления товара в корзину
}

///Интерфейс объекта корзины
export interface ICart {
  items: TProductInCart[];
  total: number;
  addItem(product: TProductInCart): void; // Метод для добавления товара в корзину
  removeItem(productId: string): void; // Метод для удаления товара из корзины
  calculateTotalPrice(): number; // Метод для расчета общей стоимости 
}

// Интерфейс для элемента корзины
export interface ICartItem {
  product: TProductInCart;
}

// Интерфейс для формы оформления заказа
export interface IOrderForm extends IOrder{
  validateForm(): boolean;
  submitOrder(order: IOrder): void;
}

///Данные товара на главной, без подробного описания
export type TProductPreview = Pick<IProduct, 'id' | 'image' | 'title' | 'category' | 'price'>

///Данные товара в корзине
export type TProductInCart = Pick<IProduct, 'id' | 'title' | 'price'>

///Данные товаров в массиве
export type TOrderItems = Pick<IProduct, 'id'>

///Данные списанного баланса в модалке успешного оформленного заказа
export type TOrderTotalSummary = Pick<IOrder, 'total'>
