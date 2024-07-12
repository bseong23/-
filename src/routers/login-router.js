/*

URL: /routers/login-router.js
Method: POST
설명: 로그인 관련 기능 구현
Request Body:
{
	"email": "string",
	"password": "string"
}

Response Body:
{
    "success": true,
    "message": "로그인에 성공했습니다.",
    "token": "string"
}

*/


import { Router } from "express";
import { userService } from "../services/user-service.js";
import { errorHandler } from '../middlewares/error-handler.js';
import { loginRequired } from '../middlewares/login-required.js';
import { validateUserSchema } from '../middlewares/validate-userschema.js';
import is from "@sindresorhus/is";

//express 라우터 가져오기
const loginRouter = new Router();

//로그인 api
loginRouter.post('/', validateUserSchema, async (req, res, next) => {
	try {
		//req.body에서 email, password 가져오기
    	const { email, password } = req.body;

    	// application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    	if (is.emptyObject(req.body)) {
    		throw new Error(
        	"headers의 Content-Type을 application/json으로 설정해주세요"
      	);
		}

    //이메일, 비밀번호가 없는 경우 에러 메시지 반환
    if (!email || !password) {
    	return res.status(400).json({
        	success: false,
        	message: '이메일과 비밀번호를 입력해 주세요.'
      	});
    }

    //로그인 진행 (로그인 성공 시 jwt 토큰을 프론트에 보내 줌)
    const userToken = await userService.getUserToken({ email, password });

    //토큰이 없는 경우 에러 메시지 반환
    if (!userToken) {
    	return res.status(401).json({
        	success: false,
        	message: '로그인에 실패했습니다.'
      	});
    }

    //토큰이 있는 경우 토큰을 프론트에 보냄
    res.status(200).json({
		success: true,
    	message: '로그인에 성공했습니다.',
    	token: userToken
    });
  	} catch (error) {
    	next(error);
  	}
});

//에러 핸들러 미들웨어 추가
loginRouter.use(errorHandler);

export { loginRouter };
