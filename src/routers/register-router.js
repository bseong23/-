/*
URL: /routers/register-router.js
Method: POST
설명: 회원가입 기능 구현
Request Body:
{
	"fullName": "string",
    "email": "string",
    "password": "string"
}

Response Body:
{
    "success": true,
    "message": "회원가입에 성공했습니다.",
    "user": {
        "id": "string",
        "fullName": "string",
        "email": "string"
    }
}
*/


import { Router } from "express";
import { userService } from "../services/user-service.js";
import { errorHandler } from '../middlewares/error-handler.js';
import { validateUserSchema } from '../middlewares/validate-userschema.js';

//express 라우터 가져오기
const registerRouter = new Router();

//회원가입 api
registerRouter.post("/", validateUserSchema, async (req, res, next) => {
	try {
		//req.body에서 fullName, email, password 가져오기
    	const { fullName, email, password, phoneNumber, role } = req.body;

    	//예외처리: fullName, email, password가 없는 경우 에러 메시지 반환
    	if (!fullName || !email || !password || !phoneNumber) {
		return res.status(400).json({
        	success: false,
        	message: "빈 칸을 모두 채워주세요."
      	});
    	}

    	//회원가입 절차(addUser함수) 거쳐서 db에 저장
    	const newUser = await userService.addUser({ fullName, email, password, phoneNumber, role });

    	//프론트에 추가된 유저의 db 데이터 보내기
    	res.status(201).json({
      		success: true,
      		message: "회원가입에 성공했습니다.",
      		user: {
        		id: newUser._id,
        		fullName: newUser.fullName,
        		email: newUser.email,
            password: newUser.pssword,
            phoneNumber: newUser.phoneNumber,
            role: newUser.role,
      		},
    	});
  	} catch (error) {
    	next(error);
  	}
});

//에러 핸들러 미들웨어 추가
registerRouter.use(errorHandler);

export { registerRouter };
