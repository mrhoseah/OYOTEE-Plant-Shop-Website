"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.signout = exports.resetPassword = exports.forgotPassword = exports.signin = exports.signup = void 0;
var bcrypt = __importStar(require("bcryptjs"));
var client_1 = require("@prisma/client");
var auth_1 = require("../middleware/auth");
var crypto_1 = __importDefault(require("crypto"));
require("dotenv/config");
var local_storage_mock_1 = require("@shinshin86/local-storage-mock");
var joi_1 = __importDefault(require("joi"));
var mail_controller_1 = require("./mail.controller");
var window = {
    localStorage: (0, local_storage_mock_1.getLocalStorageMock)()
};
var prisma = new client_1.PrismaClient();
var options = {
    errors: {
        wrap: {
            label: ''
        },
        abortEarly: false
    }
};
var signup = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, email, password, products, user, newUser, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, name = _a.name, email = _a.email, password = _a.password, products = _a.products;
                user = { name: name, email: email, password: password };
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, prisma.user.create({
                        data: {
                            name: name,
                            email: email,
                            password: bcrypt.hashSync(password, 10),
                            profile: {
                                create: {
                                    bio: "".concat(name, "'s bio")
                                }
                            }
                        },
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    })];
            case 2:
                newUser = _b.sent();
                return [2 /*return*/, res.status(201).send(newUser)];
            case 3:
                error_1 = _b.sent();
                res.status(500).send(error_1.message);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.signup = signup;
var signin = function (req, response) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user, JoiSchema, data, user_1, passwordIsValid, token, accessToken, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password;
                user = { email: email, password: password };
                JoiSchema = joi_1["default"].object({
                    email: joi_1["default"].string().email().required(),
                    password: joi_1["default"].string().min(5).required()
                }).options({ abortEarly: false });
                data = JoiSchema.validate(user, options);
                _b.label = 1;
            case 1:
                _b.trys.push([1, 6, , 7]);
                if (!data.error) return [3 /*break*/, 2];
                return [2 /*return*/, response.json(response.error.details)];
            case 2: return [4 /*yield*/, prisma.user.findUnique({
                    where: {
                        email: email
                    },
                    select: {
                        id: true,
                        password: true,
                        name: true,
                        email: true,
                        profile: {
                            select: {
                                avatar: true
                            }
                        }
                    }
                })];
            case 3:
                user_1 = _b.sent();
                if (!user_1) {
                    throw new Error("Failed!, Invalid credentials!");
                }
                passwordIsValid = bcrypt.compareSync(password, user_1.password);
                if (!passwordIsValid) {
                    throw new Error("Failed!, Invalid credentials!");
                }
                token = (0, auth_1.generateToken)(user_1);
                return [4 /*yield*/, prisma.accessToken.create({
                        data: {
                            user: {
                                connect: {
                                    id: user_1.id
                                }
                            },
                            token: token
                        }, select: {
                            token: true
                        }
                    })];
            case 4:
                accessToken = _b.sent();
                response.status(200).json({ "accessToken": accessToken.token, user: {
                        id: user_1.id,
                        name: user_1.name,
                        email: user_1.email,
                        profile_photo_url: user_1.profile
                    } });
                _b.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_2 = _b.sent();
                response.status(401).json(error_2.message);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.signin = signin;
var forgotPassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var schema, error, user, token, link, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                schema = joi_1["default"].object({ email: joi_1["default"].string().email().required() });
                error = schema.validate(req.body).error;
                if (error)
                    return [2 /*return*/, res.status(400).send(error.details[0].message)];
                return [4 /*yield*/, prisma.user.findUnique({ where: { email: req.body.email } })];
            case 1:
                user = _a.sent();
                if (!user)
                    return [2 /*return*/, res.status(400).send("user with given email doesn't exist")];
                return [4 /*yield*/, prisma.passwordToken.findFirst({
                        where: {
                            userId: user.id
                        }, select: {
                            token: true
                        }
                    })];
            case 2:
                token = _a.sent();
                if (!!token) return [3 /*break*/, 4];
                return [4 /*yield*/, prisma.passwordToken.create({
                        data: {
                            user: { connect: { id: user.id } },
                            token: crypto_1["default"].randomBytes(32).toString("hex")
                        }
                    })];
            case 3:
                token = _a.sent();
                _a.label = 4;
            case 4:
                link = "".concat(process.env.APP_BASEURL, ":").concat(process.env.APP_PORT, "/auth/reset-password/").concat(token.token);
                return [4 /*yield*/, (0, mail_controller_1.sendMail)(user.email, "Password reset - Oyotee Tree Shop", link)];
            case 5:
                _a.sent();
                res.send("password reset link sent to your email account");
                return [3 /*break*/, 7];
            case 6:
                error_3 = _a.sent();
                res.send("An error occured");
                console.log(error_3);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.forgotPassword = forgotPassword;
var resetPassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var schema, error, userToken, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                schema = joi_1["default"].object({ password: joi_1["default"].string().required() });
                error = schema.validate(req.body).error;
                if (error)
                    return [2 /*return*/, res.status(400).send(error.details[0].message)];
                return [4 /*yield*/, prisma.passwordToken.findFirst({
                        where: {
                            token: req.query.token
                        }, select: {
                            id: true,
                            token: true,
                            userId: true
                        }
                    })];
            case 1:
                userToken = _a.sent();
                if (!userToken)
                    throw new Error("Invalid link or expired");
                return [4 /*yield*/, prisma.user.update({
                        where: {
                            id: userToken.userId
                        },
                        data: {
                            password: bcrypt.hashSync(req.body.password, 10)
                        }
                    })];
            case 2:
                _a.sent();
                return [4 /*yield*/, prisma.passwordToken["delete"]({
                        where: {
                            id: userToken.id
                        }
                    })];
            case 3:
                _a.sent();
                return [2 /*return*/, res.status(200).json({ message: "Password reset succesfully" })];
            case 4:
                error_4 = _a.sent();
                res.status(403).json({ message: error_4.message });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.resetPassword = resetPassword;
var signout = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var token, userToken, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                token = req.headers['authorization'].replace("Bearer ", "");
                return [4 /*yield*/, prisma.accessToken.findFirst({
                        where: { token: token }
                    })];
            case 1:
                userToken = _a.sent();
                if (!userToken) {
                    throw new Error("Invalid token");
                }
                return [4 /*yield*/, prisma.accessToken.deleteMany({
                        where: {
                            id: userToken.id
                        }
                    })];
            case 2:
                _a.sent();
                res.status(200).json({ "message": "Logged out" });
                return [2 /*return*/, next()];
            case 3:
                error_5 = _a.sent();
                res.status(401).json({ message: error_5.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.signout = signout;
//# sourceMappingURL=auth.controller.js.map