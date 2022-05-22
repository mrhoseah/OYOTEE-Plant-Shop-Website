"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.destroy = exports.update = exports.create = exports.show = exports.listing = void 0;
var client_1 = require("@prisma/client");
var validator_1 = require("../helpers/validator");
var prisma = new client_1.PrismaClient();
var listing = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.coupon.findMany({
                        select: {
                            id: true,
                            name: true,
                            code: true,
                            discount: true,
                            startDate: true,
                            expiryDate: true,
                            _count: {
                                select: { products: true }
                            }
                        }
                    })];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                return [2 /*return*/, res.status(404).json({ message: error_1.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.listing = listing;
var show = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, data, response, couponFound, coupon, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.body.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                data = { id: id };
                response = (0, validator_1.validateCoupon)(data);
                if (response.error) {
                    return [2 /*return*/, res.status(500).send(response.error.details)];
                }
                return [4 /*yield*/, prisma.coupon.findUnique({ where: { id: id } })];
            case 2:
                couponFound = _a.sent();
                if (!couponFound) {
                    throw new Error("Coupon with ID ".concat(id, " does not exist"));
                }
                return [4 /*yield*/, prisma.coupon.findUnique({
                        where: { id: id }
                    })];
            case 3:
                coupon = _a.sent();
                res.status(200).json(coupon);
                return [3 /*break*/, 5];
            case 4:
                error_2 = _a.sent();
                return [2 /*return*/, res.status(404).json({ message: error_2.message })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.show = show;
var create = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, discount, startDate, expiryDate, code, data, response, isCouponCreated, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, name = _a.name, discount = _a.discount, startDate = _a.startDate, expiryDate = _a.expiryDate, code = _a.code;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                data = { name: name, discount: discount, startDate: startDate, expiryDate: expiryDate, code: code };
                response = (0, validator_1.validateCoupon)(data);
                if (response.error) {
                    return [2 /*return*/, res.status(500).send(response.error.details)];
                }
                return [4 /*yield*/, prisma.coupon.findFirst({ where: { code: code } })];
            case 2:
                isCouponCreated = _b.sent();
                if (isCouponCreated) {
                    throw new Error("Coupon already exist.");
                }
                return [4 /*yield*/, prisma.coupon.create({
                        data: {
                            name: name,
                            discount: discount,
                            startDate: startDate,
                            expiryDate: expiryDate,
                            code: code
                        }
                    })];
            case 3:
                _b.sent();
                return [2 /*return*/, res.status(201).json({ message: "Coupon created" })];
            case 4:
                error_3 = _b.sent();
                return [2 /*return*/, res.status(400).json({ message: error_3.message })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.create = create;
var update = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, name, discount, startDate, expiryDate, code, data, response, coupon, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, id = _a.id, name = _a.name, discount = _a.discount, startDate = _a.startDate, expiryDate = _a.expiryDate, code = _a.code;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                data = { id: id, name: name, discount: discount, startDate: startDate, expiryDate: expiryDate, code: code };
                response = (0, validator_1.validateCoupon)(data);
                if (response.error) {
                    return [2 /*return*/, res.status(500).send(response.error.details)];
                }
                return [4 /*yield*/, prisma.coupon.findUnique({ where: { id: id } })];
            case 2:
                coupon = _b.sent();
                if (!coupon) {
                    throw new Error("Coupon with ID ".concat(id, " does not exist"));
                }
                return [4 /*yield*/, prisma.coupon.update({
                        where: {
                            id: id
                        },
                        data: {
                            name: name,
                            code: code,
                            discount: discount
                        }
                    })];
            case 3:
                _b.sent();
                return [2 /*return*/, res.status(201).json({ message: "Coupon updated" })];
            case 4:
                error_4 = _b.sent();
                return [2 /*return*/, res.status(400).json({ message: error_4.message })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.update = update;
var destroy = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, data, response, coupon, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.body.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                data = { id: id };
                response = (0, validator_1.validateCoupon)(data);
                if (response.error) {
                    return [2 /*return*/, res.status(500).send(response.error.details)];
                }
                return [4 /*yield*/, prisma.coupon.findUnique({ where: { id: id } })];
            case 2:
                coupon = _a.sent();
                if (!coupon) {
                    throw new Error("Coupon with ID ".concat(id, " does not exist"));
                }
                return [4 /*yield*/, prisma.coupon["delete"]({
                        where: {
                            id: id
                        }
                    })];
            case 3:
                _a.sent();
                return [2 /*return*/, res.status(204).json({ message: "Coupon deleted" })];
            case 4:
                error_5 = _a.sent();
                return [2 /*return*/, res.status(400).json({ message: error_5.message })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.destroy = destroy;
//# sourceMappingURL=coupon.controller.js.map