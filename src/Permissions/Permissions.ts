import { RedisStore } from "../Stores";
import { ICommand } from "../Command/ICommand";

export interface ICommandPermissions {}

export class Permissions {
  constructor(private redisStore: RedisStore) {}

  setUserAccess(cmd: string, userId: string, serverId: number, value: boolean) {
    const key = `${serverId}/${userId}/${cmd}`;
    return this.redisStore.set(key, value);
  }

  setRoleAccess = (cmd: string, serverId: string, roleName: string) => {
    const key = `${serverId}/${cmd}`;

    if (roleName === "") {
      return this.redisStore.del(key);
    }

    return this.redisStore.set(key, roleName);
  };

  async getPermissions(serverId: string, commandNames: string[]) {
    const result: string[][] = await this.redisStore
      .multi(commandNames.map(name => ["get", `${serverId}/${name}`]))
      .exec();

    return result.map((r, i) => [commandNames[i], r[1]]);
  }

  isAllow = async (
    cmd: ICommand,
    serverId: string,
    userId: string,
    roles: { name: string }[]
  ): Promise<boolean> => {
    const [userResult, roleResult]: [
      [string, boolean],
      [string, string]
    ] = await this.redisStore
      .multi([
        ["get", `${serverId}/${userId}/${cmd.constructor.name}`],
        ["get", `${serverId}/${cmd.constructor.name}`]
      ])
      .exec();

    const [, userPerm] = userResult;
    const [, roleName] = roleResult;

    if (userPerm !== null) return userPerm;
    if (roleName !== null) return !!roles.find(r => r.name === roleName);

    return true;
  };
}
