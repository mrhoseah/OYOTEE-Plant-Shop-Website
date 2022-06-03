"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.userAvatarUpload = exports.productImageUpload = void 0;
var multer_1 = __importDefault(require("multer"));
var path_1 = __importDefault(require("path"));
var productStorage = multer_1["default"].diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images');
    },
    filename: function (req, file, callback) {
        callback(null, "".concat(new Date().getTime().toString(), "-").concat(file.fieldname).concat(path_1["default"].extname(file.originalname)));
    }
});
exports.productImageUpload = (0, multer_1["default"])({
    storage: productStorage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/svg" || file.mimetype == "image/webp") {
            cb(null, true);
        }
        else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg .svg format allowed!'));
        }
    }
}).single("image");
var userStorage = multer_1["default"].diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/avatars');
    },
    filename: function (req, file, callback) {
        callback(null, "".concat(new Date().getTime().toString(), "-").concat(file.fieldname).concat(path_1["default"].extname(file.originalname)));
    }
});
exports.userAvatarUpload = (0, multer_1["default"])({
    storage: userStorage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/svg") {
            cb(null, true);
        }
        else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg .svg format allowed!'));
        }
    }
}).single('avatar');
//# sourceMappingURL=handleUpload.js.map