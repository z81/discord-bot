import * as adapters from "./adapters";
import { IClientAdapter } from "./IClient";
import { Subject } from "rxjs";
import { IMessage } from "./IMessage";

export class Client implements IClientAdapter {
  get streams() {
    return this.client.streams;
  }

  private client: IClientAdapter;

  constructor(private adapterName: string, private config: any) {
    this.client = this.init();
  }

  private init() {
    switch (this.adapterName) {
      case "discord":
        return new adapters.Discord(this.config);
    }

    throw Error("Unsupported client");
  }

  public login() {
    return this.client.login();
  }
}
