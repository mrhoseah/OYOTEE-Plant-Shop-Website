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
exports.__esModule = true;
var controller = __importStar(require("../controllers/products.controller"));
var handleUpload_1 = require("../middleware/handleUpload");
var auth_1 = require("../middleware/auth");
var express_1 = require("express");
var productsRouter = (0, express_1.Router)();
productsRouter.get("/", controller.listing);
productsRouter.post("/create", [handleUpload_1.productImageUpload, auth_1.verifyToken], controller.create);
productsRouter.post("/rating", controller.rate);
productsRouter.post("/like", controller.like);
productsRouter.get("/:id", controller.show);
productsRouter.put("/:id/publish/", [auth_1.verifyToken], controller.publish);
productsRouter.put("/:id/update/", [handleUpload_1.productImageUpload, auth_1.verifyToken], controller.update);
productsRouter["delete"]("/destroy/:id", [auth_1.verifyToken], controller.destroy);
exports["default"] = productsRouter;
//# sourceMappingURL=products.routes.js.map