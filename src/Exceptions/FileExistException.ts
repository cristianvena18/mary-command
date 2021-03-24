export default class FileExistException extends Error {
  constructor(message) {
    super(`File has already exist -> ${message}`);
  }
}
