"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = void 0;
var file_1 = require("../file");
var getConfig = function () {
    var fileContent = file_1.default.readFile(file_1.default.getCurrentDirectoryBase() + "/config.json");
    return JSON.parse(fileContent);
};
exports.getConfig = getConfig;
//# sourceMappingURL=GetConfig.js.map