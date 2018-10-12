import { IMessage } from "../Client/IMessage";
import { Permissions } from "../Permissions/Permissions";

export interface ICommand {
  info: string;

  test(msg: IMessage, vars: object): boolean;

  exec(msg: IMessage, vars: object): void;

  // permissions?: Permissions;
}
