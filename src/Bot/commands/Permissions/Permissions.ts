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
      const isAllow = mode.trim() === "разрешить";

      try {
        await this.permissions.setRoleAccess(cmd, msg.server.id, isAllow ? role : "");
        await msg.reply("Права изменены!");
      } catch (e) {
        console.error(e);

        await msg.reply("Произошла ошибка!");
      }
    } else if (args.length === 1) {
      let text = `Список прав:\n`;

      const perms = await this.permissions.getPermissions(msg.server.id, commandNames);

      text += perms
        .map(([name, role]) => `cmd: **${name}** allow **${role || "all"}**`)
        .join("\n");

      await msg.reply(text);
    } else {
      await msg.reply("Недостаточно параметров!");
    }
  }
}
