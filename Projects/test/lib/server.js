"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = __importDefault(require("http"));
var PORT = 3000;
var server = http_1.default.createServer(function (req, res) {
    if (req.url === '/') {
        res.writeHead(302, {
            Location: '/hello.html'
        });
    }
    if (req.url === '/getbooks') {
        return;
    }
    res.end('Default response');
});
server.listen(PORT);
//# sourceMappingURL=server.js.map