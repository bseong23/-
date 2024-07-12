import { productModel } from"../db/models/product-model.js";

class ProductService {
  constructor(productModel){
    this.productModel = productModel;
  }

  async addProduct(productInfo) {
    const { name, imageUrl, price, stock, category, productId }= productInfo;

    const newProductInfo = { name, imageUrl, price, stock, category, productId };

    const createdNewProduct = await this.productModel.create(newProductInfo);

    return createdNewProduct;
  }
}

const productService = new ProductService(productModel);

export { productService };