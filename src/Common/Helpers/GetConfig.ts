import { Config } from "../Types/Config";
import file from "../file";

export const getConfig = (): Config => {
  const fileContent = file.readFile(
    `${file.getCurrentDirectoryBase()}/config.json`
  );
  return JSON.parse(fileContent);
};
