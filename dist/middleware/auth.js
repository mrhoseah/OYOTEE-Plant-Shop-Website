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
exports.validateUser = exports.verifyToken = exports.generateToken = exports.refreshToken = void 0;
var jwt = __importStar(require("jsonwebtoken"));
var client_1 = require("@prisma/client");
var joi_1 = __importDefault(require("joi"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1["default"].config();
var prisma = new client_1.PrismaClient();
function refreshToken(user) {
    return jwt.sign({ user: user }, process.env.SECRET_REFRESH_TOKEN, { expiresIn: '86400' });
}
exports.refreshToken = refreshToken;
function generateToken(user) {
    return jwt.sign({ user: user }, process.env.SECRET_TOKEN, { expiresIn: '86400' });
}
exports.generateToken = generateToken;
function verifyToken(req, res, next) {
    if (req.headers['authorization'] == undefined || req.headers['authorization'] == null) {
        return res.status(403).send({ message: "Auth failed" });
    }
    var token = req.headers['authorization'].replace("Bearer ", "");
    try {
        jwt.verify(token, process.env.SECRET_TOKEN, function (err, decoded) {
            if (err) {
                return res.status(401).send({ message: "Unauthorized" });
            }
            req.user = decoded;
            return next();
        });
    }
    catch (error) {
        return res.sendStatus(401).json(error.message);
    }
}
exports.verifyToken = verifyToken;
;
var validateUser = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, name, password, avatar, options, JoiSchema, data, user, er_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, name = _a.name, password = _a.password, avatar = _a.avatar;
                options = {
                    errors: {
                        wrap: {
                            label: ''
                        }
                    }
                };
                JoiSchema = joi_1["default"].object().keys({
                    email: joi_1["default"].string().email().required(),
                    name: joi_1["default"].string().min(3).required(),
                    password: joi_1["default"].string().required(),
                    avatar: joi_1["default"].string()
                }).options({ abortEarly: false });
                data = JoiSchema.validate({ email: email, name: name, password: password, avatar: avatar }, options);
                _b.label = 1;
            case 1:
                _b.trys.push([1, 5, , 6]);
                if (!data.error) return [3 /*break*/, 2];
                return [2 /*return*/, res.status(500).json(data.error.details)];
            case 2: return [4 /*yield*/, prisma.user.findUnique({
                    where: {
                        email: email
                    }
                })];
            case 3:
                user = _b.sent();
                if (user) {
                    throw new Error("User Already Exist. Please Login");
                }
                return [2 /*return*/, next()];
            case 4: return [3 /*break*/, 6];
            case 5:
                er_1 = _b.sent();
                res.status(400).json(er_1.message);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.validateUser = validateUser;
//# sourceMappingURL=auth.js.map