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
      return void msg.reply(
        `Список стикеров: \`\`\`${rows.map(r => r.fields["name"]).join(", ")} \`\`\``
      );
    }

    msg.reply(`Список стикеров пуст!`);
  }
}
