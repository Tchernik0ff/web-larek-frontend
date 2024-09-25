import { EventEmitter } from './components/base/events';
import { CartData } from './components/CartData';
import { ProductsData } from './components/ProductsData';
import './scss/styles.scss';
import { IApi } from './types';
import { API_URL, settings } from './utils/constants';
import { Api } from './components/base/api';
import { AppApi } from './components/AppApi';
import { ProductCard } from './components/ProductCard';
import { MainPage } from './components/MainPage';
import { cloneTemplate } from './utils/utils';
import { Modal } from './components/common/Modal';
import { Cart } from './components/Cart';
import { PaymentForm } from './components/PaymentForm';
import { IOrderPost } from './types';
import { Order } from './components/OrderData';
import { ContactForm } from './components/ContactsForm';
import { FinalazeOrder } from './components/FinalazeOrder';

///Необходимые темплейты
const prodcutCardTemplate = document.getElementById('card-catalog') as HTMLTemplateElement;
const cartTemplate = document.getElementById('basket') as HTMLTemplateElement;
const fullProductCard = document.getElementById('card-preview') as HTMLTemplateElement;
const productInCartTemplate = document.getElementById('card-basket') as HTMLTemplateElement;
const сontactsFormTemplate = document.getElementById('contacts') as HTMLTemplateElement
const paymentFormTemplate = document.getElementById('order') as HTMLTemplateElement;
const finalizeOrder = document.getElementById('success') as HTMLTemplateElement;

///Экземпляры классов
const events = new EventEmitter;
const productsData = new ProductsData(events);
const cartData = new CartData(events);
const cart = new Cart(cloneTemplate(cartTemplate), events);
const baseApi: IApi = new Api(API_URL, settings);
const api = new AppApi(baseApi);
const mainPage = new MainPage(document.querySelector('.page'), events);
const modal = new Modal(document.getElementById('modal-container'), events);
const сontactsForm = new ContactForm(cloneTemplate(сontactsFormTemplate), events);
const paymentForm = new PaymentForm(cloneTemplate(paymentFormTemplate), events);
const finalOrder = new FinalazeOrder(cloneTemplate(finalizeOrder), events);
const order = new Order();

///Получение карточек товаров
Promise.all([api.getProductCards()])
     .then((data) => {
        productsData.items = data[0].items;
        events.emit('data: loaded');
     })

///Обработка события когда были получены карточки
events.on('data: loaded', () => {
    const productArray = productsData.items.map((product) => {
        const productInstant = new ProductCard(cloneTemplate(prodcutCardTemplate), events);
        return productInstant.render(product)
    })
    mainPage.render({catalog: productArray});
})

///Обработка события открытия модального окна
events.on('modal: open', () => {
    mainPage.lockElement();
}) 

///Обработка события закрытия модального окна
events.on('modal: close', () => {
    mainPage.unlockElement();
})

///Обработка события клика на карточку товара
events.on('product: selected', (data: {product: ProductCard}) => {
    const card = new ProductCard(cloneTemplate(fullProductCard), events);
    const { product } = data;
    const {price,description,image,id,title,category, selected} = productsData.getProductCard(product.id)
    const selectedProduct = {price,description,image,id,title,category, selected};
    modal.render({
		_content: card.render({
			title: selectedProduct.title,
            image: selectedProduct.image,
            description: selectedProduct.description,
            price: selectedProduct.price || null,
            category: selectedProduct.category,
            id: selectedProduct.id,
            selected: cartData.hasInCart(selectedProduct.id)
		}),
	});
})

///Обработка события добавления товара в корзину
events.on('product: addToCart', (data: {product: ProductCard}) => {
    const { product } = data;
    const { price, id, title } = productsData.getProductCard(product.id);
    const testTestCart = { price, id, title, index: cartData.items.length + 1 };
    cartData.addItem(testTestCart);
    modal.close();
})

///Обработка события открытия корзины
events.on('cart: open', () => {
    const cartsItem = cartData.items.map((items) => {
        const productInCart = new ProductCard(cloneTemplate(productInCartTemplate), events);
        productInCart.removeListener();///Удаляю слушатель с карточки в корзине
        return productInCart.render(items) 
    })
    
    cart.itemsList = cartsItem;
    cart.setButton(cartsItem.length == 0);
    modal.render({
        _content: cart.render({
        total: cartData.total,
        }
    )})
})

///Обработка события удаления товара из корзины
events.on('product: removeFromCart', (data: {product: ProductCard}) => {
    const { product } = data;
    const { id } = productsData.getProductCard(product.id);
    const cartProduct = { id }
    cartData.removeItem(cartProduct.id);
    
    const cartsItem = cartData.items.map((items) => {
        const productInCart = new ProductCard(cloneTemplate(productInCartTemplate), events)
        productInCart.index = items.index;
        productInCart.removeListener();
        return productInCart.render(items) 
    })
    cart.itemsList = cartsItem
    cart.setButton(cartsItem.length === 0);
})

///Обработка события изменения товаров в корзине
events.on('cartItem: changed', () => {
    mainPage.cartCounter = cartData.updateCartCounter();
    cart.total = cartData.total;
})


///Обработка события оформления заказа
events.on('order: start', () => {
    order.resetOrder();
    paymentForm.clearValidation();
    сontactsForm.clearValidation();
    modal.render({
        _content: paymentForm.render({
           buttons: 'disabled',
        })
    })
})

///Обработка события завершения заполнения формы
events.on('firstStepForm: complete', (data: any) => {
    order._addres = data.address;
    order._payment = data.paymentMethod;
    order._items = cartData.getItemIds();
    order._total = cartData.total;
    modal.render({
        _content: сontactsForm.render({})
    })
})

///Обработка события размещения заказа
events.on('order: place', (data: any) => {
    order._email = data.email;
    order._phone = data.phone;
    сontactsForm.setAwaitBtn()
    baseApi.post<IOrderPost>(`/order/`, order, 'POST')
      .then(() => {
        modal.render({
        _content: finalOrder.render({
            _totalCost: cartData.total.toString(),
        })
        }) 
        cartData.resetCartData();
        mainPage.cartCounter = cartData.updateCartCounter();
        сontactsForm.setAwaitBtn();
      })
      .catch((error) => {
        ///Обработка ошибки
        console.error(error);
      });
});

///Обработка события завершения заказа
events.on('order: final', () => {
    modal.close();
})

///Подписка на все события, для отладки.
// events.onAll((event) => {
//     console.log(event.eventName, event.data)
// })