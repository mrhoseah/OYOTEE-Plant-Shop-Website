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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.destroy = exports.updateProfile = exports.updateUser = exports.deleteProfile = exports.profile = exports.ratings = exports.likes = exports.list = void 0;
var client_1 = require("@prisma/client");
var joi_1 = __importDefault(require("joi"));
var prisma = new client_1.PrismaClient();
var list = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var users, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.user.findMany({ select: {
                            id: true,
                            name: true,
                            email: true,
                            profile: {
                                select: {
                                    avatar: true
                                }
                            }
                        }
                    })];
            case 1:
                users = _a.sent();
                res.json(users);
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                res.status(401).send(err_1.message);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.list = list;
var likes = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, user, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, prisma.profile["delete"]({
                        where: {
                            id: Number(id)
                        }
                    })];
            case 1:
                user = _a.sent();
                res.status(200).send(user);
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                res.status(404).send(err_2.message);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.likes = likes;
var ratings = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, user, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, prisma.profile["delete"]({
                        where: {
                            id: Number(id)
                        }
                    })];
            case 1:
                user = _a.sent();
                res.status(200).send(user);
                return [3 /*break*/, 3];
            case 2:
                err_3 = _a.sent();
                res.status(404).send(err_3.meta.cause);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.ratings = ratings;
var profile = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, user, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, prisma.profile["delete"]({
                        where: {
                            id: Number(id)
                        }
                    })];
            case 1:
                user = _a.sent();
                res.status(200).send(user);
                return [3 /*break*/, 3];
            case 2:
                err_4 = _a.sent();
                res.status(404).send(err_4.meta.cause);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.profile = profile;
var deleteProfile = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, user, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, prisma.profile["delete"]({
                        where: {
                            id: Number(id)
                        }
                    })];
            case 1:
                user = _a.sent();
                res.status(200).send(user);
                return [3 /*break*/, 3];
            case 2:
                err_5 = _a.sent();
                res.status(404).send(err_5.meta.cause);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteProfile = deleteProfile;
var updateUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, name, email, bio, avatar, options, JoiSchema, data, user, updatedUser, err_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                id = req.params.id;
                _a = req.body, name = _a.name, email = _a.email, bio = _a.bio, avatar = _a.avatar;
                options = {
                    errors: {
                        wrap: {
                            label: ''
                        }
                    }
                };
                JoiSchema = joi_1["default"].object().keys({
                    name: joi_1["default"].string(),
                    email: joi_1["default"].string().email().min(5),
                    bio: joi_1["default"].string().min(5),
                    avatar: joi_1["default"].string()
                }).options({ abortEarly: false });
                data = JoiSchema.validate({ name: name, email: email, avatar: avatar, bio: bio }, options);
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                if (data.error) {
                    return [2 /*return*/, res.status(400).json(data.error.details)];
                }
                return [4 /*yield*/, prisma.user.findUnique({
                        where: {
                            id: Number(id)
                        }
                    })];
            case 2:
                user = _b.sent();
                if (!user) {
                    throw new Error("User with ID ".concat(id, " does not exist in the database"));
                }
                return [4 /*yield*/, prisma.user.update({
                        where: {
                            id: Number(id)
                        },
                        data: {
                            name: name,
                            email: email
                        }
                    })];
            case 3:
                updatedUser = _b.sent();
                return [2 /*return*/, res.status(201).send(updatedUser)];
            case 4:
                err_6 = _b.sent();
                return [2 /*return*/, res.status(404).send({ error: err_6.message })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.updateUser = updateUser;
var updateProfile = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, bio, avatar, options, JoiSchema, data, profile_1, err_7;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                id = req.params.id;
                _a = req.body, bio = _a.bio, avatar = _a.avatar;
                options = {
                    errors: {
                        wrap: {
                            label: ''
                        }
                    }
                };
                JoiSchema = joi_1["default"].object().keys({
                    bio: joi_1["default"].string().min(5),
                    avatar: joi_1["default"].string()
                }).options({ abortEarly: false });
                data = JoiSchema.validate({ avatar: avatar, bio: bio }, options);
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                if (data.error) {
                    return [2 /*return*/, res.status(400).json(data.error.details)];
                }
                return [4 /*yield*/, prisma.profile.findUnique({
                        where: {
                            userId: Number(id)
                        }
                    })];
            case 2:
                profile_1 = _b.sent();
                if (!profile_1) {
                    throw new Error("Profile with ID ".concat(id, " does not exist in the database"));
                }
                return [4 /*yield*/, prisma.profile.update({
                        where: {
                            id: Number(id)
                        },
                        data: {
                            userId: Number(id),
                            bio: bio,
                            avatar: req.file.path
                        }
                    })];
            case 3:
                _b.sent();
                return [2 /*return*/, res.status(201).send({ message: "success" })];
            case 4:
                err_7 = _b.sent();
                return [2 /*return*/, res.status(404).send({ error: err_7.message })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.updateProfile = updateProfile;
var destroy = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, user, err_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                id = req.params.id;
                return [4 /*yield*/, prisma.profile.findUnique({
                        where: {
                            id: Number(id)
                        }
                    })];
            case 1:
                user = _a.sent();
                if (!user) {
                    throw new Error("User with ID ".concat(id, " does not exist in the database"));
                }
                return [4 /*yield*/, prisma.user["delete"]({
                        where: {
                            id: Number(id)
                        }
                    })];
            case 2:
                _a.sent();
                return [2 /*return*/, res.status(204).send({ 'message': 'Ok' })];
            case 3:
                err_8 = _a.sent();
                return [2 /*return*/, res.status(404).send({ error: err_8.message })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.destroy = destroy;
//# sourceMappingURL=users.controller.js.map