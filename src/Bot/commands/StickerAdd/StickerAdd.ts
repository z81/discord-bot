import { ICommand } from "../../../Command/ICommand";
import { startWith, regEx, hasAttachments } from "../../../MessageFilters";
import { IMessage } from "../../../Client/IMessage";
import { RedisStore, FileStore } from "../../../Stores";
import uuid from "uuid";
import path from "path";

type Fields = { [k in string]: string };
type Row = { document: string; fields: Fields };

export interface StickersSearchResult {
  count: number;
  rows?: Row[];
}

export class StickerAdd implements ICommand {
  public readonly redisSearchIndex = "sticker3";

  constructor(private redisStore: RedisStore, private fileStore: FileStore) {
    this.init();
  }

  private async init() {
    try {
      await this.redisStore.createTable({
        index: this.redisSearchIndex,
        fields: [["name", "TEXT"], ["path", "TEXT"], ["author", "TEXT"]]
      });
    } catch (e) {}
  }

  @regEx(/^стикер (.*)$/gim, ["name"])
  @hasAttachments()
  test = (msg: IMessage) => {
    return !msg.content.includes("лист");
  };

  async exec(msg: IMessage, { name }: { name: string }) {
    const { url, filename, width } = msg.attachments[0];
    const stickerName = this.escapeStickerName(name);

    if (stickerName === "") {
      return void msg.reply("Невалидное название стикера!");
    }

    if (!width) {
      return void msg.reply("Это не изображение!");
    }

    const { count } = await this.findSticker(stickerName);
    if (count > 0) {
      return void msg.reply("Стикер с таким именем уже добавлен!");
    }

    try {
      const { ext } = path.parse(filename);
      const outPath = `stickers/${uuid.v1()}${ext}`;

      await this.fileStore.saveFromUrl(url, outPath);
      await this.addSticker(stickerName, outPath, msg.author.tag);

      await msg.reply(`Стикер \`${stickerName}\` добавлен!`);

      await msg.remove();
    } catch (e) {
      console.error(e);
      msg.reply("Произошла неизвестная ошибка!");
    }
  }

  private escapeStickerName(msg: string) {
    return msg.replace(/\<@\d+\>/gim, "").trim();
  }

  public findSticker = async (stickerName: string) => {
    const [count, ...rows] = await this.redisStore.search({
      index: this.redisSearchIndex,
      query: stickerName
    });

    const result: StickersSearchResult = {
      count,
      rows: []
    };

    if (count > 0) {
      let document = "";
      let key = "";

      rows.forEach((value, i) => {
        if (i % 2 && result.rows) {
          const fields: Fields = {};

          value.forEach((name: string, i: number) => {
            if (i % 2) {
              fields[key] = name;
            } else {
              key = name;
            }
          });

          result.rows.push({
            document,
            fields
          });
        } else {
          document = value;
        }
      });
    }

    return result;
  };

  public addSticker = (stickerName: string, outPath: string, author: string) =>
    this.redisStore.add({
      index: this.redisSearchIndex,
      document: stickerName,
      language: "russian",
      score: "1.0",
      fields: [["name", stickerName], ["path", outPath], ["author", author]]
    });

  info =
    "Для **добавления стикера** прикрепите к сообщению изображение или анимацию и напишиите `стикер название_стикера`";
}
