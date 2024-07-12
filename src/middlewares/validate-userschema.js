import { body } from 'express-validator';

//유저 정보 유효성 검사
const validateUserSchema = [
    body('email')
    .isEmail()
    .withMessage('유효한 이메일을 입력해 주세요.'),

    body('fullName')
    .isString()
    .withMessage('유효한 이름을 입력해 주세요.'),

    body('password')
    .isLength({ min: 5, max: 20 })
    .withMessage('비밀번호는 5자 이상, 20자 이하여야 합니다.'),

    body('phoneNumber')
    .optional()
    .isMobilePhone()
    .withMessage('유효한 전화번호를 입력해 주세요.'),

    body('address.postalCode')
    .optional()
    .isPostalCode('any')
    .withMessage('유효한 우편번호를 입력해 주세요.'),

    body('address.address1')
    .optional()
    .isString()
    .withMessage('유효한 주소를 입력해 주세요.'),

    body('address.address2')
    .optional()
    .isString()
    .withMessage('유효한 주소를 입력해 주세요.'),

];

export { validateUserSchema };
