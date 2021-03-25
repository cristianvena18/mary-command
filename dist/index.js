#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var yargs = require("yargs");
require("reflect-metadata");
var InitCommand_1 = require("./Commands/InitCommand");
var Controller_1 = require("./Commands/Make/Controller");
var Test_1 = require("./Commands/Make/Test");
var Model_1 = require("./Commands/Make/Model");
var Repository_1 = require("./Commands/Make/Repository");
var UseCase_1 = require("./Commands/Make/UseCase");
yargs
    .usage("Usage: $0 <command> [options]")
    .command(new InitCommand_1.InitCommand())
    .command(new Controller_1.MakeController())
    .command(new Test_1.MakeTest())
    .command(new Model_1.MakeModel())
    .command(new Repository_1.MakeRepository())
    .command(new UseCase_1.MakeUseCase())
    .recommendCommands()
    .demandCommand(1)
    .strict()
    .help()
    .alias("v", "version")
    .help("h")
    .alias("h", "help").argv;
require("yargonaut")
    .style("blue")
    .style("yellow", "required")
    .helpStyle("green")
    .errorsStyle("red");
//# sourceMappingURL=index.js.map