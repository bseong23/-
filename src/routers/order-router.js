import { Router } from "express";
import jwt from "jsonwebtoken";
import { userService } from "../services/user-service.js";
import { errorHandler } from '../middlewares/error-handler.js';
import { loginRequired } from '../middlewares/login-required.js';
import { validateUserSchema } from '../middlewares/validate-userschema.js';
import { orderModel } from "../db/models/order-model.js";
import { userModel } from "../db/models/user-model.js";
import { checkAdmin } from "../middlewares/check-admin.js";

//express 라우터 가져오기
const orderRouter = new Router();

// JWT secretKey 가져오기
const secretKey = process.env.JWT_SECRET_KEY || "secret-key";

// 주문 등록
orderRouter.post("/", validateUserSchema, async (req, res, next) => {
    try {
        let userInfo = {};
        let userStatus = "";

        // 세션에서 JWT 토큰을 가져옴
        const userToken = req.session?.token;

        // JWT 토큰이 있으면 로그인된 유저로 처리
        if (userToken) {
            try {
                const jwtDecoded = jwt.verify(userToken, secretKey);
                // 로그인된 유저 정보를 가져옴
                const userId = jwtDecoded.userId;
                const user = await userModel.findById(userId);
                userStatus = "회원";
                userInfo = {
                    userName: user.name,
                    userEmail: user.email,
                    userAddress: user.address,
                    userPhoneNumber: user.phoneNumber,
                };
                
            } catch (error) {
                return res.status(403).json({
                    result: "forbidden-approach",
                    reason: "로그인한 유저만 사용할 수 있는 서비스입니다.",
                });
            }
        } else {
            // 토큰이 없으면 비로그인 유저로 처리하여 body에서 유저 정보를 가져옴
            const { userName, userEmail, userAddress, userPhoneNumber } = req.body;
            userInfo = {
                userName,
                userEmail,
                userAddress,
                userPhoneNumber,
            };
            userStatus = "비회원";
        }

        // 주문 정보 받아옴
        const orderInfo = req.body;

        // 유저 정보를 주문 정보에 추가
        orderInfo.user = userInfo;

        // 데이터베이스에 저장된 주문 수를 확인
        const orderCount = await orderModel.countDocuments({});

        // 오늘 날짜 6자리 생성
        const dateNum = new Date().toISOString().slice(2, 10).replace(/-/g, '');

        // 주문 번호 생성
        const orderNumber = `${dateNum}-${orderCount + 1}`;

        // 주문 정보 저장
        const newOrder = await orderModel.create({
            ...orderInfo,
            orderNumber,
            userStatus,
        });

        res.status(201).json({
          success: true,
          order: newOrder,
        });
    } catch (error) {
        next(error);
    }
});

// 주문 ID로 주문 수정하기
orderRouter.put("/:orderId", async (req, res, next) => {
    try {
        // orderNumber를 받아옴
        const { orderNumber } = req.params;

        // 주문 정보를 받아옴. 단, 결제 수단과 배송 메시지만 수정 가능
        const { paymentMethod, customerMessage } = req.body;

        // orderNumber를 통해 원 주문 정보 저장
        const originOrderData = await orderModel.findById(orderNumber);

        // 주문 정보가 없을 경우
        if (!originOrderData) {
            return res.status(404).json({
                success: false,
                message: '없는 주문 정보입니다.'
            });
        }

        // 수정할 주문 정보
        const orderInfo = {
            paymentMethod,
            customerMessage
        };

        // 주문 정보 업데이트
        const updatedOrder = await orderModel.update(orderNumber, orderInfo);

        res.status(200).json({
            success: true,
            "업데이트된 주문ID": updatedOrder.orderNumber
        });
    } catch (error) {
        next(error);
    }
});

// 주문 ID로 주문 삭제하기
orderRouter.delete("/:orderId", async (req, res, next) => {
    try {
        // orderNumber를 받아옴
        const { orderNumber } = req.params;

        // 주문 삭제
        await orderModel.delete(orderNumber);

        res.json({
            success: true,
            message: '주문이 삭제되었습니다.'
        });
    } catch (error) {
        next(error);
    }
});

//전체 주문 조회
orderRouter.get("/", checkAdmin, loginRequired, async (req, res, next) => {
    try {
        // 전체 주문 조회
        const orders = await orderModel.findAll();
        res.json(orders);
    } catch (error) {
        next(error);
    }
});


export { orderRouter };
