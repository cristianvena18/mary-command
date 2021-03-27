import * as yargs from "yargs";
import file from "../../Common/file";
import { Config } from "../../Common/Types/Config";
import { getConfig } from "../../Common/Helpers/GetConfig";
import * as chalk from "chalk";

export class MakeModel implements yargs.CommandModule {
  command = "make:model";
  describe = "";

  builder(args: yargs.Argv) {
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
  }

  handler(args: yargs.Arguments) {
    const argName = args.name as string;
    const parameters = args.parameters as string;
    const config = getConfig();

    const attributes = parameters.trim().split(",");

    const name = argName.charAt(0).toUpperCase() + argName.slice(1);

    const path = `${file.getCurrentDirectoryBase()}${
      config.modelPath
    }${name}.ts`;

    let classAttributes = "@PrimaryGeneratedColumn() \nprivate id: number;";
    let constructorParameters = "";
    let constructorAssignment = "";
    let getMethods = "";

    for (const attribute of attributes) {
      let name = attribute.split("-")[0];
      let type = attribute.split("-")[1];

      classAttributes += `    @Column()\n private ${name} ${
        MakeModel.isNullable(type) ? "?:" : ":"
      } ${MakeModel.isNullable(type) ? type.slice(1) : type}; \n`;

      constructorParameters += `        ${name}${
        MakeModel.isNullable(type) ? "?:" : ":"
      } ${MakeModel.isNullable(type) ? type.slice(1) : type} ${
        MakeModel.isLastElement(attribute, attributes) ? "" : ",\n"
      }`;
      constructorAssignment += `        this.${name} = ${name}${
        MakeModel.isLastElement(attribute, attributes) ? ";" : ";\n"
      }`;

      getMethods += MakeModel.isFirstElement(attribute, attributes)
        ? "\n"
        : "\n\n";
      getMethods += `    public get${
        name.charAt(0).toUpperCase() + name.slice(1)
      }(): ${MakeModel.isNullable(type) ? type.slice(1) : type} \n`;
      getMethods += `    {\n`;
      getMethods += `        return this.${name};\n`;
      getMethods += `    }`;
    }

    file.writeFile(
      path,
      MakeModel.getTemplate(
        name,
        classAttributes,
        constructorParameters,
        constructorAssignment,
        getMethods
      )
    );

    console.info(chalk.greenBright(" >>> File " + path + " was created"));
  }

  private static getTemplate(
    name: string,
    classAttributes: string,
    constructorParameters: string,
    constructorAssignment: string,
    getMethods: string
  ) {
    return `import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
    
      @Entity()
      export class ${name} {
      
          ${classAttributes}
          
          public constructor(${constructorParameters}) {
            ${constructorAssignment}
          }
          
          ${getMethods}
      }
      `;
  }

  private static isNullable(type) {
    return type.includes("?");
  }

  private static isLastElement(index, attributes) {
    return attributes[attributes.length - 1] === index;
  }

  private static isFirstElement(index, attributes) {
    return attributes[0] === index;
  }
}
