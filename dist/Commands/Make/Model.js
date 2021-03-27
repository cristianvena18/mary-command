"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeModel = void 0;
var file_1 = require("../../Common/file");
var GetConfig_1 = require("../../Common/Helpers/GetConfig");
var chalk = require("chalk");
var MakeModel = /** @class */ (function () {
    function MakeModel() {
        this.command = "make:model";
        this.describe = "";
    }
    MakeModel.prototype.builder = function (args) {
        return args
            .option("n", {
            alias: "name",
            required: true,
            describe: "Name of model",
        })
            .option("p", {
            alias: "parameters",
            required: true,
            describe: "Attributes of the model",
        });
    };
    MakeModel.prototype.handler = function (args) {
        var argName = args.name;
        var parameters = args.parameters;
        var config = GetConfig_1.getConfig();
        var attributes = parameters.trim().split(",");
        var name = argName.charAt(0).toUpperCase() + argName.slice(1);
        var path = "" + file_1.default.getCurrentDirectoryBase() + config.modelPath + name + ".ts";
        var classAttributes = "@PrimaryGeneratedColumn() \nprivate id: number;";
        var constructorParameters = "";
        var constructorAssignment = "";
        var getMethods = "";
        for (var _i = 0, attributes_1 = attributes; _i < attributes_1.length; _i++) {
            var attribute = attributes_1[_i];
            var name_1 = attribute.split("-")[0];
            var type = attribute.split("-")[1];
            classAttributes += "    @Column()\n private " + name_1 + " " + (MakeModel.isNullable(type) ? "?:" : ":") + " " + (MakeModel.isNullable(type) ? type.slice(1) : type) + "; \n";
            constructorParameters += "        " + name_1 + (MakeModel.isNullable(type) ? "?:" : ":") + " " + (MakeModel.isNullable(type) ? type.slice(1) : type) + " " + (MakeModel.isLastElement(attribute, attributes) ? "" : ",\n");
            constructorAssignment += "        this." + name_1 + " = " + name_1 + (MakeModel.isLastElement(attribute, attributes) ? ";" : ";\n");
            getMethods += MakeModel.isFirstElement(attribute, attributes)
                ? "\n"
                : "\n\n";
            getMethods += "    public get" + (name_1.charAt(0).toUpperCase() + name_1.slice(1)) + "(): " + (MakeModel.isNullable(type) ? type.slice(1) : type) + " \n";
            getMethods += "    {\n";
            getMethods += "        return this." + name_1 + ";\n";
            getMethods += "    }";
        }
        file_1.default.writeFile(path, MakeModel.getTemplate(name, classAttributes, constructorParameters, constructorAssignment, getMethods));
        console.info(chalk.greenBright(" >>> File " + path + " was created"));
    };
    MakeModel.getTemplate = function (name, classAttributes, constructorParameters, constructorAssignment, getMethods) {
        return "import {Entity, PrimaryGeneratedColumn, Column} from \"typeorm\";\n    \n      @Entity()\n      export class " + name + " {\n      \n          " + classAttributes + "\n          \n          public constructor(" + constructorParameters + ") {\n            " + constructorAssignment + "\n          }\n          \n          " + getMethods + "\n      }\n      ";
    };
    MakeModel.isNullable = function (type) {
        return type.includes("?");
    };
    MakeModel.isLastElement = function (index, attributes) {
        return attributes[attributes.length - 1] === index;
    };
    MakeModel.isFirstElement = function (index, attributes) {
        return attributes[0] === index;
    };
    return MakeModel;
}());
exports.MakeModel = MakeModel;
//# sourceMappingURL=Model.js.map