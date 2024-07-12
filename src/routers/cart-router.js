/*
URL: /routers/cart-router.js
Method: POST
설명: 장바구니에 물건 넣기
Request Body:
{
    "productId": "number",
    "quantity": "number"
}
Response Body:
{
    "success": true,
    "message": "장바구니에 물건이 담겼습니다.",
    "cart": {
        "productId": "number",
        "quantity": "number"
    }
}

-
URL: /routers/cart-router.js
Method: DELETE
설명: 장바구니에 물건 빼기
Request Body:
{
    "productId": "number"
}

Response Body:
{
    "success": true,
    "message": "장바구니에서 물건을 뺐습니다.",
}

-
URL: /routers/cart-router.js
Method: DELETE
설명: 장바구니 비우기
Request Body: 없음
Response Body:
{
    "success": true,
    "message": "장바구니가 비워졌습니다."
}

-
URL: /routers/cart-router.js
Method: PUT
설명: 장바구니 내 물건 개수 수정
Request Body:
{
    "productId": "number",
    "quantity": "number"
}

Response Body:
{
    "success": true,
    "cart": {
        "productId": "number",
        "quantity": "number"
    }
}

-
*/