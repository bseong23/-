import cors from "cors";
import express from "express";
import { viewsRouter } from "./routers/views-router.js";
import { userRouter } from "./routers/user-router.js";
import { loginRouter } from "./routers/login-router.js";
import { registerRouter } from "./routers/register-router.js";
import { adminRouter } from "./routers/admin-router.js";
import { productRouter } from "./routers/product-router.js";
import { orderRouter } from "./routers/order-router.js";
import { categoryRouter } from "./routers/category-router.js";
import { errorHandler } from "./middlewares/error-handler.js";
import { validateUserSchema } from "./middlewares/validate-userschema.js";
import { loginRequired } from "./middlewares/login-required.js";
import connectDB from "../config/database.js";

const app = express();

const port = 3000;
// DB 연결
connectDB();

// CORS 에러 방지
app.use(cors());

// Content-Type: application/json 형태의 데이터를 인식하고 핸들링할 수 있게 함.
app.use(express.json());

// Content-Type: application/x-www-form-urlencoded 형태의 데이터를 인식하고 핸들링할 수 있게 함.
app.use(express.urlencoded({ extended: false }));

// html, css, js 라우팅
app.use(viewsRouter);

// api 라우팅
console.log('라우터 설정 시작');
app.use('/api/login', loginRouter);
console.log('Login 라우터 설정 완료');
app.use('/api/register', registerRouter);
console.log('Register 라우터 설정 완료');
app.use("/api/users", userRouter);
console.log('User 라우터 설정 완료');
app.use("/api/admin", adminRouter);
console.log('Admin 라우터 설정 완료');
app.use("/api/product", productRouter);
console.log('Products 라우터 설정 완료');
app.use("/api/orders", orderRouter);
console.log('Orders 라우터 설정 완료');
app.use("/api/category", categoryRouter);
console.log('category 라우터 설정 완료');

console.log('라우터 설정 완료');

// 순서 중요 (errorHandler은 다른 일반 라우팅보다 나중에 있어야 함)
// 그래야, 에러가 났을 때 next(error) 했을 때 여기로 오게 됨
app.use(errorHandler);

export { app };
