import { IApi, IOrderPost, IProductsData } from "../types";

export class AppApi {
  private _baseApi: IApi;

  constructor(baseApi: IApi) {
    this._baseApi = baseApi;
  }

  getProductCards(): Promise<IProductsData> {
    return this._baseApi.get<IProductsData>(`/product/`).then((data: IProductsData) => {
      return {
        total: data.total,
        items: data.items
      };
    });
  }
  
  post(): Promise<IOrderPost> {
    return this._baseApi.post<IOrderPost>(`/order/`,{}, 'POST').then((data: IOrderPost) => {
      return {
        id: data.id,
        total: data.total
      }
    })
  }
}