import fs from "fs";
import request from "request";

const FILE_STORE_PATH = process.env.FILE_STORE_PATH;

export class FileStore {
  public createWriteStream(outPath: string) {
    return fs.createWriteStream(`${FILE_STORE_PATH}/${outPath}`);
  }

  public saveFromUrl(url: string, filename: string) {
    return request(url).pipe(this.createWriteStream(filename));
  }

  public hasFile(path: string) {
    return new Promise(resolve => {
      fs.exists(`${FILE_STORE_PATH}/${path}`, resolve);
    });
  }

  public getRealPath(path: string) {
    return `${FILE_STORE_PATH}/${path}`;
  }
}
