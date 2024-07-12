import { Router } from "express";
import { userService } from "../services/user-service.js";
import { userModel } from "../db/models/user-model.js";
import { validateUserSchema } from '../middlewares/validate-userschema.js';
import { errorHandler } from '../middlewares/error-handler.js';
import { checkAdmin } from '../middlewares/check-admin.js';
import { loginRequired } from '../middlewares/login-required.js';
import { body } from 'express-validator';

//express 라우터 가져오기
const adminRouter = new Router();

//모든 유저 정보 가져오기
adminRouter.get("/", loginRequired, checkAdmin, async (req, res, next) => {
    try {
        //모든 유저 정보 가져오기
        const users = await userModel.findAll();

        //유저 정보가 없는 경우 에러
        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: '유저 정보가 없습니다.',
            });
        }

        //프론트에 유저 정보 보내기
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
});

//email로 특정 유저 정보 가져오기
adminRouter.get("/", loginRequired, checkAdmin, validateUserSchema, async (req, res, next) => {
    try {
        //req.body에서 email 가져오기
        const email = req.body.email;

        //이메일이 없는 경우 에러 메시지 반환
        if(!email){
            return res.status(400).json({
                success: false,
                message: '이메일을 입력해 주세요.'
            });
        }

        //findByEmail 함수로 유저 정보 가져와서 users에 저장
        const users = await userModel.findByEmail();

        //유저 정보가 없는 경우 에러
        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: '유저 정보가 없습니다.',
            });
        }
        
        //프론트에 유저 정보 보내기
        res.status(200).json(users);
        } catch (error) {
        next(error);
        }
    });

//에러 핸들러 미들웨어 추가
adminRouter.use(errorHandler);

//라우터 내보내기
export { adminRouter };
