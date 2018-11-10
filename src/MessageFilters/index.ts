import { IMessage } from "../Client/IMessage";
import { Message } from "../Client/adapters/Discord/Message";
import { Permissions } from "../Permissions/Permissions";
import { ICommand } from "../Command/ICommand";

const decoratorInstances = new Map<any, any[]>();

export const messageFilter = (clb: Function) => (target: any, k: string) => {
  if (!decoratorInstances.has(target.constructor.name)) {
    decoratorInstances.set(target.constructor.name, []);
  }

  const instances = decoratorInstances.get(target.constructor.name);

  if (instances) {
    instances.push(clb);
  }
};

export const getMessageFilterDecorators = (target: ICommand) => decoratorInstances.get(target);

export const everyTestSuccess = (target: ICommand, message: IMessage) => {
  const filters = decoratorInstances.get(target.constructor.name);

  if (!filters || message.author.isBot)
    return {
      result: false,
      vars: {}
    };

  let variables = {};

  return {
    result: filters.every((clb: Function) => {
      const result: [boolean, object] | boolean = clb(message, target);

      if (result instanceof Array) {
        variables = { ...variables, ...result[1] };

        return result[0];
      }

      return result;
    }),
    vars: variables
  };
};

export const startWith = (text: string) => messageFilter((msg: IMessage) => msg.content.startsWith(text));

export const regEx = (regexp: RegExp, variables: string[] = []) =>
  messageFilter((msg: IMessage) => {
    const result = regexp.exec(msg.content);

    if (!!result) {
      let vars = {};

      variables.forEach((name, i) => {
        vars = { ...vars, [name]: result[i + 1] };
      });

      return [!!result, vars];
    }

    return !!result;
  });

export const hasAttachments = () => messageFilter((msg: IMessage) => msg.attachments.length > 0);

export const noAttachments = () => messageFilter((msg: IMessage) => msg.attachments.length === 0);

export const isServerAdministrator = () => messageFilter((msg: IMessage) => msg.author.isAdmin);

let lastMessageTime = 0;
export const antiSpamTime = (value: number, antiSpamMessage: string) =>
  messageFilter((msg: IMessage) => {
    const time = +Date.now();

    if (time < lastMessageTime + value) {
      msg.reply(antiSpamMessage);
      return false;
    }

    lastMessageTime = time;

    return true;
  });
