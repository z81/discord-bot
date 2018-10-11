import { IMessage } from "../Client/IMessage";
import { Permissions } from "../Permissions/Permissions";

export interface ICommand {
  test(msg: IMessage): boolean;

  exec(msg: IMessage): void;

  // permissions?: Permissions;
}
