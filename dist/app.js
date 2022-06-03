"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var config_1 = __importDefault(require("config"));
var helmet_1 = __importDefault(require("helmet"));
var cors_1 = __importDefault(require("cors"));
var body_parser_1 = __importDefault(require("body-parser"));
var auth_routes_1 = __importDefault(require("./routes/auth.routes"));
var categories_routes_1 = __importDefault(require("./routes/categories.routes"));
var products_routes_1 = __importDefault(require("./routes/products.routes"));
var users_routes_1 = __importDefault(require("./routes/users.routes"));
var local_storage_mock_1 = require("@shinshin86/local-storage-mock");
var coupons_routes_1 = __importDefault(require("./routes/coupons.routes"));
var window = {
    localStorage: (0, local_storage_mock_1.getLocalStorageMock)()
};
var _a = config_1["default"].get('App.appConfig'), port = _a.port, baseurl = _a.baseurl, origin = _a.origin;
var app = (0, express_1["default"])();
var corsOptions = {
    credentials: true,
    origin: "http://localhost:3000"
};
app.use(body_parser_1["default"].urlencoded({
    extended: true
}));
app.use(express_1["default"].static('public'));
app.use((0, helmet_1["default"])());
app.use(express_1["default"].json());
app.use((0, cors_1["default"])(corsOptions));
app.use(express_1["default"].urlencoded({ extended: true }));
app.get("/", function (req, res) {
    res.send({ message: "Welcome to Oyotee shop." });
});
app.use('/auth', auth_routes_1["default"]);
app.use(function (req, res, next) {
    if (JSON.parse(window.localStorage.getItem('accessToken'))) {
        return res.status(401).json({ "message": "Please login to get access" });
    }
    return next();
});
app.use('/categories', categories_routes_1["default"]);
app.use('/coupons', coupons_routes_1["default"]);
app.use('/products', products_routes_1["default"]);
app.use('/users', users_routes_1["default"]);
var server = app.listen(port, function () {
    return console.log("\n\uD83D\uDE80 Server ready at: ".concat(baseurl, ":").concat(port, "\n\u2B50\uFE0F Made with \u2764\uFE0F with Prisma: http://prisma.io"));
});
//# sourceMappingURL=app.js.map