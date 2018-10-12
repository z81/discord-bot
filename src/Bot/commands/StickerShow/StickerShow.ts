import { ICommand } from "../../../Command/ICommand";
import { startWith, regEx, hasAttachments, noAttachments } from "../../../MessageFilters";
import { IMessage } from "../../../Client/IMessage";
import { RedisStore, FileStore } from "../../../Stores";
import { StickerAdd } from "../StickerAdd/StickerAdd";

export class StickerShow implements ICommand {
  constructor(private fileStore: FileStore, private StickerAdd: StickerAdd) {}

  @regEx(/^стикер .*$/gim)
  @noAttachments()
  test = (msg: IMessage) => {
    return !msg.content.includes("лист");
  };

  async exec(msg: IMessage) {
    const stickerQueryName = msg.content.substr(7);

    const { count, rows } = await this.StickerAdd.findSticker(stickerQueryName);

    if (count === 0) {
      return void msg.reply(`Стикер "${stickerQueryName}" не найден!`);
    }

    if (rows) {
      const { fields, document } = rows[0];
      const attach = { files: [this.fileStore.getRealPath(fields.path)] };

      msg.send(`${msg.author}, ${document}`, attach);
    }
  }

  info = "Для **вывода стикера** на экран напишете `стикер название_стикера`";
}
