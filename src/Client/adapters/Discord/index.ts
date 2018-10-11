import { Client } from "discord.js";
import { Subject } from "rxjs";
import { Message } from "./Message";
import { IClientAdapter } from "../../IClient";
import { IMessage } from "../../IMessage";

interface IDiscordClientConfig extends IClientAdapter {
  token: string;
}

export class Discord {
  private client: Client;
  private config: IDiscordClientConfig;
  public streams = {
    messages: new Subject<IMessage>(),
    ready: new Subject<IClientAdapter>()
  };

  constructor(config: IDiscordClientConfig) {
    this.config = config;
    this.client = new Client();
    this.init();
  }

  private init() {
    const { messages, ready } = this.streams;

    this.client.on("message", msg => messages.next(new Message(msg)));
    this.client.on("ready", () => ready.next(this));
  }

  public async login() {
    await this.client.login(this.config.token);
  }
}
