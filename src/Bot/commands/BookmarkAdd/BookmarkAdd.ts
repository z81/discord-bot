import { ICommand } from "../../../Command/ICommand";
import { startWith, regEx } from "../../../MessageFilters";
import { IMessage } from "../../../Client/IMessage";
import { RedisStore } from "../../../Stores";

export class BookmarkAdd implements ICommand {
  constructor(private redisStore: RedisStore) {}

  @regEx(/добавить закладку (".* "*|.*) (.*)/gim, ["name", "text"])
  test(text: IMessage) {
    return true;
  }

  async exec(msg: IMessage, { name, text }: { name: string; text: string }) {
    // await this.redisStore.set(`bookmark_${name}`, text);
  }

  info = "";
}
