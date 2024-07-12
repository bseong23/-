/*
Auhtorization Required
URL: /routers/my-user-router.js
Method: GET
설명: 내 정보 조회
Request Body: 없음
Response Body:
{
	"success": true,
    "user": {
        "id": "string",
        "fullName": "string",
        "email": "string"
    }
}

-
Auhtorization Required
URL: /routers/my-user-router.js
Method: PUT
설명: 내 정보 수정
Request Body:
{
    "fullName": "string",
    "email": "string",
    "password": "string"
}

Response Body:
{
    "success": true,
    "message": "내 정보가 수정되었습니다.",
    "user": {
        "id": "string",
        "fullName": "string",
        "email": "string"
    }
}

-
Auhtorization Required
URL: /routers/my-user-router.js
Method: DELETE
설명: 회원 탈퇴
Request Body: 없음
Response Body:
{
    "success": true,
    "message": "회원 탈퇴에 성공했습니다."
}

예외처리에 주의를 기울여 작업할 것.

*/


import { Router } from "express";
import { userService } from "../services/user-service.js";
import { userModel } from "../db/models/user-model.js";
import { errorHandler } from '../middlewares/error-handler.js';
import { loginRequired } from '../middlewares/login-required.js';
import { validateUserSchema } from '../middlewares/validate-userschema.js';
import is from "@sindresorhus/is";

//express 라우터 가져오기
const userRouter = new Router();

//내 정보 조회
userRouter.get('/', loginRequired, validateUserSchema, async (req, res, next) => {
    try {
        // userId 가져오기
        const userId = req.user.userId;

        //findById 함수로 이메일로 유저 정보 가져오기
        const user = await userModel.findById(userId);

        //user가 없는 경우 에러 메시지 반환
        if (!user) {
            return res.status(404).json({
            success: false,
            message: '없는 유저정보입니다.'
            });
        }

        //user가 있는 경우 user 정보 json화해서 프론트에 보냄
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        next(error);
    }
});


//내 정보 수정
userRouter.patch("/", loginRequired, validateUserSchema, async (req, res, next) => {
    try{
        // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
        if (is.emptyObject(req.body)) {
        	throw new Error(
            	"headers의 Content-Type을 application/json으로 설정해주세요"
          	);
        }

        //getUsers 함수로 원래 유저 정보 가져와서 originUserData에 저장
        const originUserData = await userModel.findById(req.body.userId);

        //req.body에서 값 가져와서 저장
        //fullName이 빈 값이라면, 원래 값으로 대체하도록 처리하는거 추가
        const { fullName, email, password, phoneNumber, role, currentPassword } = req.body;

        //originUserData가 없는 경우 에러 메시지 반환
        if(originUserData === null){
            return res.status(404).json({
                success: false,
                message: '없는 유저정보입니다.'
            });
        }

        //userInfoRequired에 userId, currentPassword 저장 (유저 정보 수정을 위해 필요한 정보들)
        const userInfoRequired = {
            userId: originUserData.id,
            currentPassword,
        }

        //toUpdate에 업데이트 할 정보들 삽입
        const toUpdate = {
        	...(fullName && { fullName }),
        	...(email && { email }),
        	...(password && { password }),
        	...(phoneNumber && { phoneNumber }),
        };

        //userService의 setUser 함수로 유저 정보 수정
        const userDataUpdate = await userService.setUser(userInfoRequired, toUpdate);
        
        //수정된 유저 정보를 json화해서 프론트에 보냄
        res.status(200).json({
            success: true,
            message: '내 정보가 수정되었습니다.',
            user: userDataUpdate,
        });
    }catch(error){
        next(error);
    }
});

userRouter.delete("/", loginRequired, validateUserSchema, async (req, res, next) => {
    try {
        // 회원 탈퇴를 위해 email과 password를 받아옴
        const { email, password } = req.body;

        // email과 password가 없는 경우 에러 메시지 반환
        if (!email || !password) {
            return res.status(400).json({
                result: "error",
                reason: "Email and password are required"
            });
        }

        // userService의 deleteUser 함수를 사용하여 회원 탈퇴 처리
        await userService.deleteUser({ email, password });

        // 회원 탈퇴 성공 메시지를 응답으로 보냄
        res.status(200).json({
            success: true,
            message: '회원 탈퇴에 성공했습니다.'
        });
    } catch (error) {
        next(error);
    }
});


//에러 핸들러 미들웨어 추가
userRouter.use(errorHandler);

export { userRouter };
