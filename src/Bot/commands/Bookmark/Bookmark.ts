import { ICommand } from "../../../Command/ICommand";
import { startWith, regEx } from "../../../MessageFilters";
import { IMessage } from "../../../Client/IMessage";
import { RedisStore } from "../../../Stores";

export class Bookmark implements ICommand {
  public name = "boolmark";

  constructor(private redisStore: RedisStore) {}

  @startWith("b")
  test(text: IMessage) {
    return true;
  }

  async exec(msg: IMessage) {
    //const a = await this.redis.get("Test");
    // console.log(msg.attachments);

    // await this.redis.set("Test", 1);

    console.log("bookmark");
  }
}

export default Bookmark;
