export class GetCommonTemplates {
  public static getTsConfigTemplate() {
    return JSON.stringify(
      {
        compilerOptions: {
          lib: ["es5", "es6"],
          target: "es5",
          module: "commonjs",
          moduleResolution: "node",
          outDir: "./build",
          emitDecoratorMetadata: true,
          experimentalDecorators: true,
          sourceMap: true,
          esModuleInterop: true,
        },
      },
      undefined,
      3
    );
  }

  /**
   * Gets contents of the .gitignore file.
   */
  public static getGitIgnoreFile(): string {
    return `.idea/
.vscode/
node_modules/
build/
dist/
tmp/
temp/
yarn.lock`;
  }

  public static getNodePackageTemplate() {
    return JSON.stringify(
      {
        name: "server",
        version: "1.0.0",
        main: "index.js",
        license: "MIT",
        scripts: {
          "make:usecase": "node ./commands/generators",
          start: 'nodemon -e ts --exec "yarn run dev:transpile"',
          "dev:transpile":
            "tsc && node --unhandled-rejections=strict --inspect=0.0.0.0 dist/server.js",
          "prettier:run": "yarn prettier --write src/**/*.ts",
          "make:migration":
            "yarn typeorm migration:create -d ./src/Infrastructure/Persistence/Migrations -n",
          "CI:test": "exit 0",
        },
        dependencies: {
          "cookie-parser": "^1.4.5",
          cors: "^2.8.5",
          express: "^4.17.1",
          helmet: "^4.4.1",
          inversify: "^5.0.5",
          joi: "^17.3.0",
          jsonwebtoken: "^8.5.1",
          "reflect-metadata": "^0.1.13",
          typeorm: "^0.2.30",
          morgan: "^1.10.0",
          mysql: "^2.18.1",
          winston: "^3.3.3",
        },
        devDependencies: {
          "@types/express": "^4.17.11",
          "@types/node": "^14.14.21",
          "@types/jsonwebtoken": "^8.5.0",
          husky: "^4.3.8",
          nodemon: "^2.0.7",
          prettier: "^2.2.1",
          "ts-node": "^9.1.1",
          typescript: "^4.1.3",
        },
        husky: {
          hooks: {
            "pre-commit": "yarn prettier:run && git add -A",
          },
        },
      },
      undefined,
      3
    );
  }

  public static getEnvironmentFile() {
    let r = Math.random().toString(36);

    return `TYPEORM_DATABASE=database
TYPEORM_USERNAME=test
TYPEORM_PASSWORD=test
TYPEORM_HOST=mysql
TYPEORM_PORT=3306
    
NODE_ENV=development
    
HASH_ROUND=12
    
JWT_SECRET=${r}
JWT_EXPIRES_IN=1h
    
MAIL_APIKEY=
    
NO_REPLY_EMAIL=
    
DEBUG_EMAIL=`;
  }
}
