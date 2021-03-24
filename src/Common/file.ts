import * as path from "path";
import * as fs from "fs";

class FileManager {
  public getCurrentDirectoryBase() {
    return process.cwd();
  }

  public directoryExists(filePath) {
    return fs.existsSync(filePath);
  }

  public resource_path(filePath) {
    return path.join(__dirname, "/resources", filePath);
  }

  public readFile(filePath) {
    filePath = path.join(filePath);
    if (!fs.existsSync(filePath)) {
      throw new Error(`${filePath} not exist`);
    }

    return fs.readFileSync(filePath).toString("utf-8");
  }

  public writeFile(filePath, content: string[] | string) {
    if (Array.isArray(content)) {
      let newContent = "";
      for (const c of content) {
        newContent += `${c}\n`;
      }
      fs.writeFileSync(filePath, newContent);
    } else {
      fs.appendFileSync(filePath, content);
    }
    //fs.writeFileSync(filePath, content);
  }

  public isDirectory(path) {
    return fs.existsSync(path);
  }
  public makeDirectory(filePath) {
    fs.mkdirSync(filePath, {
      recursive: true,
    });
  }
}

export default new FileManager();
