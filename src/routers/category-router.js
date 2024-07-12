import { Router } from "express";
import { categoryModel } from '../db/models/category-model.js';
import { errorHandler } from '../middlewares/error-handler.js';
import { loginRequired } from '../middlewares/login-required.js';
import { checkAdmin } from '../middlewares/check-admin.js';

//express 라우터 가져오기
const categoryRouter = new Router();

//카테고리 등록
categoryRouter.post("/", loginRequired, checkAdmin, async (req, res, next) => {
    try {
        const categoryInfo = req.body;

        // 새 제품 생성
        const createdNewCategory = await categoryModel.create(categoryInfo);

        // 생성된 제품 정보를 응답으로 보냄
        res.status(201).json({
            success: true,
            category: createdNewCategory,
        });
    } catch (error) {
        next(error);
    }
});

// 카테고리 전부 가져오기
categoryRouter.get("/", loginRequired, checkAdmin, async (req, res) => {
    try {
        const categories = await categoryModel.findAll();
        res.json(categories);
    } catch (error) {
        next(error);
    }
});

//카테고리 수정
categoryRouter.put("/:category", loginRequired, checkAdmin, async (req, res, next) => {
    try {
        const originCategory = req.params.category;
        const newCategoryData = req.body;

        if (!newCategoryData.category) {
            return res.status(400).json({ success: false, message: "새 카테고리 이름이 필요합니다." });
        }

        const updatedCategory = await categoryModel.update(originCategory, newCategoryData.category);

        if (!updatedCategory) {
            return res.status(404).json({ success: false, message: "없는 카테고리입니다." });
        }

        res.json({
            success: true,
            category: `${originCategory} => ${newCategoryData.category}`,
        });
    } catch (error) {
        next(error);
    }
});

//카테고리 삭제
categoryRouter.delete("/:category", loginRequired, checkAdmin, async (req, res, next) => {
    try {
        const categoryName = req.params.category;
        await categoryModel.delete(categoryName);
        res.json({
            success: true,
            message: '카테고리가 삭제되었습니다.'
        });
    } catch (error) {
        next(error);
    }
});

//에러 핸들러 미들웨어 추가
categoryRouter.use(errorHandler);

export { categoryRouter };
