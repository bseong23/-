import { Router } from "express";
import { productModel } from "../db/models/product-model.js";
import { errorHandler } from '../middlewares/error-handler.js';
import { loginRequired } from '../middlewares/login-required.js';
import { checkAdmin } from '../middlewares/check-admin.js';

//express 라우터 가져오기
const productRouter = new Router();

//상품 등록
productRouter.post("/", loginRequired, checkAdmin, async (req, res, next) => {
    try {
        const productInfo = req.body;

        // 데이터베이스에 저장된 제품 수를 확인
        const productCount = await productModel.countDocuments({});
        
        // 오늘날짜 6자리 생성
        const dateNum = new Date().toISOString().slice(2, 10).replace(/-/g, '');

        // 일련 번호 생성 (00001부터 시작)
        let serialNum = (productCount + 1).toString().padStart(5, '0');

        // productId 생성
        let productId = `P${dateNum}${serialNum}`;

        // 중복된 productId가 있는지 확인
        let existingProduct = await productModel.findOne({ productId });

        // 중복된 productId가 있는 경우, 새로운 일련 번호 생성
        if (existingProduct) {
            const regex = new RegExp(`^P${dateNum}`);
            const lastProduct = await productModel.findOne({ productId: regex }).sort({ productId: -1 });

            if (lastProduct) {
                const lastSerialNum = parseInt(lastProduct.productId.slice(-5));
                serialNum = (lastSerialNum + 1).toString().padStart(5, '0');
                productId = `P${dateNum}${serialNum}`;
            }
        }

        // productInfo에 productId 추가
        const newProductInfo = {
            ...productInfo,
            productId
        };

        // 새 제품 생성
        const createdNewProduct = await productModel.create(newProductInfo);

        // 생성된 제품 정보를 응답으로 보냄
        res.status(201).json({
            success: true,
            product: createdNewProduct,
        });
    } catch (error) {
        next(error);
    }
});

// 모든 상품 가져오기
productRouter.get("/", async (req, res) => {
    try {
        const products = await productModel.findAll();
        res.json(products);
    } catch (error) {
        next(error);
    }
});

//ID로 특정 상품 가져오기
productRouter.get("/:productId", async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await productModel.findById(productId);
        res.json(product);
    } catch (error) {
        next(error);
    }
});


//상품 ID로 상품 삭제하기
productRouter.delete("/:productId", loginRequired, checkAdmin, async (req, res) => {
    try {
        const { productId } = req.params;
        await productModel.delete(productId);
        res.json({
            success: true,
            message: '상품이 삭제되었습니다.'
        });
    } catch(error){
        next(error);
    }
});

// 상품 ID로 상품 수정하기
productRouter.put("/:productId", loginRequired, checkAdmin, async (req, res, next) => {
    try {
        const { productId } = req.params;
        const { name, imageUrl, price, stock, attribute } = req.body;

        const originProductData = await productModel.findById(productId);

        if (!originProductData) {
            return res.status(404).json({
                success: false,
                message: '없는 상품 정보입니다.'
            });
        }

        const productInfo = {
            name,
            imageUrl,
            price,
            stock,
            category,
            attribute
        };

        const updatedProduct = await productModel.update(productId, productInfo);

        res.status(200).json({
            success: true,
            "업데이트된 상품 이름": updatedProduct.name
        });
    } catch (error) {
        next(error);
    }
});




//에러 핸들러 미들웨어 추가
productRouter.use(errorHandler);

export { productRouter };