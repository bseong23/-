// 역할이 admin인지 체크하기
const checkAdmin = (req, res, next) => {
    try {
        // req.user에서 role 가져오기
        console.log(req.user);
        const { role } = req.user;

        // 역할이 'admin'이 아닌 경우 접근 거부
        if (role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: '접근 권한이 없습니다.',
            });
        }

        // 역할이 'admin'인 경우 다음 미들웨어로 진행
        next();
    } catch (error) {
        next(error);
    }
};

export { checkAdmin };
