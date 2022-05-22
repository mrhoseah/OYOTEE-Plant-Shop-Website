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
exports.destroy = exports.show = exports.update = exports.create = exports.listing = void 0;
var client_1 = require("@prisma/client");
var validator_1 = require("../helpers/validator");
var prisma = new client_1.PrismaClient();
var listing = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var categories, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.category.findMany({
                        select: {
                            id: true,
                            name: true,
                            description: true
                        }
                    })];
            case 1:
                categories = _a.sent();
                res.status(200).json(categories);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                res.status(404).send(error_1.message);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.listing = listing;
var create = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, description, data, response, takenCategory, result, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, name = _a.name, description = _a.description;
                data = { name: name, description: description };
                response = (0, validator_1.validateCategory)(data);
                _b.label = 1;
            case 1:
                _b.trys.push([1, 6, , 7]);
                if (!response.error) return [3 /*break*/, 2];
                res.status(500).send(response.error.details);
                return [3 /*break*/, 5];
            case 2: return [4 /*yield*/, prisma.category.findUnique({ where: { name: response.value.name } })];
            case 3:
                takenCategory = _b.sent();
                if (takenCategory) {
                    return [2 /*return*/, res.status(409).json({ message: "Category already exist." })];
                }
                return [4 /*yield*/, prisma.category.create({
                        data: {
                            name: response.value.name,
                            description: response.value.description
                        }
                    })];
            case 4:
                result = _b.sent();
                return [2 /*return*/, res.status(201).json({ message: "Ok" })];
            case 5: return [3 /*break*/, 7];
            case 6:
                err_1 = _b.sent();
                return [2 /*return*/, res.status(500).json(err_1.message)];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.create = create;
var update = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, category, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, prisma.category.findUnique({
                        where: { id: Number(id) }
                    })];
            case 1:
                category = _a.sent();
                res.status(200).json(category);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                res.send(error_2.message);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.update = update;
var show = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, category, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, prisma.category.findUnique({
                        where: { id: Number(id) }
                    })];
            case 1:
                category = _a.sent();
                res.status(200).json(category);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                res.send(error_3.messagee);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.show = show;
var destroy = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, user, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, prisma.category["delete"]({
                        where: {
                            id: Number(id)
                        }
                    })];
            case 1:
                user = _a.sent();
                res.status(204).send('Ok');
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                res.status(404).send(err_2.message);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.destroy = destroy;
//# sourceMappingURL=categories.controller.js.map