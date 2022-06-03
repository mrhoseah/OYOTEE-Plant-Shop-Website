"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
exports.review = exports.like = exports.show = exports.destroy = exports.drafts = exports.publish = exports.update = exports.create = exports.listing = void 0;
var client_1 = require("@prisma/client");
var local_storage_mock_1 = require("@shinshin86/local-storage-mock");
var joi_1 = __importDefault(require("joi"));
var fs_1 = require("fs");
var path_1 = __importDefault(require("path"));
var window = {
    localStorage: (0, local_storage_mock_1.getLocalStorageMock)()
};
var prisma = new client_1.PrismaClient();
var listing = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var products;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.product.findMany({
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        price: true,
                        categoryId: true,
                        rating: true,
                        reviews: {
                            select: {
                                rateValue: true
                            }
                        },
                        image_path: true,
                        _count: {
                            select: {
                                reviews: true,
                                likes: true
                            }
                        }
                    }
                })];
            case 1:
                products = _a.sent();
                products.forEach(function (element) {
                    element.rating = element._count.reviews > 0 ? (element.reviews.map(function (_a) {
                        var rateValue = _a.rateValue;
                        return rateValue;
                    }).reduce(function (a, b) { return a + b; }, 0)) / element._count.reviews : 0;
                });
                res.status(200).json(products);
                return [2 /*return*/];
        }
    });
}); };
exports.listing = listing;
var create = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, description, price, image, authorId, category, quantity, options, JoiSchema, data, result, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, name = _a.name, description = _a.description, price = _a.price, image = _a.image, authorId = _a.authorId, category = _a.category, quantity = _a.quantity;
                options = {
                    errors: {
                        wrap: {
                            label: ''
                        }
                    }
                };
                JoiSchema = joi_1["default"].object().keys({
                    price: joi_1["default"].number().required(),
                    name: joi_1["default"].string().min(3).required(),
                    description: joi_1["default"].string().required(),
                    quantity: joi_1["default"].number().required(),
                    category: joi_1["default"].number().required()
                }).options({ abortEarly: false });
                data = JoiSchema.validate({ name: name, description: description, price: price, category: category, quantity: quantity }, options);
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                if (data.error) {
                    return [2 /*return*/, res.status(400).json(data.error.details)];
                }
                return [4 /*yield*/, prisma.product.create({
                        data: {
                            name: name,
                            description: description,
                            price: Number(price),
                            quantity: Number(quantity),
                            image: req.file.filename,
                            image_path: req.file.path.split('\\').slice(1).join('\\'),
                            category: { connect: { id: Number(category) } },
                            author: { connect: { id: Number(authorId) } }
                        }
                    })];
            case 2:
                result = _b.sent();
                return [2 /*return*/, res.status(201).json({ id: result.id, name: result.name, description: result.description, image: result.image, price: result.price })];
            case 3:
                error_1 = _b.sent();
                return [2 /*return*/, res.status(400).json({ Error: error_1.message })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.create = create;
var update = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, name, description, price, quantity, productData, oldImage, updatedProduct, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.params, id = _a.id, name = _a.name, description = _a.description, price = _a.price, quantity = _a.quantity;
                return [4 /*yield*/, prisma.product.findUnique({
                        where: { id: Number(id) }
                    })];
            case 1:
                productData = _b.sent();
                if (!productData) {
                    throw new Error("Product with ID ".concat(req.body.id, " does not exist in the database"));
                }
                oldImage = path_1["default"].resolve(__dirname, '../', 'public/products/');
                if ((0, fs_1.existsSync)(oldImage + (productData === null || productData === void 0 ? void 0 : productData.image))) {
                    (0, fs_1.unlink)(oldImage + (productData === null || productData === void 0 ? void 0 : productData.image), function (err) {
                        if (err) {
                            throw new Error(err.message);
                        }
                    });
                }
                return [4 /*yield*/, prisma.product.update({
                        where: { id: Number(id) || undefined },
                        data: { description: description, name: name, image: req.file && req.file.filename, image_path: req.file && req.file.path.split('\\').slice(1).join('\\'), price: price, quantity: quantity }
                    })];
            case 2:
                updatedProduct = _b.sent();
                res.status(200).json({ message: "success" });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _b.sent();
                res.json({ error: error_2.meta.cause });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.update = update;
var publish = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, productData, updatedProduct, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                id = req.params.id;
                return [4 /*yield*/, prisma.product.findUnique({
                        where: { id: Number(id) },
                        select: {
                            published: true
                        }
                    })];
            case 1:
                productData = _a.sent();
                return [4 /*yield*/, prisma.product.update({
                        where: { id: Number(id) || undefined },
                        data: { published: !(productData === null || productData === void 0 ? void 0 : productData.published) }
                    })];
            case 2:
                updatedProduct = _a.sent();
                if (!updatedProduct)
                    res.status(404).send("Product with ID ".concat(req.body.id, " does not exist in the database"));
                res.status(201).json(updatedProduct);
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                res.status(400).json({ error: error_3.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.publish = publish;
var drafts = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var drafts_1, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.product
                        .findMany({
                        where: {
                            published: false
                        }
                    })];
            case 1:
                drafts_1 = _a.sent();
                res.json(drafts_1);
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                res.status(400).json({ error: error_4.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.drafts = drafts;
var destroy = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, product, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, prisma.product["delete"]({
                        where: {
                            id: Number(id)
                        }
                    })];
            case 1:
                product = _a.sent();
                res.status(204).send('Ok');
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                res.status(404).send(err_1.meta.cause);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.destroy = destroy;
var show = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, averagereviews, product, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                id = req.params.id;
                return [4 /*yield*/, prisma.review.aggregate({
                        where: {
                            productId: id
                        }
                    })];
            case 1:
                averagereviews = _a.sent();
                return [4 /*yield*/, prisma.product.findUnique({
                        where: { id: Number(id) },
                        select: {
                            id: true,
                            name: true,
                            description: true,
                            price: true,
                            image_path: true,
                            _count: {
                                select: {
                                    reviews: true,
                                    likes: true
                                }
                            }
                        }
                    })];
            case 2:
                product = _a.sent();
                res.json(__assign(__assign({}, product), { avg_review: averagereviews }));
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                res.status(400).json({ error: err_2.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.show = show;
// export const search = async (req:any, res:any) => {
//   try{
//   const { searchString, skip, take, orderBy } = req.query
//   const or: Prisma.ProductWhereInput = searchString
//     ? {
//         OR: [
//           { name: { contains: searchString as string } },
//           { description: { contains: searchString as string } },
//         ],
//       }
//     : {}
//   const products = await prisma.product.findMany({
//     where: {
//       published: true,
//       ...or,
//     },
//     include: { author: true },
//     take: Number(take) || undefined,
//     skip: Number(skip) || undefined,
//     orderBy: {
//       updatedAt: orderBy as Prisma.SortOrder,
//     },
//   })
//     res.json(products)
//   }
//   catch(err:any){
//     res.status(400).json({error:err.message  })
//   }
// }
var like = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, productId, userId, liked, product, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, productId = _a.productId, userId = _a.userId;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 8, , 9]);
                return [4 /*yield*/, prisma.like.findUnique({
                        where: {
                            likedById_productId: {
                                likedById: userId,
                                productId: productId
                            }
                        }
                    })];
            case 2:
                liked = _b.sent();
                if (!!liked) return [3 /*break*/, 4];
                return [4 /*yield*/, prisma.like.create({
                        data: {
                            likedBy: {
                                connect: { id: userId }
                            },
                            product: {
                                connect: { id: productId }
                            }
                        }
                    })];
            case 3:
                _b.sent();
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, prisma.like["delete"]({
                    where: {
                        likedById_productId: {
                            likedById: userId,
                            productId: productId
                        }
                    }
                })];
            case 5:
                _b.sent();
                _b.label = 6;
            case 6: return [4 /*yield*/, prisma.product.findUnique({
                    where: { id: productId },
                    select: {
                        id: true,
                        _count: {
                            select: {
                                likes: true
                            }
                        }
                    }
                })];
            case 7:
                product = _b.sent();
                return [2 /*return*/, res.status(201).json({ product: product })];
            case 8:
                err_3 = _b.sent();
                res.status(500).json({ error: err_3.message });
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.like = like;
var review = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, productId, userId, content, rating, rated, err_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, productId = _a.productId, userId = _a.userId, content = _a.content, rating = _a.rating;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 7, , 8]);
                return [4 /*yield*/, prisma.review.findUnique({
                        where: {
                            reviewedById_productId: {
                                productId: productId,
                                reviewedById: userId
                            }
                        }
                    })];
            case 2:
                rated = _b.sent();
                if (!rated) return [3 /*break*/, 4];
                return [4 /*yield*/, prisma.review.update({
                        where: {
                            reviewedById_productId: {
                                productId: productId,
                                reviewedById: userId
                            }
                        },
                        data: {
                            reviewedBy: {
                                connect: { id: userId }
                            },
                            product: {
                                connect: { id: productId }
                            },
                            content: content,
                            rateValue: parseFloat(rating)
                        }
                    })];
            case 3:
                _b.sent();
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, prisma.review.create({
                    data: {
                        reviewedBy: {
                            connect: { id: userId }
                        },
                        product: {
                            connect: { id: productId }
                        },
                        content: content,
                        rateValue: parseFloat(rating)
                    }
                })];
            case 5:
                _b.sent();
                _b.label = 6;
            case 6: return [2 /*return*/, res.status(201).json({ message: 'success' })];
            case 7:
                err_4 = _b.sent();
                res.status(500).json({ error: err_4.message });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.review = review;
//# sourceMappingURL=products.controller.js.map