"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var fs = require("fs");
var FileManager = /** @class */ (function () {
    function FileManager() {
    }
    FileManager.prototype.getCurrentDirectoryBase = function () {
        return process.cwd() + "/";
    };
    FileManager.prototype.directoryExists = function (filePath) {
        return fs.existsSync(filePath);
    };
    FileManager.prototype.resource_path = function (filePath) {
        return path.join(__dirname, "/resources", filePath);
    };
    FileManager.prototype.readFile = function (filePath) {
        filePath = path.join(filePath);
        if (!fs.existsSync(filePath)) {
            throw new Error(filePath + " not exist");
        }
        return fs.readFileSync(filePath).toString("utf-8");
    };
    FileManager.prototype.writeFile = function (filePath, content) {
        if (Array.isArray(content)) {
            var newContent = "";
            for (var _i = 0, content_1 = content; _i < content_1.length; _i++) {
                var c = content_1[_i];
                newContent += c + "\n";
            }
            fs.writeFileSync(filePath, newContent);
        }
        else {
            fs.appendFileSync(filePath, content);
        }
        //fs.writeFileSync(filePath, content);
    };
    FileManager.prototype.isDirectory = function (path) {
        return fs.existsSync(path);
    };
    FileManager.prototype.makeDirectory = function (filePath) {
        fs.mkdirSync(filePath, {
            recursive: true,
        });
    };
    FileManager.prototype.copy = function (from, to) {
        fs.copyFileSync(from, to);
    };
    return FileManager;
}());
exports.default = new FileManager();
//# sourceMappingURL=file.js.map