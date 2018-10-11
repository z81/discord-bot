import { Client } from "../Client";
import { map, filter, flatMap, take, tap, combineAll, first } from "rxjs/operators";
import dotenv from "dotenv";
import { from, of, forkJoin, iif } from "rxjs";
import { createContainer, asClass, InjectionMode, Lifetime } from "awilix";
import { RedisStore, FileStore } from "../Stores";
import { everyTestSuccess } from "../MessageFilters";
import { ICommand } from "../Command/ICommand";
import { commandContainers, commandNames } from "./commands";
import { Permissions } from "../Permissions/Permissions";
dotenv.config();

const container = createContainer();
const token = process.env.TOKEN;

container.register({
  redisStore: asClass(RedisStore).classic(),
  permissions: asClass(Permissions)
    .classic()
    .singleton(),
  fileStore: asClass(FileStore)
    .classic()
    .singleton(),
  ...commandContainers
});

export class Bot {
  constructor() {
    const permissions = container.resolve<Permissions>("permissions");

    const cmd$ = from(commandNames.map(name => container.resolve<ICommand>(name)));

    const client = new Client("discord", {
      token
    });

    const { messages, ready } = client.streams;

    messages
      .pipe(
        flatMap(msg =>
          cmd$.pipe(
            filter(cmd => everyTestSuccess(cmd, msg)),
            filter(cmd => cmd.test(msg)),
            take(1),
            tap(cmd => console.log(`Run ${cmd.constructor.name}`, msg.content)),
            flatMap(cmd =>
              forkJoin(
                permissions.isAllow(cmd, msg.server.id, msg.author.id, msg.author.roles)
              ).pipe(
                flatMap(d => d),
                tap(isAllow => {
                  if (isAllow || msg.author.isAdmin) {
                    cmd.exec(msg);
                  } else {
                    msg.reply("Недостаточно прав!");
                  }
                })
              )
            )
          )
        )
      )
      .subscribe();

    ready.subscribe(() => console.log("ready"));

    client.login();
  }
}
