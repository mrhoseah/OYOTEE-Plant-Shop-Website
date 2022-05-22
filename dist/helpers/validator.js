"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.validateCoupon = exports.validateReview = exports.validateCategory = void 0;
var joi_1 = __importDefault(require("joi"));
var validateCategory = function (category) {
    var JoiSchema = joi_1["default"].object({
        name: joi_1["default"].string().required(),
        description: joi_1["default"].string().required()
    }).options({ abortEarly: false });
    return JoiSchema.validate(category);
};
exports.validateCategory = validateCategory;
var validateReview = function (review) {
    var JoiSchema = joi_1["default"].object({
        name: joi_1["default"].string().required(),
        description: joi_1["default"].string().required(),
        productId: joi_1["default"].number().required(),
        userId: joi_1["default"].number().required()
    }).options({ abortEarly: false });
    return JoiSchema.validate(review);
};
exports.validateReview = validateReview;
var validateCoupon = function (coupon) {
    var JoiSchema = joi_1["default"].object({
        name: joi_1["default"].string().required(),
        code: joi_1["default"].string().min(5).max(15).required(),
        discountStatus: joi_1["default"].boolean(),
        productId: joi_1["default"].number().required(),
        discount: joi_1["default"].number().required(),
        startDate: joi_1["default"].date().required(),
        expiryDate: joi_1["default"].date().required()
    }).options({ abortEarly: false });
    return JoiSchema.validate(coupon);
};
exports.validateCoupon = validateCoupon;
//# sourceMappingURL=validator.js.map