import { ICommand } from "../../../Command/ICommand";
import { startWith, regEx, hasAttachments } from "../../../MessageFilters";
import { IMessage } from "../../../Client/IMessage";
import { RedisStore, FileStore } from "../../../Stores";
import { StickerAdd } from "../StickerAdd/StickerAdd";

export class StickerRemove implements ICommand {
  constructor(
    private redisStore: RedisStore,
    private fileStore: FileStore,
    private StickerAdd: StickerAdd
  ) {}

  @regEx(/^удалить стикер (.*)$/gim, ["stickerName"])
  test = (msg: IMessage) => {
    return true;
  };

  async exec(msg: IMessage, { stickerName }: { stickerName: string }) {
    if (!msg.author.isAdmin) {
      return void msg.reply("Недостаточно прав!");
    }

    if (stickerName === "") {
      return void msg.reply("Введите название стикера!");
    }

    const { count } = await this.StickerAdd.findSticker(stickerName);

    if (count === 0) {
      return void msg.reply("Стикер не найден!");
    }

    try {
      await this.removeSticker(stickerName, msg.server.id);
      msg.reply("Стикер удален!");
    } catch (e) {
      console.error(e);
      msg.reply("Произошла ошибка!");
    }
  }

  public removeSticker = (stickerName: string, serverId: string) =>
    this.redisStore.runCmd("FT.DEL", this.StickerAdd.redisSearchIndex, stickerName);

  info = "Дла **удаление стикера** напишите `удалить стикер название`";
}
