import IoRedis from "ioredis";

export interface RedisStoreCrateTableArgs {
  index: string;
  fields: string[][];
}

export interface RedisStoreSearchArgs {
  index: string;
  query: string;
  limit?: string[];
}

export interface RedisStoreAddArgs {
  index: string;
  document: string;
  score: string;
  language: string;
  fields: string[][];
}

export class RedisStore extends IoRedis {
  constructor() {
    super({
      host: process.env.REDIS_HOST
    });
  }

  createTable = ({ index, fields }: RedisStoreCrateTableArgs) =>
    this.runCmd("FT.CREATE", index, "SCHEMA", ...this.fieldsToArray(fields));

  search({ index, query, limit }: RedisStoreSearchArgs) {
    const limitArgs = limit ? ["LIMIT", ...limit] : [];

    return this.runCmd("FT.SEARCH", index, query, ...limitArgs) as Promise<any[]>;
  }

  add = ({ index, document, score, fields, language = "english" }: RedisStoreAddArgs) =>
    this.runCmd(
      "FT.ADD",
      index,
      document,
      score,
      "LANGUAGE",
      language,
      "FIELDS",
      ...this.fieldsToArray(fields)
    );

  runCmd = (name: string, ...args: string[]) =>
    new Promise((resolve, reject) => {
      this.send_command(name, args, (err: any, res: any) => {
        if (err) reject(err);
        else resolve(res);
      });
    });

  private fieldsToArray(fields: string[][]) {
    return fields.reduce((acc: any, cur) => [...acc, ...cur], []);
  }

  multiAsync() {}
}
