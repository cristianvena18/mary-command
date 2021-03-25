"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLastElement = exports.isNullable = void 0;
var isNullable = function (type) {
    return type.includes("?");
};
exports.isNullable = isNullable;
var isLastElement = function (type, list) {
    return list[list.length - 1] === type;
};
exports.isLastElement = isLastElement;
//# sourceMappingURL=ValidationTypes.js.map