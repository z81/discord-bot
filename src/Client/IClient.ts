import { Subject } from "rxjs";
import { IMessage } from "./IMessage";

export interface IClientAdapter {
  streams: {
    messages: Subject<IMessage>;
    ready: Subject<IClientAdapter>;
  };

  login(): Promise<void>;
}
