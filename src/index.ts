#!/usr/bin/env node
import * as yargs from "yargs";
import "reflect-metadata";
import { InitCommand } from "./Commands/InitCommand";
import { MakeController } from "./Commands/Make/Controller";
import { MakeTest } from "./Commands/Make/Test";
import { MakeModel } from "./Commands/Make/Model";
import { MakeRepository } from "./Commands/Make/Repository";
import { MakeUseCase } from "./Commands/Make/UseCase";

yargs
    .usage("Usage: $0 <command> [options]")
    .command(new InitCommand())
    .command(new MakeController())
    .command(new MakeTest())
    .command(new MakeModel())
    .command(new MakeRepository())
    .command(new MakeUseCase())
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
