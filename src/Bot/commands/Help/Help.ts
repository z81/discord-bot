import { ICommand } from "../../../Command/ICommand";
import { startWith, regEx } from "../../../MessageFilters";
import { IMessage } from "../../../Client/IMessage";
import { RedisStore } from "../../../Stores";
import { commandNames, commandContainers } from "..";
import { container } from "../..";

export class Help implements ICommand {
  constructor(private redisStore: RedisStore) {}

  @startWith("!список команд")
  test(text: IMessage) {
    return true;
  }

  async exec(msg: IMessage) {
    msg.reply(
      `\n**Список команд:**\n` +
        commandNames
          .map(name => container.resolve<ICommand>(name))
          .map(cmd => cmd.info)
          .filter(v => !!v)
          .join("\n")
    );
  }

  info = "";
}
