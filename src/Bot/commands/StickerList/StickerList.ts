import { ICommand } from "../../../Command/ICommand";
import { regEx, antiSpamTime } from "../../../MessageFilters";
import { IMessage } from "../../../Client/IMessage";
import { Permissions } from "../../../Permissions/Permissions";
import { StickerAdd } from "../StickerAdd/StickerAdd";

export class StickerList implements ICommand {
  constructor(public permissions: Permissions, private StickerAdd: StickerAdd) {}

  // @antiSpamTime(5000, "Нельзя вызывать команду так часто!")
  @regEx(/^стикер лист$/gim)
  test = (msg: IMessage) => {
    return true;
  };

  async exec(msg: IMessage) {
    const { rows } = await this.StickerAdd.findSticker("*");

    if (rows) {
      const stickerList = rows.map(r => r.fields["name"]).join(", ");

      if (stickerList) {
        msg.reply(`Список стикеров: \`\`\`${stickerList} \`\`\``);
      } else {
        msg.reply(`Список стикеров пуст!`);
      }
    }
  }

  info = "Что бы посмотреть **список стикеров** напишите `стикер лист`";
}
