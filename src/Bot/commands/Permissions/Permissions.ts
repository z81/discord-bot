import { ICommand } from "../../../Command/ICommand";
import { startWith, regEx } from "../../../MessageFilters";
import { IMessage } from "../../../Client/IMessage";
import { RedisStore } from "../../../Stores";
import { Permissions as Perms } from "../../../Permissions/Permissions";
import { commandNames } from "..";

export class Permissions implements ICommand {
  constructor(private redisStore: RedisStore, private permissions: Perms) {}

  @startWith("!права")
  test(text: IMessage) {
    return true;
  }

  async exec(msg: IMessage) {
    if (!msg.author.isAdmin) {
      return void msg.reply("Недостаточно прав!");
    }

    const args = msg.content.split(" ");
    const [_, mode, cmd, role = ""] = args;

    if (args.length >= 3) {
      try {
        const isAllow = mode.trim() === "разрешить";
        await this.permissions.setRoleAccess(cmd, msg.server.id, isAllow ? role : "");
        await msg.reply("Права изменены!");
      } catch (e) {
        console.error(e);
        await msg.reply("Произошла ошибка!");
      }
    } else if (args.length === 1) {
      const perms = await this.permissions.getPermissions(msg.server.id, commandNames);

      await msg.reply(
        `Список прав:\n` +
          perms
            .map(([name, role]) => `cmd: **${name}** allow **${role || "all"}**`)
            .join("\n")
      );
    } else {
      await msg.reply("Недостаточно параметров!");
    }
  }

  info =
    "Для получения **списка прав** напишиште `!права`\n" +
    "Для установки **прав на команду** напишите `!права разрешить название_команды название_роли`\n" +
    "Что бы удалить **доступ по роли** напишите  `!права удалить название_команды`";
}
