import { ICommand } from "../../../Command/ICommand";
import { startWith, regEx } from "../../../MessageFilters";
import { IMessage } from "../../../Client/IMessage";
import { RedisStore } from "../../../Stores";

export class Bookmark implements ICommand {
  constructor(private redisStore: RedisStore) {}

  @startWith("b")
  test(text: IMessage) {
    return true;
  }

  async exec(msg: IMessage) {
    console.log("bookmark");
  }
}
