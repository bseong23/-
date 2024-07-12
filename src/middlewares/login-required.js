import jwt from "jsonwebtoken";

function loginRequired(req, res, next) {
    // Authorization 헤더를 통해 토큰 가져오기
    const authHeader = req.headers['authorization'];

    // 헤더가 존재하는지와 Bearer로 시작하는지 확인
    if (authHeader && authHeader.startsWith('Bearer ')) {
        // Bearer와 JSON 문자열을 분리
        const tokenJsonString = authHeader.slice(7); // "Bearer " 이후의 문자열

        try {
            // JSON 문자열을 파싱하여 실제 토큰을 추출.
            const tokenObject = JSON.parse(tokenJsonString);
            const userToken = tokenObject.token;

            // 이 토큰은 jwt 토큰 문자열이거나, 혹은 "null" 문자열이거나, undefined임
            // 토큰이 "null" 일 경우, login_required 가 필요한 서비스 사용을 제한함
            if (!userToken || userToken === "null") {
                console.log("서비스 사용 요청이 있습니다.하지만, Authorization 토큰: 없음");
                res.status(403).json({
                    result: "forbidden-approach",
                    reason: "로그인한 유저만 사용할 수 있는 서비스입니다.",
                });
            return;
            }
            const secretKey = process.env.JWT_SECRET_KEY || "secret-key";
            const jwtDecoded = jwt.verify(userToken, secretKey);

            const userId = jwtDecoded.userId;
            const role = jwtDecoded.role;

            req.user = { userId, role };

            next();
        } catch (error) {
            // JSON 문자열 파싱에 실패하면 403 에러를 반환합니다.
            res.status(403).json({
                result: "forbidden-approach",
                reason: "정상적인 토큰이 아닙니다.",
            });
            return;
        }
    }
}

export { loginRequired };
